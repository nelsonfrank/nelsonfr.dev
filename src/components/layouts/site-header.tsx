"use client";
import { MainNav } from "./main-nav";
import { AnimatePresence, motion } from "framer-motion";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/libs/utils";
import { useState } from "react";

const SiteHeader = () => {
	const [isActive, setIsActive] = useState(false);

  const menu = {
    open: {
      width: "480px",
      height: "570px",
      top: "-25px",
      right: "-25px",
      transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
      width: "100px",
      height: "40px",
      top: "0px",
      right: "0px",
      transition: {
        duration: 0.75,
        delay: 0.35,
        type: "tween",
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };
	return (
		<header>
			<MainNav isActive={isActive} toggleMenu={()=>setIsActive(!isActive)} />
      {isActive &&
      <motion.div
        className={cn(isActive ? "block px-4" : "hidden")}
        variants={menu}
        animate={isActive ? "open" : "closed"}
        initial="closed"
      >
		<AnimatePresence>
			<MobileNav />
		</AnimatePresence>
				</motion.div>
			}
    </header>
  );
};

export default SiteHeader;
