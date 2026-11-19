---
title: "How to Build Passkeys for Multi-Factor Authentication (And 4 Production Traps to Avoid)"
excerpt: "SMS and TOTP codes can be phished in real time. Learn how to implement passkeys for multi-factor authentication with WebAuthn, TypeORM, and NestJS."
date: "June 24, 2026"
readTime: "9 min read"
tags: ["WebAuthn", "Passkeys", "MFA"]
project: "passkey-auth"
---

A user clicks a convincing login link, types their password, opens their authenticator app, and enters a valid 6-digit TOTP code. Seconds later, an attacker has their session cookie—because a reverse-proxy phishing kit (like Evilginx) sat in the middle and replayed everything in real time.

That’s the uncomfortable truth about SMS and TOTP: they don’t check *which domain* the user is actually talking to. Using **passkeys for multi-factor authentication** fixes both security and UX at once, replacing copy-pasted codes with phishing-resistant, domain-bound cryptography triggered by FaceID, TouchID, or Windows Hello.

In this walkthrough, you’ll see how WebAuthn works under the hood, how to build a complete passkey MFA flow with **TypeORM, PostgreSQL, NestJS, and `@simplewebauthn`**, and the **4 production gotchas** (including a nasty PostgreSQL timezone bug) that can silently break it.

## 1. Why SMS and TOTP Break—and How WebAuthn Fixes It

Traditional second factors rely on **shared secrets**—a 6-digit code that both the user and the server know. If a user types that code into a spoofed domain, the phishing proxy forwards it straight to your server and steals the session.

On top of that, traditional MFA hurts UX. Hunting for a phone, opening an authenticator app, and racing a 30-second timer creates friction—which leads to lower MFA adoption and more locked-out support tickets.

**WebAuthn flips the model to asymmetric cryptography:**
- During registration, the user’s device generates a **public-private key pair**.
- The **private key** stays locked inside hardware-backed storage (like a TPM or Secure Enclave) and only unlocks after local biometric or PIN verification.
- Your server stores **only the public key**.
- Most importantly, the browser binds every credential to the **exact origin domain**. If a user lands on a spoofed domain, the authenticator simply refuses to sign the challenge.

Here is the full back-and-forth between your frontend, the browser’s WebAuthn API, and your backend:

```
+------------+             +------------+             +------------+
|   Client   |             |  Browser   |             |   Server   |
| (Frontend) |             | (WebAuthn) |             | (Backend)  |
+-----+------+             +-----+------+             +-----+------+
      |                          |                          |
      |--- 1. POST /options ---->|                          |
      |                          |--- 2. POST /options ---->|
      |                          |<-- 3. Options + Chall ---|
      |<-- 4. Options + Chall ---|                          |
      |                          |                          |
      |--- 5. startRegistration()|                          |
      |      (Asks user/PIN)     |                          |
      |<-- 6. Signed Assertion --|                          |
      |                          |                          |
      |--- 7. POST /verify ----->|                          |
      |      (Signed response)   |--- 8. POST /verify ----->|
      |                          |      (Verify Signature)  |
      |                          |<-- 9. JWT / Session -----|
      |<-- 10. Success (JWT) ----|                          |
```

## 2. Design Your Passkey Database Schema (TypeORM + PostgreSQL)

One user will often register multiple devices (a laptop, a phone, a hardware key). That means you need a **one-to-many** relationship between users and passkey credentials.

Each credential record stores four key pieces of data: the **credential ID**, the **public key**, **transport hints** (e.g., `internal`, `usb`, `hybrid`), and a **signature counter**.

Here’s the TypeORM entity from [passkey-credential.entity.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/users/entities/passkey-credential.entity.ts):

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('passkey_credentials')
export class PasskeyCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  credentialID: string;

  @Column()
  publicKey: string;

  @Column({ type: 'int', default: 0 })
  counter: number;

  @Column({ nullable: true })
  transports: string; // JSON stringified array of AuthenticatorTransport

  @ManyToOne(() => User, (user) => user.credentials)
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
```

If you also want to support **usernameless flows** (where you don't know *which* user is signing in until they present a passkey), store active challenges in a dedicated table like [challenge.entity.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/users/entities/challenge.entity.ts):

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  challenge: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
```

