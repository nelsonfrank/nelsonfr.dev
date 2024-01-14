"use client";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { Divider } from "@/components/ui/divider";
import { navLinks } from "@/configs";

export interface MainNavProps {
  isActive: boolean,
  toggleMenu: () => void
}

export function MainNav({isActive, toggleMenu}: MainNavProps) {

  return (
    <>
      <div className="flex items-center justify-between px-4 py-6 lg:px-0">
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
            {navLinks.filter(link => link.title !== 'Home').map(({title, href}, i) => (
              <li className="list-none" key={i+1}>
                <Link
                  href={href}
                  className="mx-2 my-1 text-base font-medium hover:text-destructive focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4 active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4"
                >
                  {" "}
                 {title}
                </Link>
              </li>
            ))}
            {/* TODO: Enable this after implement search functionality */}
            {/* <Button variant="ghost" size="icon">
              <Link href="/search" className="">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Link>
            </Button> */}

            <ThemeToggle />
          </ul>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isActive ? <Icons.close /> : <Icons.menu />}
        </Button>
      </div>
      <Divider />
    </>
  );
}
