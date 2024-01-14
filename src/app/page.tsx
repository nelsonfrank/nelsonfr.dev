// dependencies
import type { NextPage } from "next";
import { Metadata } from "next";

// components
import Hero from "./hero";
import Posts from "./posts";
import { Button } from "@/components/ui/button";
import Projects from "./projects";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Nelson Frank - Fullstack Javascript Develop",
	description: `I am Nelson Frank, 26 years old, full-stack web developer with over
              3 years of experience working on developing beautiful modern UI
              and backend services and APIs for businesses and startups.`,
};

const Home: NextPage = () => {
	return (
		<section className='px-4 mt-4 mb-8 flex flex-col flex-1'>
			<div className="mb-4" >
				<Hero />
			</div>
			<div className="mt-8">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-3xl font-bold">Recent Posts</h2>
					</div>
					<div>
						<Button variant="link" asChild>
							<Link href="/posts">All Posts</Link>
						</Button>
					</div>
				</div>
				<Posts />
			</div>
			<div className="mt-8">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-3xl font-bold">Recent Projects</h2>
					</div>
					<div>
						<Button variant="link" asChild>
							<Link href="/projects">All Projects</Link>
						</Button>
					</div>
				</div>
				<Projects />
			</div>
		</section>
	);
};

export default Home;
