"use client";
import { Button } from "@/components/ui/button";
// dependencies
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
	const router = useRouter();
	return (
    <header>
      <section className="flex flex-col-reverse md:flex-row">
        <div className="flex flex-1 flex-col md:items-center">
          <div className="text-center md:mt-20 md:text-left">
            <h1 className="my-4 text-2xl font-light">
              Hello👋, I'm{" "}
              <span className="font-medium text-primary">Nelson Frank</span>
            </h1>
            <h2 className="animate-typing text-3xl font-semibold md:text-4xl">
              A Fullstack Software Developer
            </h2>

            <p className="my-4">
             I'm interested in tech and building a robust software using latest technology.
            </p>
            <div className="my-8 flex justify-center md:justify-start">
              <Button
                variant="default"
                className="rounded-xl py-6"
                onClick={() => router.push("/contacts")}
              >
                Contact Me
              </Button>
            </div>
          </div>
        </div>
        <div className=" flex justify-center md:flex-1">
          <Image
            src="/landing-page.png"
            height={200}
            width={400}
            alt="hero illustrations"
            priority
            className="rounded-2xl"
          />
        </div>
      </section>
    </header>
  );
};

export default Hero;
