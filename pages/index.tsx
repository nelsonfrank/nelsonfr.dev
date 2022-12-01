// dependencies
import type { NextPage } from "next";
import Head from "next/head";
// components
import Hero from "@/ui/hero";
import Introduction from "@/ui/introduction";
import SEO from "@/components/seo";

const Home: NextPage = () => {
  return (
    <section className="nf-px-4 nf-mt-4 nf-mb-8 nf-flex nf-flex-col nf-flex-1">
      <SEO
        title="Nelson Frank - Fullstack Javascript Developer"
        description="I'm Nelson Frank, 25 years old, full-stack web developer with over
              3 years of experience working on developing beautiful modern UI
              and backend services and APIs for businesses and startups."
      />
      <div>
        <Hero />
        <Introduction />
      </div>
    </section>
  );
};

export default Home;
