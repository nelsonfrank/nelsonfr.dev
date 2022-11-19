import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.webp";
import { Humberger } from "@/components/icons";
import Sidebar from "./sidebar";

const Navbar = () => {
    const [showSidebar, setShowSidebar] = useState(false);


    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }
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
                <Image src={Logo} alt="Logo svg" width="60" height="60" />
              </Link>
            </div>
            <div className="nf-hidden md:nf-inline-block md:nf-w-3/5 lg:nf-w-2/5">
              <ul className="nf-flex nf-items-center nf-justify-end">
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
              </ul>
            </div>
            <div className="nf-block md:nf-hidden">
              <button onClick={handleToggleSidebar}>
                <Humberger />
              </button>
            </div>
          </div>
        </section>
        {showSidebar && <Sidebar handleToggleSidebar={handleToggleSidebar} />}
      </header>
    );
};

export default Navbar;
