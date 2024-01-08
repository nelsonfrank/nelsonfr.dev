// dependencies
import Image from "next/image";
import { Metadata } from "next";

// components
import { Satelite } from "@/components/icons/index";
import Divider from "@/components/divider";

// Containers
import Experience from "@/containers/experience";
import Skills from "@/containers/skills";
import Education from "@/containers/education";

export const metadata: Metadata = {
  title: "About",
  description: "I'm fullstack Typescript/Javascript Developer",
};

const About = () => {
  return (
    <section className="mx-auto mb-8 mt-4 flex max-w-screen-lg flex-1 flex-col px-4">
      <div className="mx-1 md:mx-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 flex justify-center md:mb-0 md:mr-8">
            <div className="flex md:hidden">
              <Image
                src="/about-me.png"
                width={150}
                height={150}
                layout="fixed"
                className="rounded-full"
                alt="profile image"
              />
            </div>
            <div className="hidden md:flex">
              <Image
                src="/about-me.png"
                width={550}
                height={250}
                layout="fixed"
                className="rounded-full"
                alt="profile image"
              />
            </div>
          </div>
          <div>
            <div>
              <div className="flex">
                <h1 className="my-2 mr-4 text-3xl font-semibold">Hello</h1>
                <Satelite className="animate-bounce" />
              </div>
            </div>
            <p>
              Hi, my name is Nelson Frank and I am a senior software developer. I have been working as a developer for about
              four years now and have gained a lot of experience in both
              frontend and backend technologies. In my free time, I enjoy
              staying up to date with the latest developments in the world of
              technology and coding. I am always looking for new challenges and
              opportunities to learn and grow as a developer.
            </p>
          </div>
        </div>
        <Divider />
        <div className="mt-12">
          <div>
            <Experience />
          </div>
          <Divider />
          <div>
            <Skills />
          </div>
          <Divider />
          <div>
            <Education />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
