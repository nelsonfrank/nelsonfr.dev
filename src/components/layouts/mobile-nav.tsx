import { motion } from "framer-motion";
import { links, footerLinks } from "./data";
import { perspective, slideIn } from "./nav-anim";

export function MobileNav() {
  return (
    <div className={"flex flex-col justify-between pt-12 py-10 pb-12 h-full box-border"}>
      <div className={"flex gap-3 flex-col"}>
        {links.map((link, i) => {
          const { title, href } = link;
          return (
            <div
              key={`b_${i}`}
              className={"perspective-1 perspective-origin-bottom"}
            >
              <motion.div
                custom={i}
                variants={perspective}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <a href={href} className="text-3xl no-underline">
                  {title}
                </a>
              </motion.div>
            </div>
          );
        })}
      </div>
      <motion.div className={"flex flex-wrap"}>
        {footerLinks.map((link, i) => {
          const { title, href } = link;
          return (
              <motion.a
                href={href}
                target="_blank"
                variants={slideIn}
                custom={i}
                initial="initial"
                animate="enter"
                exit="exit"
                key={`f_${i}`}
                className="w-1/2 mt-1"
            >
              {title}
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
}
