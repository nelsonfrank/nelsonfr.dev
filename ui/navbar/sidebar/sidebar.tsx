import { Close } from '@/components/icons'
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
    <aside className="nf-h-screen ">
      <header className="nf-flex nf-justify-end nf-my-10 nf-p-4">
        <button onClick={handleToggleSidebar}>
          <Close />
        </button>
      </header>
      <ul className="nf-flex nf-flex-col nf-font-medium nf-text-4xl nf-items-center nf-justify-evenly nf-h-1/2">
        <li>
          <button
            className="nf-text-xl focus:nf-text-primary"
            onClick={() => handleNavigation("/blog")}
          >
            Blog
          </button>
        </li>
        <li>
          <button
            className="nf-text-xl focus:nf-text-primary"
            onClick={() => handleNavigation("/projects")}
          >
            Projects
          </button>
        </li>
        <li>
          <button
            className="nf-text-xl focus:nf-text-primary"
            onClick={() => handleNavigation("/uses")}
          >
            Uses
          </button>
        </li>
        <li>
          <button
            className="nf-text-xl focus:nf-text-primary"
            onClick={() => handleNavigation("/about")}
          >
            About
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar
