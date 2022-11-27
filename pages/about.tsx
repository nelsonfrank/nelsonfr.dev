// dependencies
import Image from "next/image";

// components
import { Satelite } from "@/components/icons";
import Divider from "@/components/divider";

// UI
import Experience from "@/ui/experience";
import Skills from "@/ui/skills";
import Education from "@/ui/education";

const About = () => {
  return (
    <section className="nf-max-w-screen-lg nf-mx-auto nf-px-4 nf-mt-4 nf-mb-8 nf-flex nf-flex-col nf-flex-1">
      <div className="nf-mx-1 md:nf-mx-8">
        <div className="nf-flex nf-flex-col md:nf-flex-row md:nf-justify-between md:nf-items-center">
          <div className="nf-flex nf-justify-center nf-mb-8 md:nf-mb-0 md:nf-mr-8">
            <Image
              src="/profile.png"
              width={150}
              height={150}
              layout="fixed"
              className="nf-rounded-full"
            />
          </div>
          <div>
            <div>
              <div className="nf-flex">
                <h1 className="nf-text-3xl nf-font-semibold nf-my-2 nf-mr-4">
                  Hello
                </h1>
                <Satelite className="nf-animate-bounce" />
              </div>
            </div>
            <p>
              I'm Nelson Frank, 25 years old, full-stack web developer with over
              3 years of experience working on developing beautiful modern UI
              and backend services and APIs for businesses and startups. I'm a
              good team player and able to work solo.
            </p>
          </div>
        </div>
        <Divider />
        <div className="nf-mt-12">
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
