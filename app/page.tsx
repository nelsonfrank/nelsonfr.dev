// dependencies
import type { NextPage } from "next";
import { Metadata } from "next";

// components
import Hero from "@/ui/hero";
import Introduction from "@/ui/introduction";

export const metadata: Metadata = {
	title: "Nelson Frank - Fullstack Javascript Develop",
	description: `I am Nelson Frank, 26 years old, full-stack web developer with over
              3 years of experience working on developing beautiful modern UI
              and backend services and APIs for businesses and startups.`,
};

const Home: NextPage = () => {
	return (
		<section className='px-4 mt-4 mb-8 flex flex-col flex-1'>
			<div>
				<Hero />
				<Introduction />
			</div>
		</section>
	);
};

export default Home;
