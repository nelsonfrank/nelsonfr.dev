// dependencies
import type { NextPage } from "next";

// components
import Hero from "@/ui/hero";
import Introduction from "@/ui/introduction";

const Home: NextPage = () => {
  return (
    <section className="nf-px-4 nf-mt-4 nf-mb-8 nf-flex nf-flex-col nf-flex-1">
      <div>
        <Hero />
        <Introduction />
      </div>
    </section>
  );
};

export default Home;
