// dependencies
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

// components
import { Humberger } from "@/components/icons";
import Sidebar from "./sidebar";

// Images
import Logo from "@/public/logo.webp";

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
          showSidebar && "nf-hidden"
        } nf-max-w-7xl nf-mx-auto nf-my-4 md:nf-my-8 nf-p-4`}
      >
        <div className="nf-flex nf-justify-between nf-items-center">
          <div>
            <Link href="/">
              <a>
                <Image
                  src={Logo}
                  alt="Logo svg"
                  width="60"
                  height="60"
                  priority
                />
              </a>
            </Link>
          </div>
          <div className="nf-hidden md:nf-inline-block">
            <ul className="nf-flex nf-items-center nf-justify-end nf-list-none">
              <li className="nf-mx-4">
                <Link href="/blog">
                  <button className="nf-text-xl focus:nf-text-primary">
                    Blog
                  </button>
                </Link>
              </li>
              <li className="nf-mx-4">
                <Link href="/projects">
                  <button className="nf-text-xl focus:nf-text-primary">
                    Projects
                  </button>
                </Link>
              </li>
              <li className="nf-mx-4">
                <Link href="/uses">
                  <button className="nf-text-xl focus:nf-text-primary">
                    Uses
                  </button>
                </Link>
              </li>
              <li className="nf-mx-4">
                <Link href="/about">
                  <button className="nf-text-xl focus:nf-text-primary">
                    About
                  </button>
                </Link>
              </li>
              <li className="nf-mx-4">
                <button
                  className="nf-text-white nf-bg-primary nf-py-2 nf-px-4 nf-rounded-xl"
                  onClick={() => router.push("/contacts")}
                  name="get in touch"
                >
                  Get in touch
                </button>
              </li>
            </ul>
          </div>
          <div className="nf-block md:nf-hidden">
            <button
              onClick={handleToggleSidebar}
              id="hamberger-menu-icon"
              aria-label="hamberger-menu-icon"
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
