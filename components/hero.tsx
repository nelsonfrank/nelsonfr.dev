import Image from "next/image"
import { TrackedAnchor } from "@/components/tracked-link"

export const AVAILABILITY_TEXT = "Available for full-time & freelance roles"

export function Hero() {
  return (
    <div className="wrap">
      <header className="hero-grid">
        <div>
          {AVAILABILITY_TEXT && (
            <span className="avail-pill">
              <i aria-hidden="true" />
              {AVAILABILITY_TEXT}
            </span>
          )}

          <h1 className="hero-h1">
            I build fast, <span className="hl-word">reliable</span> software.
          </h1>

          <p className="hero-intro">
            I’m Nelson Frank, a full-stack engineer in Dar es Salaam. I build
            backend services, web platforms, and mobile apps in TypeScript, Go,
            Java, and Next.js, from first sketch to production.
          </p>

          <div className="cta-row">
            <TrackedAnchor
              className="btn p"
              href="#work"
              eventName="cta_see_work_clicked"
            >
              View my work
            </TrackedAnchor>
            <TrackedAnchor
              className="btn s"
              href="/cv.pdf"
              download="Nelson-Frank-CV.pdf"
              eventName="cta_download_cv_clicked"
            >
              Download CV
            </TrackedAnchor>
          </div>
        </div>

        <div className="arched-photo">
          <div className="arched-photo-inner">
            <Image
              src="/landing-page.png"
              alt="Portrait of Nelson Frank"
              width={480}
              height={600}
              priority
              sizes="(max-width: 820px) 224px, 380px"
              className="w-full h-full object-contain object-bottom select-none"
            />
          </div>
          <em>7+ years building</em>
        </div>
      </header>
    </div>
  )
}
