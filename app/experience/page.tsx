import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getAllExperiences, type Experience } from "@/lib/experience"
import { projects, type Project } from "@/lib/projects"
import { getAllPosts, type PostMeta } from "@/lib/posts"
import { Header } from "@/components/header"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import {
  ExperienceToc,
  ExperienceRolesAccordion,
  type RoleAccordionEntry,
} from "@/components/experience-islands"

export const metadata: Metadata = {
  title: {
    absolute: "Profile and CV · Nelson Frank",
  },
  description:
    "Full experience, skills with evidence, education, open-source work, and downloadable CV of Nelson Frank, full-stack and backend engineer in Dar es Salaam.",
  alternates: {
    canonical: "/experience",
  },
  openGraph: {
    title: "Profile and CV · Nelson Frank",
    description:
      "Full experience, skills with evidence, education, open-source work, and downloadable CV of Nelson Frank, full-stack and backend engineer in Dar es Salaam.",
    url: "https://nelsonfrank.dev/experience",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile and CV · Nelson Frank",
    description:
      "Full experience, skills with evidence, education, open-source work, and downloadable CV of Nelson Frank, full-stack and backend engineer in Dar es Salaam.",
  },
}

interface CvFileMeta {
  url: string
  downloadName: string
  fileType: string
  pages: number
  sizeKb: string
  updated: string
  hasPreviewImage: boolean
}

function getCvFileMeta(): CvFileMeta {
  const cvPath = path.join(process.cwd(), "public/cv.pdf")
  const previewPath = path.join(process.cwd(), "public/cv-preview.webp")
  const hasPreviewImage = fs.existsSync(previewPath)

  try {
    const stat = fs.statSync(cvPath)
    const rawBuffer = fs.readFileSync(cvPath)
    const rawStr = rawBuffer.toString("latin1")
    const pageMatches = rawStr.match(/\/Type\s*\/Page\b/g)
    const pages = pageMatches && pageMatches.length > 0 ? pageMatches.length : 2
    const sizeKb = Math.max(1, Math.round(stat.size / 1024))
    const updatedMonthYear = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(stat.mtime)

    return {
      url: "/cv.pdf",
      downloadName: "Nelson-Frank-CV.pdf",
      fileType: "PDF",
      pages,
      sizeKb: `${sizeKb} KB`,
      updated: `Updated ${updatedMonthYear}`,
      hasPreviewImage,
    }
  } catch {
    return {
      url: "/cv.pdf",
      downloadName: "Nelson-Frank-CV.pdf",
      fileType: "PDF",
      pages: 2,
      sizeKb: "64 KB",
      updated: "Updated November 2026",
      hasPreviewImage,
    }
  }
}

const ROLE_TEAM_SIZE: Record<string, string> = {
  "nbc-bank": "Cross-functional banking team of 5–10 engineers",
  "mwangahakika-bank":
    "Cross-functional banking team of 5–10 engineers (independent freelance delivery)",
  "must-company":
    "Cross-functional product team of 5–10 engineers across 5 concurrent client projects",
  "kalen-limited":
    "Cross-functional product & data engineering team of 5–10 engineers",
  "id8-space":
    "Cross-functional engineering team of 5–10 engineers, mentored 3 junior developers",
}

interface SkillRow {
  name: string
  level: 1 | 2 | 3 | 4 | 5
  years: string
  usedInLabel: string
  usedInHref?: string
}

