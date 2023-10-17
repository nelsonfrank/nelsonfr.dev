// dependencies
import type { NextPage } from "next";
import Head from "next/head";
// components
import Hero from "@/ui/hero";
import Introduction from "@/ui/introduction";
import SEO from "@/components/seo";

const Home: NextPage = () => {
  return (
		<section className='px-4 mt-4 mb-8 flex flex-col flex-1'>
			<SEO
				title='Nelson Frank - Fullstack Javascript Developer'
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
