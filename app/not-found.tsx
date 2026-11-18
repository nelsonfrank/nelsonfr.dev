import Link from "next/link"
import { Header } from "@/components/header"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="wrap">
          <header className="page-head">
            <h1>
              Page <span className="hl-word">not found.</span>
            </h1>
            <p>
              The page you requested does not exist or has moved. Try one of the
              pages below.
            </p>
            <div className="cta-row" style={{ marginTop: "2rem" }}>
              <Link className="btn p" href="/projects">
                View my work
              </Link>
              <Link className="btn s" href="/writing">
                Read my writing
              </Link>
              <Link className="btn s" href="/">
                Back to home
              </Link>
            </div>
          </header>
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  )
}