Finally, the [user.entity.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/users/entities/user.entity.ts) entity links to all registered credentials and holds a temporary `currentChallenge` column:

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PasskeyCredential } from './passkey-credential.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  currentChallenge?: string | null;

  @OneToMany(() => PasskeyCredential, (credential) => credential.user)
  credentials: PasskeyCredential[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```

> **Notice `type: 'timestamptz'`?** Keep an eye on that—it prevents a subtle PostgreSQL expiration bug we’ll unpack in Section 6.

## 3. Generate the Registration Challenge on the Backend

Every WebAuthn flow starts on the server. Your backend generates a fresh, cryptographically random **challenge** and sends it back with your Relying Party (`rpID`) settings.

Using `@simplewebauthn/server` (`v13.3.0`) in [auth.service.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/auth/auth.service.ts), two details matter right away:
- Convert `userID` to a `Uint8Array` using `isoUint8Array.fromUTF8String`.
- Populate `excludeCredentials` so a user can’t accidentally register the same physical device twice.

```typescript
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { isoUint8Array } from '@simplewebauthn/server/helpers';

async function getRegistrationOptions(email: string) {
  let user = await this.userRepository.findOne({
    where: { email },
    relations: ['credentials'],
  });

  if (!user) {
    user = this.userRepository.create({ email });
    await this.userRepository.save(user);
  }

  const options = await generateRegistrationOptions({
    rpName: 'Passkey Auth App',
    rpID: this.rpID, // e.g., 'localhost'
    userID: isoUint8Array.fromUTF8String(user.id),
    userName: user.email,
    userDisplayName: user.email,
    attestationType: 'none',
    excludeCredentials: (user.credentials || []).map((cred) => ({
      id: cred.credentialID,
    })),
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
    supportedAlgorithmIDs: [-7, -257], // ES256 and RS256 algorithms
  });

  user.currentChallenge = options.challenge;
  await this.userRepository.save(user);

  return options;
}
```

## 4. Trigger the Biometric Prompt in the Browser

On the frontend, the browser mediates between your app and the OS authenticator. Using `@simplewebauthn/browser` handles the messy base64url encoding/decoding required by the native `navigator.credentials` API.

The client flow in [auth.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/client/src/utils/auth.ts) is just three steps: fetch options, call `startRegistration`, and send the signed response back to the server.

```typescript
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const registerAndStorePasskey = async (email: string) => {
  // 1. Fetch challenge and options from backend
  const optionsRes = await fetch(`${API_BASE}/register-options`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!optionsRes.ok) throw new Error("Failed to get registration options");
  const options = await optionsRes.json();

  // 2. Invoke browser WebAuthn API
  const attResp = await startRegistration({ optionsJSON: options });

  // 3. Post attestation response back to backend
  const verifyRes = await fetch(`${API_BASE}/register-verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, ...attResp }),
  });
  if (!verifyRes.ok) throw new Error("Failed to verify registration");
  const result = await verifyRes.json();

  return result.verified;
};
```

## 5. Verify Signatures and Block Replay Attacks

Once the browser returns the signed payload, your backend has to prove two things: **the signature matches the stored challenge**, and **the challenge came from your exact origin and `rpID`**.

### Verifying Registration

In `@simplewebauthn/server@13.3.0`, the verified credential lives under `verification.registrationInfo.credential`. Convert the public key buffer with `isoBase64URL.fromBuffer` before saving it, then immediately clear `user.currentChallenge` so it can’t be reused.

```typescript
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

async function verifyRegistration(email: string, body: RegistrationResponseJSON) {
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user || !user.currentChallenge) {
    throw new BadRequestException('Challenge not found');
  }

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: this.origin,
    expectedRPID: this.rpID,
  });

  if (verification.verified && verification.registrationInfo) {
    const { id: credentialID, publicKey: credentialPublicKey, counter } =
      verification.registrationInfo.credential;

    const newCredential = this.credentialRepository.create({
      credentialID,
      publicKey: isoBase64URL.fromBuffer(credentialPublicKey),
      counter,
      user,
      transports: JSON.stringify(body.response.transports || []),
    });

    await this.credentialRepository.save(newCredential);
    user.currentChallenge = null;
    await this.userRepository.save(user);

    return { verified: true };
  }
  throw new BadRequestException('Registration verification failed');
}
```

### Verifying Subsequent Logins (Assertions)

When the user authenticates later, your backend runs four checks:
1. **Look up the credential** by `body.id` to find the user.
2. **Validate and expire the challenge** (5-minute TTL) from the global `challenges` table—then delete it immediately to prevent replay.
3. **Fall back to `user.currentChallenge`** if you’re running a username-first flow.
4. **Verify the signature and update the counter** via `verifyAuthenticationResponse`.

*(Note: For hardware-bound keys like YubiKeys, a counter that doesn’t increment signals a cloned token—but synced cloud passkeys behave differently. See Gotcha #3 below before enforcing strict counter blocks.)*

```typescript
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

async function verifyAuthentication(body: AuthenticationResponseJSON) {
  // 1. Look up the credential directly by its ID to find the associated user
  const dbCredential = await this.credentialRepository.findOne({
    where: { credentialID: body.id },
    relations: ['user'],
  });

  if (!dbCredential) {
    throw new BadRequestException('Credential not found');
  }

  const user = dbCredential.user;
  if (!user) {
    throw new BadRequestException('User not found');
  }

  let expectedChallenge: string | null = null;

  // 2. Decode the challenge from clientDataJSON to check the global challenges table first (for user-nameless flow)
  try {
    const clientDataBuffer = isoBase64URL.toBuffer(body.response.clientDataJSON);
    const clientData = JSON.parse(Buffer.from(clientDataBuffer).toString('utf-8')) as { challenge?: string };
    const challenge = clientData.challenge;

    if (challenge) {
      const dbChallenge = await this.challengeRepository.findOne({
        where: { challenge },
      });

      if (dbChallenge) {
        // Enforce challenge expiration (5 minutes)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        if (dbChallenge.createdAt.getTime() < fiveMinutesAgo) {
          await this.challengeRepository.remove(dbChallenge);
          throw new BadRequestException('Challenge expired');
        }
        expectedChallenge = dbChallenge.challenge;
        await this.challengeRepository.remove(dbChallenge);
      }
    }
  } catch (err) {
    if (err instanceof BadRequestException) throw err;
    throw new BadRequestException('Invalid authentication data or challenge expired');
  }

  // 3. Fallback to user's currentChallenge if not found in the global challenges table
  if (!expectedChallenge) {
    expectedChallenge = user.currentChallenge ?? null;
    if (expectedChallenge) {
      user.currentChallenge = null;
      await this.userRepository.save(user);
    }
  }

  if (!expectedChallenge) {
    throw new BadRequestException('Challenge not found or invalid');
  }

  // 4. Verify assertion signature using WebAuthn helper
  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge,
    expectedOrigin: this.origin,
    expectedRPID: this.rpID,
    credential: {
      id: dbCredential.credentialID,
      publicKey: isoBase64URL.toBuffer(dbCredential.publicKey),
      counter: dbCredential.counter,
      transports: JSON.parse(dbCredential.transports || '[]'),
    },
  });

  if (verification.verified) {
    // Save the incremented counter to prevent cloned authenticator replays
    dbCredential.counter = verification.authenticationInfo.newCounter;
    await this.credentialRepository.save(dbCredential);

    return { verified: true };
  }

  throw new BadRequestException('Authentication verification failed');
}
```

## 6. 4 Production Gotchas That Will Break Passkey MFA

Getting passkeys working on `localhost` is the easy part. These four edge cases are where real deployments usually trip up:

### 1. Relying Party ID (`rpID`) Lock-In

Credentials are permanently tied to the `rpID` used at registration. If you ever rebrand from `my-app.io` to `my-app.com`, existing passkeys stop working.

In local dev, never use a raw IP address as `rpID`—stick to `localhost` or a valid domain, or the browser will throw:

```text
DOMException: The relying party ID is not a valid domain string.
```

### 2. Missing HTTPS on Staging Environments

WebAuthn only runs in a **secure context** (HTTPS or `localhost`). Deploy to an HTTP staging server and `navigator.credentials` silently becomes `undefined`, crashing your bundle with:

```text
TypeError: Cannot read properties of undefined (reading 'create')
```

### 3. Synced Passkeys Don’t Always Increment Counters

Cloud-synced passkeys (Apple iCloud Keychain, Google Password Manager) replicate credentials across devices, so their signature counter doesn’t always increment sequentially.

If you strictly reject every login where `newCounter <= oldCounter`, **you will lock out legitimate users.** Restrict strict counter checks to hardware-bound keys (like YubiKeys) by checking the credential’s AAGUID or transport types.

### 4. The PostgreSQL Timezone Bug That Instant-Expires Challenges

In TypeORM with PostgreSQL, `@CreateDateColumn()` defaults to `timestamp without time zone`. When the `pg` driver reads that column back, it interprets it in your Node.js server’s local timezone.

If your server runs in `UTC+3`, the parsed `Date` is shifted **3 hours into the past**—so your 5-minute challenge check fails *immediately* on every single login. Always use `timestamptz`:

```typescript
@CreateDateColumn({ type: 'timestamptz' })
createdAt: Date;
```

<!-- TODO: Optional — add 1-2 sentences if you hit this UTC+3 bug firsthand while building the demo -->

## 7. What the Payloads Actually Look Like on the Wire

If you’re debugging a failing WebAuthn request, it helps to see the exact JSON shapes moving between your browser and NestJS endpoints.

1. **Server returns registration options + challenge:**
   ```json
   {
     "challenge": "U3VwZXJTZWN1cmVDaGFsbGVuZ2VCYXNlNjQ",
     "rp": { "name": "Passkey Auth App", "id": "localhost" },
     "user": {
       "id": "VVNJRC0xMjM0NTY",
       "name": "developer@example.com",
       "displayName": "developer@example.com"
     },
     "pubKeyCredParams": [
       { "type": "public-key", "alg": -7 },
       { "type": "public-key", "alg": -257 }
     ],
     "authenticatorSelection": {
       "residentKey": "required",
       "userVerification": "preferred"
     },
     "excludeCredentials": []
   }
   ```
2. **Browser passes those options to `startRegistration({ optionsJSON: options })`.**
3. **After biometric verification, the browser returns the signed attestation:**
   ```json
   {
     "id": "ARuS_3Xv8B-9D...",
     "rawId": "ARuS_3Xv8B-9D...",
     "type": "public-key",
     "response": {
       "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiVTM...",
       "attestationObject": "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVj...",
       "transports": ["internal"]
     }
   }
   ```
4. **Server verifies the signature** on `clientDataJSON` and `attestationObject`, matches the challenge in PostgreSQL, stores the public key, and returns `{ verified: true }`.

## The Key Takeaway

Adding **passkeys for multi-factor authentication** is one of the rare security upgrades that makes your app **both harder to phish and faster to sign into**.

You don’t need to rip out passwords on day one. Start by adding the `PasskeyCredential` and `Challenge` tables, wire up `@simplewebauthn/server`, and let users opt into biometric MFA alongside their existing login.

You can explore the complete working NestJS + Next.js implementation in the [passkey-auth-demo repository on GitHub](https://github.com/nelsonfrank/passkey-auth-demo).

**Are you still relying on TOTP/SMS for MFA, or have you started rolling out passkeys in production—and what edge case surprised you most?** Share your experience or pass this along to a teammate working on auth.
