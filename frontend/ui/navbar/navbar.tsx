import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.webp";
import { Humberger, Close } from "@/components/icons";
import Sidebar from "./sidebar";

const Navbar = () => {
    const [showSidebar, setShowSidebar] = useState(false);


    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }
    return (
        <header>
            <section className={`${showSidebar && 'nf-hidden'} nf-max-w-7xl nf-mx-auto nf-my-8 nf-p-4`}>
                <div className="nf-flex nf-justify-between nf-items-center">
                    <div>
                        <Link href="/">
                            <Image src={Logo} alt="Logo svg" width="60" height="60" />
                        </Link>
                    </div>
                    <div className="nf-hidden md:nf-inline-block md:nf-w-3/5 lg:nf-w-2/5">
                        <ul className="nf-flex nf-items-center nf-justify-evenly">
                            <li>
                                <button className="nf-text-xl focus:nf-text-primary">Blog</button>
                            </li>
                            <li>
                                <button className="nf-text-xl focus:nf-text-primary">
                                    Projects
                                </button>
                            </li>
                            <li>
                                <button className="nf-text-xl focus:nf-text-primary">Uses</button>
                            </li>
                            <li>
                                <button className="nf-text-xl focus:nf-text-primary">
                                    About
                                </button>
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
