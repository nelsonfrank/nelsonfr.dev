import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-5 py-20 text-center">
        <div className="max-w-md space-y-4">
          <p className="text-xs font-mono uppercase tracking-[0.05em] text-primary">
            404 — Page not found
          </p>
          <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground">
            Nothing at this route.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            The page you requested does not exist or may have moved.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200"
            >
              <ArrowLeft className="size-4" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
