import Link from "next/link"
import type { Experience as ExperienceItem } from "@/lib/experience"
import { LiveClock } from "@/components/live-clock"

const HOME_SKILLS = [
  "TypeScript",
  "Go",
  "Java",
  "Spring Boot",
  "Next.js",
  "React Native",
  "NestJS",
  "PostgreSQL",
  "Redis",
  "Kubernetes",
]

export function Experience({
  experiences,
}: {
  experiences: ExperienceItem[]
}) {
  const topThree = experiences.slice(0, 3)

  return (
    <section id="about" className="site-section">
      <div className="wrap">
        <h2 className="sec-h2">About me</h2>
        <p className="sec-sub">The short version, at a glance.</p>

        <div className="bento-grid">
          <div className="tile t-bio">
            <h3>Who I am</h3>
            <p>
              I turn complex engineering problems into dependable software. I’ve
              spent over seven years shipping banking backends, multimodal
              transit engines, and full-stack web products for teams in
              Tanzania, South Korea, and remotely.
            </p>
            <div>
              {HOME_SKILLS.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="tile t-time">
            <h3>Dar es Salaam</h3>
            <LiveClock />
            <p>Local time (EAT). I reply within 24 hours.</p>
          </div>

          <div className="tile t-now">
            <h3>Right now</h3>
            <p>
              Building distributed Java &amp; Spring Boot banking services at
              NBC Bank and maintaining open-source localization and transit
              tools.
            </p>
          </div>

          <div className="tile t-xp">
            <h3>
              <Link
                href="/experience#experience"
                style={{ color: "var(--ink)", textDecoration: "none" }}
              >
                Experience
              </Link>
            </h3>
            <ul className="xp-mini">
              {topThree.map((exp) => (
                <li key={exp.slug}>
                  <span>
                    <Link
                      href="/experience#experience"
                      style={{ color: "var(--ink)", textDecoration: "none" }}
                    >
                      {exp.title}, {exp.company}
                    </Link>
                  </span>
                  <small>{exp.period}</small>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
              <Link href="/experience#experience">
                Full role details and CV →
              </Link>
            </p>
          </div>

          <div className="tile t-how">
            <h3>How I work</h3>
            <p>
              I own features from schema design through production deployment,
              verify every change with automated tests, and keep communication
              direct and clear.
            </p>
          </div>
        </div>

        <p className="more-link">
          <Link href="/experience">More about me and my full experience</Link>
        </p>
      </div>
    </section>
  )
}