interface SkillGroup {
  group: string
  items: SkillRow[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    group: "Core & Backend",
    items: [
      {
        name: "TypeScript",
        level: 5,
        years: "6 yrs",
        usedInLabel: "Passkey Authentication Engine",
        usedInHref: "/projects/passkey-auth",
      },
      {
        name: "Go (Golang)",
        level: 4,
        years: "2 yrs",
        usedInLabel: "City Connector RAPTOR engine",
        usedInHref: "/projects/city-connector-backend",
      },
      {
        name: "Java & Spring Boot",
        level: 4,
        years: "1 yr",
        usedInLabel: "NBC Bank & Mwangahakika Bank",
        usedInHref: "#experience",
      },
      {
        name: "NestJS & Node.js",
        level: 5,
        years: "6 yrs",
        usedInLabel: "TOTP Authentication deep dive",
        usedInHref: "/writing/TOTP-authentication",
      },
      {
        name: "Python",
        level: 4,
        years: "3 yrs",
        usedInLabel: "NECTA Explorer async crawler",
        usedInHref: "/projects/necta-explorer",
      },
    ],
  },
  {
    group: "Frontend & Mobile",
    items: [
      {
        name: "React & Next.js",
        level: 5,
        years: "6 yrs",
        usedInLabel: "NECTA Explorer dashboard",
        usedInHref: "/projects/necta-explorer",
      },
      {
        name: "React Native (Expo)",
        level: 4,
        years: "2 yrs",
        usedInLabel: "City Connector mobile app",
        usedInHref: "/projects/city-connector-backend",
      },
      {
        name: "Tailwind CSS",
        level: 5,
        years: "5 yrs",
        usedInLabel: "Kalen Limited & NECTA Explorer",
        usedInHref: "/projects/necta-explorer",
      },
      {
        name: "Zustand & React Query",
        level: 4,
        years: "3 yrs",
        usedInLabel: "MUST Company & City Connector",
        usedInHref: "/projects/city-connector-backend",
      },
    ],
  },
  {
    group: "Data, Cloud & Testing",
    items: [
      {
        name: "PostgreSQL & PostGIS",
        level: 4,
        years: "4 yrs",
        usedInLabel: "Passkey Auth & City Connector",
        usedInHref: "/projects/passkey-auth",
      },
      {
        name: "Redis & Elasticsearch",
        level: 4,
        years: "2 yrs",
        usedInLabel: "City Connector GTFS-RT telemetry",
        usedInHref: "/projects/city-connector-backend",
      },
      {
        name: "Kubernetes & Docker",
        level: 4,
        years: "3 yrs",
        usedInLabel: "Homelab & Kubernetes Architecture",
        usedInHref: "/projects/homelab",
      },
      {
        name: "AWS (EC2, CloudFront)",
        level: 4,
        years: "3 yrs",
        usedInLabel: "Id8 Space production infra",
        usedInHref: "#experience",
      },
      {
        name: "Jest, Vitest & Cypress",
        level: 4,
        years: "4 yrs",
        usedInLabel: "i18n Automation CLI (218 tests)",
        usedInHref: "/projects/i8n-automation-cli",
      },
    ],
  },
]

const MENU_ITEMS = [
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "more", label: "Talks and open source" },
  { id: "about", label: "About me" },
] as const

