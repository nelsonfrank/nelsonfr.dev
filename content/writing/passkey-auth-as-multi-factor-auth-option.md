---
title: "Using Passkeys for Multi-Factor Authentication"
excerpt: "A deep dive into using passkeys for multi-factor authentication"
date: "June 24, 2026"
readTime: "6 min read"
tags: ["WebAuthn", "Passkeys", "MFA"]
---

Traditional multi-factor authentication (MFA) mechanisms like SMS and TOTP codes fail to protect users against modern, reverse-proxy phishing kits that capture session tokens in real-time. Passkeys, built on the WebAuthn standard, eliminate this vulnerability by binding public-key cryptography directly to the application's domain. By integrating passkeys as an MFA factor, you replace vulnerable out-of-band codes with phishing-resistant, biometric-triggered cryptographic assertions. This article explores WebAuthn, its benefits over traditional MFA, and how to implement it in your application.

## The Limits of Traditional Second Factors

Most applications implement MFA using time-based one-time passwords (TOTP) or SMS verification. These methods fall short because they do not verify the destination domain of the login attempt. A user tricked by a phishing proxy (such as Evilginx) will willingly enter their password and TOTP code, which the proxy intercepts and replays to the legitimate server to steal the session cookie.

Traditional MFA also degrades user experience. Requiring a user to locate a phone, open an authenticator app, copy a six-digit code, and enter it before a session expires creates sign-in friction. This friction directly translates to lower MFA adoption rates and increased support tickets for locked-out accounts.

Integrating passkeys solves both security and usability concerns. Because WebAuthn authenticators scope credential generation to the browser's origin, they refuse to sign challenges from spoofed domains. This shift to local biometrics (such as TouchID, FaceID, or Windows Hello) simplifies MFA from a multi-device task to a single local gesture.

## The Mechanics of WebAuthn Cryptography

WebAuthn shifts the burden of credential verification from shared secrets to asymmetric cryptography. During registration, the authenticator generates a public-private key pair on the client device. The private key remains locked inside the device’s hardware-backed secure enclave (e.g., TPM or Secure Enclave), accessible only after local user verification. The server stores only the public key.

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

## Relational Database Schema Design for Storing Credentials

To support passkeys, you must model credentials in your database to associate multiple authenticators with a single user account. Each record must store the credential ID, the public key, transport details, and an authentication counter.

In this implementation using TypeORM in [passkey-credential.entity.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/users/entities/passkey-credential.entity.ts), the database schema explicitly maps these fields, using timezone-aware column types to avoid synchronization issues:

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

To support user-nameless flows where we must track active sessions before identifying the user, we also persist generated cryptographic challenges in a dedicated table represented by [challenge.entity.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/users/entities/challenge.entity.ts):

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

The user entity in [user.entity.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/users/entities/user.entity.ts) maintains a one-to-many relationship with this credential table and preserves a temporary challenge column, as well as audit timestamps:

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

## Backend Challenge Generation and Registration Flow

WebAuthn operations always begin on the server. You must generate a cryptographically random challenge and return it alongside the relying party configuration.

Using `@simplewebauthn/server` (version `13.3.0`), we construct the registration options within [auth.service.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/backend/src/auth/auth.service.ts). The `userID` must be passed as a `Uint8Array`, and existing credentials must be excluded so the user does not register the same physical device twice:

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

## Client-Side Browser Orchestration with WebAuthn

The browser acts as the mediator between the frontend application and the operating system's WebAuthn client. Using `@simplewebauthn/browser` ensures correct base64url conversion when calling the browser APIs.

The frontend retrieves options from the backend endpoints, triggers the local authenticator dialog, and submits the signed credential payload back for verification. This sequence in [auth.ts](https://github.com/nelsonfrank/passkey-auth-demo/blob/main/client/src/utils/auth.ts) shows the browser execution:

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

## Verification Logic and Preventing Clone Replay Attacks

When the client returns the signed attestation (during registration) or assertion (during authentication), the server must verify the cryptographic signatures against the stored challenge.

We verify the client response on the backend. Under `@simplewebauthn/server@13.3.0`, verification results contain a nested `registrationInfo` property. Convert the public key buffer into a base64 string using `isoBase64URL.fromBuffer` before persisting it to the database:

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

During subsequent authentication, you verify the assertion against the stored public key. The server must check the signature counter. If the authenticator returns a counter value lower than or equal to the saved counter, someone has likely cloned the physical token, and you must reject the login:

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

## Edge Cases, Synced Passkeys, and RP_ID Gotchas

Integrating passkeys introduces specific operational edge cases that differ from traditional authentication systems:

*   **Relying Party ID (RP_ID) Lock-in**: Authenticators tie the generated credentials to the `rpID` specified during registration. If your application switches domains from `my-app.io` to `my-app.com`, existing passkeys will not work. In local development, configuring `rpID` to anything other than `localhost` or a valid domain (like an IP address) causes browser security exceptions:
    ```
    DOMException: The relying party ID is not a valid domain string.
    ```
*   **Secure Context Constraints**: WebAuthn requires a secure context (HTTPS). The browser's `navigator.credentials` object will evaluate to `undefined` on non-secure connections, except on `localhost`. If deploying a staging site without TLS, your JS bundle will throw a runtime error:
    ```
    TypeError: Cannot read properties of undefined (reading 'create')
    ```
*   **Synced Passkey Counter Logic**: Cloud-backed passkeys (like Apple iCloud Keychain or Google Password Manager) sync across multiple client devices. Because these providers distribute copies of the credential, the signature counter does not always increment sequentially between devices. If you enforce strict counter checks (`newCounter <= oldCounter`) on synced passkeys, you will cause false-positive authentication blocks. Restrict strict counter checks to hardware-bound security keys (like YubiKeys) by inspecting the credential's AAGUID or transport types.
*   **PostgreSQL Timezone Discrepancies and Challenge Expiration**: When checking if a challenge has expired (e.g., `dbChallenge.createdAt.getTime() < Date.now() - 5 * 60 * 1000`), the column type must be timezone-aware. In TypeORM with PostgreSQL, `@CreateDateColumn()` defaults to `timestamp without time zone` columns. When the pg driver queries the database, it parses the timezone-naive string using the Node.js application server's local timezone. If the server runs in a local timezone (e.g., `UTC+3`), the parsed Date object is shifted 3 hours into the past, causing the challenge to immediately trigger expiration exceptions. To prevent this, always specify `type: 'timestamptz'` (timestamp with time zone) in your date-time columns:
    ```typescript
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
    ```

## An End-to-End Walkthrough of a Passkey MFA Flow

This trace logs the payload shapes passed between the browser and NestJS endpoints during registration.

1.  The client initiates registration by posting the email. The server returns options configured with a cryptographic challenge:
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
2.  The client browser intercepts this object and passes it to `startRegistration({ optionsJSON: options })`.
3.  The user performs biometric verification. The browser then returns the serialized attestation object containing the signature:
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
4.  The server verifies the signature on `clientDataJSON` and `attestationObject`, matches the returned challenge to the database-stored challenge, extracts the public key, and returns `{ verified: true }`.

## Actionable Next Steps for Deploying Passkey MFA

Using passkeys as an MFA option removes the threat of real-time reverse-proxy phishing attacks while reducing user login friction. A robust integration requires storing credentials mapped to users, validating challenges on secure origins, and verifying signature counters. Update your TypeORM schemas today to support WebAuthn entities, and configure `@simplewebauthn/server` inside your authentication controller.