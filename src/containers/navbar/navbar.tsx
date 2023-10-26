"use client";
// dependencies
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// components
import { Humberger } from "@/components/icons/index";
import Sidebar from "./sidebar";

// Images
// import Logo from "../../../public/logo.webp";

const Navbar = () => {
	const [showSidebar, setShowSidebar] = useState(false);

	const router = useRouter();

	const handleToggleSidebar = () => {
		setShowSidebar(!showSidebar);
	};
	return (
		<header>
			<section
				className={`${
					showSidebar && "hidden"
				} max-w-7xl mx-auto my-4 md:my-8 p-4`}
			>
				<div className='flex justify-between items-center'>
					<div>
						<Link href='/'>
							<Image
								src='/logo.webp'
								alt='Logo svg'
								width='60'
								height='60'
								priority
							/>
						</Link>
					</div>
					<div className='hidden md:inline-block'>
						<ul className='flex items-center justify-end list-none'>
							<li className='mx-4'>
								<Link href='/posts'>
									<button className='text-xl focus:text-primary'>Posts</button>
								</Link>
							</li>
							<li className='mx-4'>
								<Link href='/projects'>
									<button className='text-xl focus:text-primary'>
										Projects
									</button>
								</Link>
							</li>
							<li className='mx-4'>
								<Link href='/uses'>
									<button className='text-xl focus:text-primary'>Uses</button>
								</Link>
							</li>
							<li className='mx-4'>
								<Link href='/about'>
									<button className='text-xl focus:text-primary'>About</button>
								</Link>
							</li>
							<li className='mx-4'>
								<button
									className='text-secondary bg-primary py-2 px-4 rounded-xl'
									onClick={() => router.push("/contacts")}
									name='get in touch'
								>
									Get in touch
								</button>
							</li>
						</ul>
					</div>
					<div className='block md:hidden'>
						<button
							onClick={handleToggleSidebar}
							id='hamberger-menu-icon'
							aria-label='hamberger-menu-icon'
						>
							<Humberger />
						</button>
					</div>
				</div>
			</section>
			{showSidebar && (
				<Sidebar
					handleToggleSidebar={handleToggleSidebar}
					closeSideBar={() => setShowSidebar(!showSidebar)}
				/>
			)}
		</header>
	);
};

export default Navbar;
