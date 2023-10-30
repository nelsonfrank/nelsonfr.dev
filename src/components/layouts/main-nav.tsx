"use client";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";

export function MainNav() {
	const [isNavOpen, setIsNavOpen] = useState(false);

	return (
		<>
			<div className='flex justify-between items-center py-8 px-4'>
				<div>
					<Link href='/'>
						<span className='hidden md:block font-headiing text-xl'>
							Nelson Frank
						</span>
						<span className='block md:hidden font-headiing text-xl'>
							NelsonFr.
						</span>
					</Link>
				</div>
				<nav className='hidden md:flex'>
					<ul className='flex items-center gap-5'>
						<li>
							<Link
								href='/posts'
								className='mx-2 my-1 text-base active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4 focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4'
							>
								{" "}
								Posts
							</Link>
						</li>
						<li>
							<Link
								href='/projects'
								className='mx-2 my-1 text-base active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4 focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4'
							>
								{" "}
								Projects
							</Link>
						</li>
						<li>
							<Link
								href='/uses'
								className='mx-2 my-1 text-base active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4 focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4'
							>
								{" "}
								Uses
							</Link>
						</li>
						<li>
							<Link
								href='/about'
								className='mx-2 my-1 text-base active:underline active:decoration-wavy active:decoration-2 active:underline-offset-4 focus:underline focus:decoration-wavy focus:decoration-2 focus:underline-offset-4'
							>
								{" "}
								About
							</Link>
						</li>
						<Button variant='ghost' size='icon'>
							<Link href='/search' className=''>
								<MagnifyingGlassIcon className='h-5 w-5' />
							</Link>
						</Button>

						<ThemeToggle />
					</ul>
				</nav>
				<Button
					variant='ghost'
					size='icon'
					className='md:hidden'
					onClick={() => setIsNavOpen((isNavOpen) => !isNavOpen)}
				>
					{isNavOpen ? <Icons.close /> : <Icons.menu />}
				</Button>
			</div>
			<div className='w-full px-4'>
				<hr aria-hidden='true' className='border-destructive border' />
			</div>
		</>
	);
}
