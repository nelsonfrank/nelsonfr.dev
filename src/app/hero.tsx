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
        <div className="flex flex-1 flex-col md:items-center md:px-8">
          <div className="text-center md:mt-20 md:text-left">
            <h1 className="my-4 text-2xl font-light">
              Hello👋, I'm{" "}
              <span className="font-medium text-primary">Nelson Frank</span>
            </h1>
            <h2 className="animate-typing text-3xl font-semibold md:text-4xl lg:text-5xl">
              A Fullstack Web Developer
            </h2>

            <p className="my-4">
              Delivering Seamless User Experiences Across Platforms.
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
        <div className="hidden flex-1  md:flex md:justify-center">
          <Image
            src="/hero_coding_illustration.svg"
            height={200}
            width={400}
            alt="hero illustrations"
            priority
            className="rounded-full"
          />
        </div>
      </section>
    </header>
  );
};

export default Hero;
