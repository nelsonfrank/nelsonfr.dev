"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import gsap from "gsap"
import { useMagnetic } from "@/hooks/use-gsap"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#writing", label: "Writing" },
  { href: "#contact", label: "Contact" },
]

function MagneticLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3)
  
  return (
    <Link
      ref={magneticRef}
      href={href}
      onClick={onClick}
      className="relative text-sm text-muted-foreground hover:text-primary transition-colors group"
    >
      <span className="relative z-10">{label}</span>
      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
    </Link>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useMagnetic<HTMLAnchorElement>(0.2)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // Initial animation
    gsap.fromTo(
      header,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 2.8, ease: "power3.out" }
    )

    // Scroll listener for header background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return

    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      )
      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll("a"),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.3, delay: 0.1, ease: "power2.out" }
      )
    }
  }, [isOpen])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link
          ref={logoRef}
          href="/"
          className="text-xl font-semibold text-foreground relative overflow-hidden group"
        >
          <span className="relative z-10">Nelson Frank</span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <MagneticLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground relative z-50 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <span
              className={`absolute h-0.5 w-full bg-foreground transition-all duration-300 ${
                isOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-0.5 w-full bg-foreground transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-0.5 w-full bg-foreground transition-all duration-300 ${
                isOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-background/95 backdrop-blur-md border-b border-border overflow-hidden"
        >
          <div className="flex flex-col px-6 py-6 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