function LevelBar({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className="lv" role="img" aria-label={`${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? "on" : undefined} />
      ))}
    </span>
  )
}

function getRelatedLinksForRole(
  exp: Experience,
  allProjects: Project[],
  allPosts: PostMeta[]
): { label: string; href: string }[] {
  const techSet = new Set(exp.technologies.map((t) => t.toLowerCase()))
  const links: { label: string; href: string }[] = []

  for (const project of allProjects) {
    const overlap = project.technologies.some((t) =>
      techSet.has(t.toLowerCase())
    )
    if (overlap) {
      links.push({
        label: `${project.title} case study`,
        href: `/projects/${project.slug}`,
      })
    }
    if (links.length >= 2) break
  }

  for (const post of allPosts) {
    const overlap = post.tags.some((t) => techSet.has(t.toLowerCase()))
    if (overlap) {
      links.push({
        label: post.title,
        href: `/writing/${post.slug}`,
      })
    }
    if (links.length >= 3) break
  }

  return links
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nelson Frank",
  url: "https://nelsonfrank.dev/experience",
  image: "https://nelsonfrank.dev/profile.png",
  jobTitle: "Full-stack & Backend Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "NBC Bank",
    url: "https://nbc.co.tz/",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dar es Salaam",
    addressCountry: "TZ",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Dar es Salaam",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "Bachelor of Science in Computer Science",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: "University of Dar es Salaam",
      },
    },
  ],
  description:
    "Full-stack and backend engineer in Dar es Salaam with 7+ years shipping distributed banking services, transit platforms, and modern web applications.",
  sameAs: [
    "https://github.com/nelsonfrank",
    "https://www.linkedin.com/in/nelson-frank-munissy/",
    "https://x.com/nelsonfr_",
  ],
}

export default function ExperiencePage() {
  const experiences = getAllExperiences()
  const posts = getAllPosts()
  const cvMeta = getCvFileMeta()

  const roleEntries: RoleAccordionEntry[] = experiences.map((exp) => ({
    experience: exp,
    teamText:
      ROLE_TEAM_SIZE[exp.slug] ??
      "Cross-functional engineering team of 5–10 engineers",
    related: getRelatedLinksForRole(exp, projects, posts),
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <Header />

      <div className="wrap">
        <header className="cv-head">
          <h1>
            Nelson Frank, <span className="hl-word">full-stack</span> engineer
          </h1>
          <p className="role-lead">
            Backend Developer at NBC Bank, Dar es Salaam. Seven-plus years
            building distributed banking services, transit platforms, and web
            applications.
          </p>

          <div className="cv-panel">
            {cvMeta.hasPreviewImage ? (
              <div className="cv-doc-thumb">
                <Image
                  src="/cv-preview.webp"
                  alt="First page of my CV"
                  width={340}
                  height={480}
                  priority
                  sizes="(max-width: 520px) 80px, 120px"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="cv-doc-thumb is-mock" aria-hidden="true">
                <i className="h" />
                <i className="m" />
                <i className="w" />
                <i />
                <i className="w" />
                <i />
                <i className="w" />
                <i />
              </div>
            )}

            <div>
              <h2>My CV</h2>
              <p className="cv-meta">
                {cvMeta.fileType} · {cvMeta.pages}{" "}
                {cvMeta.pages === 1 ? "page" : "pages"} · {cvMeta.sizeKb} ·{" "}
                {cvMeta.updated}
              </p>
              <div className="cv-acts">
                <a
                  className="btn p"
                  href={cvMeta.url}
                  download={cvMeta.downloadName}
                >
                  Download CV (PDF)
                </a>
                <a
                  className="btn s"
                  href={cvMeta.url}
                  target="_blank"
                  rel="noopener"
                >
                  Open in a new tab
                </a>
              </div>
            </div>
          </div>

          <dl className="cv-facts">
            <div>
              <dt>Experience</dt>
              <dd>7+ years</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Dar es Salaam (UTC+3)</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>English, Swahili</dd>
            </div>
            <div>
              <dt>Work type</dt>
              <dd>Full-time, freelance</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Open to roles</dd>
            </div>
          </dl>
        </header>

        <div className="cv-layout">
          <ExperienceToc items={MENU_ITEMS} />

          <main id="main-content" className="cv-main">
            <ExperienceRolesAccordion entries={roleEntries} />

            <section id="skills">
              <h2 className="sh">Skills</h2>
              <p className="cv-lead">
                Level is my honest self-rating out of 5, with years of use and
                where you can see the work on this site.
              </p>

              {SKILL_GROUPS.map((group, gIdx) => (
                <div key={group.group}>
                  <h3 className="grp">{group.group}</h3>
                  <div className="sk">
                    {gIdx === 0 && (
                      <div className="r h" aria-hidden="true">
                        <span>Skill</span>
                        <span>Level</span>
                        <span>Years</span>
                        <span>Used in</span>
                      </div>
                    )}
                    {group.items.map((sk) => (
                      <div key={sk.name} className="r">
                        <b>{sk.name}</b>
                        <LevelBar level={sk.level} />
                        <span className="u">{sk.years}</span>
                        <span className="w">
                          {sk.usedInHref ? (
                            <Link href={sk.usedInHref}>{sk.usedInLabel}</Link>
                          ) : (
                            sk.usedInLabel
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section id="education">
              <h2 className="sh">Education</h2>
              <ul className="cv-list" style={{ marginTop: "1rem" }}>
                <li>
                  <span>
                    BSc in Computer Science
                    <span>University of Dar es Salaam, Dar es Salaam.</span>
                  </span>
                  <small>Nov 2017 to Oct 2020</small>
                </li>
              </ul>
            </section>

            <section id="more">
              <h2 className="sh">Talks and open source</h2>
              <ul className="cv-list" style={{ marginTop: "1rem" }}>
                {projects.map((project) => (
                  <li key={project.slug}>
                    <span>
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                      <span>
                        {project.role}. {project.outcome ?? project.description}
                        {project.githubUrl && project.githubUrl !== "#" && (
                          <>
                            {" · "}
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              GitHub repository
                            </a>
                          </>
                        )}
                      </span>
                    </span>
                    <small>{project.year}</small>
                  </li>
                ))}
              </ul>
            </section>

            <section id="about">
              <h2 className="sh">About me</h2>
              <div className="cv-sm" style={{ marginTop: "1rem" }}>
                <p>
                  I studied Computer Science at the University of Dar es Salaam
                  and learned early that software only counts when real people
                  can rely on it every day—whether it is an internal banking
                  service, a public examination archive, or a commuter transit
                  app working offline.
                </p>
                <p>
                  Outside client and banking work, I run a self-hosted
                  Kubernetes and Docker homelab, build open-source developer
                  tools, and mentor junior developers in Dar es Salaam.
                </p>
              </div>
            </section>

            <div className="cv-cta">
              <div>
                <h2>Want the full picture?</h2>
                <p>Download my CV, or tell me about your project.</p>
              </div>
              <div className="acts">
                <a
                  className="btn p"
                  href={cvMeta.url}
                  download={cvMeta.downloadName}
                >
                  Download CV (PDF)
                </a>
                <a className="btn s" href="#contact">
                  Get in touch
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Contact heading="Let’s work together" />

      <Footer />
    </>
  )
}
