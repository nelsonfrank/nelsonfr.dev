"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import type { Experience } from "@/lib/experience"

const METRIC_PATTERNS = [
  "32% of commits",
  "5 concurrent",
  "3 enterprise",
  "60%",
  "99.9% uptime",
  "sub-1s",
  "50%",
  "3 junior developers",
]

function highlightBulletMetrics(text: string): React.ReactNode {
  let matchedPattern: string | null = null
  let matchedIndex = -1

  for (const pattern of METRIC_PATTERNS) {
    const idx = text.indexOf(pattern)
    if (idx !== -1 && (matchedIndex === -1 || idx < matchedIndex)) {
      matchedPattern = pattern
      matchedIndex = idx
    }
  }

  if (!matchedPattern || matchedIndex === -1) {
    return text
  }

  const before = text.slice(0, matchedIndex)
  const match = text.slice(matchedIndex, matchedIndex + matchedPattern.length)
  const after = text.slice(matchedIndex + matchedPattern.length)

  return (
    <>
      {before}
      <b>{match}</b>
      {after}
    </>
  )
}

const SKILL_GROUPS = [
  {
    title: "Build (Frontend & Mobile)",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
    ],
  },
  {
    title: "Backend & Data",
    skills: [
      "Go",
      "Java",
      "Spring Boot",
      "NestJS",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Elasticsearch",
    ],
  },
  {
    title: "Cloud, Testing & Workflow",
    skills: [
      "Kubernetes",
      "Docker",
      "AWS (EC2, CloudFront)",
      "CI/CD",
      "Jest & Vitest",
      "Cypress",
      "JUnit & go-testing",
    ],
  },
]

const VALUES = [
  {
    title: "Own delivery end to end",
    detail:
      "I take features from requirements and database schema design all the way to deployment and production monitoring.",
  },
  {
    title: "Verify before shipping",
    detail:
      "Automated test suites, strict runtime validation, and careful code review keep fast releases from breaking production.",
  },
  {
    title: "Measure real bottlenecks",
    detail:
      "Whether it’s a 60% slower PostgreSQL query or a multi-agency transit search, I profile first and fix what the numbers show.",
  },
  {
    title: "Communicate plainly",
    detail:
      "Clear written updates, honest trade-offs, and direct collaboration across time zones.",
  },
]

interface ExperienceClientProps {
  experiences: Experience[]
}

export default function ExperienceClient({
  experiences,
}: ExperienceClientProps) {
  return (
    <>
      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="hero-grid">
            <div>
              <h1 className="about-h1">
                Hi, I’m Nelson. I build <span className="hl-word">dependable</span>{" "}
                software for teams and real users.
              </h1>
              <p className="hero-intro">
                I’m a full-stack and backend engineer in Dar es Salaam with over
                seven years of experience shipping distributed banking services,
                transit platforms, and modern web applications.
              </p>
              <div className="cta-row">
                <a className="btn p" href="/cv.pdf">
                  Download CV
                </a>
                <a className="btn s" href="#contact">
                  Get in touch
                </a>
              </div>
            </div>

            <div className="arched-photo">
              <div className="arched-photo-inner">
                <Image
                  src="/about-me.png"
                  alt="Portrait of Nelson Frank"
                  width={480}
                  height={600}
                  priority
                  sizes="(max-width: 820px) 224px, 380px"
                  className="w-full h-full object-cover object-center select-none"
                />
              </div>
            </div>
          </header>

          <section id="story" className="site-section">
            <div className="split-sec">
              <h2>My story</h2>
              <div className="serif-copy">
                <p>
                  I studied Computer Science at the University of Dar es Salaam
                  and started my career building high-usage React and Node.js
                  product surfaces alongside AWS infrastructure at Id8 Space.
                  Seeing real teams rely on the tools I deployed taught me early
                  that software is only done when it runs reliably in
                  production.
                </p>
                <p>
                  Over the last seven years, I’ve worked across full-stack
                  Next.js and NestJS analytics platforms at Kalen Limited, led
                  frontend delivery across five concurrent enterprise client
                  projects at MUST Company in Seoul, and built distributed
                  Spring Boot banking backend services for Mwangahakika Bank and
                  NBC Bank.
                </p>
                <p>
                  Alongside client and banking work, I build open-source systems
                  that solve concrete engineering problems—from{" "}
                  <strong>
                    biometric WebAuthn passkey engines and Go RAPTOR transit
                    routers
                  </strong>{" "}
                  to Babel AST localization pipelines. I write technical deep
                  dives to document how those systems work under the hood.
                </p>
              </div>
            </div>
          </section>

          <section id="values" className="site-section">
            <div className="split-sec">
              <h2>How I work</h2>
              <div className="decisions-grid">
                {VALUES.map((val) => (
                  <div key={val.title} className="surface-card">
                    <h3>{val.title}</h3>
                    <p>{val.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="experience" className="site-section">
            <div className="split-sec">
              <h2>Experience</h2>
              <div>
                {experiences.map((exp) => (
                  <article key={exp.slug} className="job-row">
                    <time>{exp.period}</time>
                    <div>
                      <h3>{exp.title}</h3>
                      <p className="co">
                        {exp.companyUrl && exp.companyUrl !== "#" ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          exp.company
                        )}
                        {exp.location ? `, ${exp.location}` : ""}
                      </p>
                      {exp.bullets.length > 0 ? (
                        <ul>
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx}>{highlightBulletMetrics(bullet)}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ marginBottom: "0.8rem" }}>
                          {exp.description}
                        </p>
                      )}
                      <div>
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="skills" className="site-section">
            <div className="split-sec">
              <h2>Skills</h2>
              <div className="decisions-grid">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.title} className="surface-card">
                    <h3 style={{ marginBottom: "0.7rem" }}>{group.title}</h3>
                    <div>
                      {group.skills.map((skill) => (
                        <span key={skill} className="tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="education" className="site-section">
            <div className="split-sec">
              <h2>Education</h2>
              <ul className="edu-list">
                <li>
                  <span>
                    BSc in Computer Science, University of Dar es Salaam
                  </span>
                  <small>2017 to 2020</small>
                </li>
              </ul>
            </div>
          </section>

          <section id="outside" className="site-section">
            <div className="split-sec">
              <h2>Outside work</h2>
              <div className="outside-grid">
                <div className="surface-card">
                  <h3>Homelab &amp; self-hosting</h3>
                  <p>
                    Running a self-hosted Kubernetes and Docker media and
                    GitOps cluster at home to test infrastructure patterns.
                  </p>
                </div>
                <div className="surface-card">
                  <h3>Open source &amp; writing</h3>
                  <p>
                    Building developer CLIs, authentication demos, and writing
                    ground-up engineering guides.
                  </p>
                </div>
                <div className="surface-card">
                  <h3>Mentoring &amp; life</h3>
                  <p>
                    Mentoring junior developers in Dar es Salaam{" "}
                    <span>[ADD: favorite offline hobby or sport]</span>.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Contact heading="Let’s work together" />
      </main>

      <Footer />
    </>
  )
}
