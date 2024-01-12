"use client";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { Divider } from "@/components/ui/divider";

export function MainNav() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between py-6 px-4 lg:px-0">
        <div>
          <Link href="/">
            <span className="font-headiing hidden text-2xl md:block">
              Nelson Frank
            </span>
            <span className="font-headiing block text-2xl md:hidden">
              NelsonFr.
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-5">
            <li className="list-none">
              <Link
                href="/posts"
                className="mx-2 my-1 text-base font-medium hover:text-destructive focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4 active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4"
              >
                {" "}
                Posts
              </Link>
            </li>
            <li className="list-none">
              <Link
                href="/projects"
                className="mx-2 my-1 text-base font-medium hover:text-destructive focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4 active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4"
              >
                {" "}
                Projects
              </Link>
            </li>
            <li className="list-none">
              <Link
                href="/uses"
                className="mx-2 my-1 text-base font-medium hover:text-destructive focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4 active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4"
              >
                {" "}
                Uses
              </Link>
            </li>
            <li className="list-none">
              <Link
                href="/about"
                className="mx-2 my-1 text-base font-medium hover:text-destructive focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4 active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4"
              >
                {" "}
                About
              </Link>
            </li>
            <Button variant="ghost" size="icon">
              <Link href="/search" className="">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Link>
            </Button>

            <ThemeToggle />
          </ul>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsNavOpen((isNavOpen) => !isNavOpen)}
        >
          {isNavOpen ? <Icons.close /> : <Icons.menu />}
        </Button>
      </div>
      <Divider />
    </>
  );
}
