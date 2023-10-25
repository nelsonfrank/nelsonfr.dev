import { Close } from "@/components/icons/index";
import Link from "next/link";
import { useRouter } from "next/router";

interface sidebarProps {
	handleToggleSidebar: () => void;
	closeSideBar: () => void;
}
const Sidebar = ({ handleToggleSidebar, closeSideBar }: sidebarProps) => {
	const router = useRouter();
	const handleNavigation = (route: string) => {
		router.push(route);
		setTimeout(() => {
			closeSideBar();
		}, 250);
	};
	return (
		<aside className='h-screen '>
			<header className='flex justify-end my-10 p-4'>
				<button onClick={handleToggleSidebar} name='close-icon'>
					<Close />
				</button>
			</header>
			<ul className='flex flex-col font-medium text-4xl items-center justify-evenly h-1/2 list-none'>
				<li>
					<button
						className='text-xl focus:text-primary'
						onClick={() => handleNavigation("/posts")}
						name='Posts'
					>
						Posts
					</button>
				</li>
				<li>
					<button
						className='text-xl focus:text-primary'
						onClick={() => handleNavigation("/projects")}
						name='Projects'
					>
						Projects
					</button>
				</li>
				<li>
					<button
						className='text-xl focus:text-primary'
						onClick={() => handleNavigation("/uses")}
						name='Uses'
					>
						Uses
					</button>
				</li>
				<li>
					<button
						className='text-xl focus:text-primary'
						onClick={() => handleNavigation("/about")}
						name='About'
					>
						About
					</button>
				</li>
				<li>
					<button
						className='text-secondary text-xl bg-primary py-4 px-10 rounded-xl'
						onClick={() => handleNavigation("/contacts")}
						name='Get in touch'
					>
						Get in touch
					</button>
				</li>
			</ul>
		</aside>
	);
};

export default Sidebar;
