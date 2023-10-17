// dependencies
import Image from "next/image";
import { Metadata } from "next";

// components
import { Satelite } from "@/components/icons";
import Divider from "@/components/divider";

// Containers
import Experience from "@/ui/experience";
import Skills from "@/ui/skills";
import Education from "@/ui/education";

export const metadata: Metadata = {
	title: "About",
	description: "I'm fullstack Typescript/Javascript Developer",
};

const About = () => {
	return (
		<section className='max-w-screen-lg mx-auto px-4 mt-4 mb-8 flex flex-col flex-1'>
			<div className='mx-1 md:mx-8'>
				<div className='flex flex-col md:flex-row md:justify-between md:items-center'>
					<div className='flex justify-center mb-8 md:mb-0 md:mr-8'>
						<Image
							src='/profile.png'
							width={150}
							height={150}
							layout='fixed'
							className='rounded-full'
							alt='profile image'
						/>
					</div>
					<div>
						<div>
							<div className='flex'>
								<h1 className='text-3xl font-semibold my-2 mr-4'>Hello</h1>
								<Satelite className='animate-bounce' />
							</div>
						</div>
						<p>
							Hi, my name is Nelson Frank and I am a 25-year-old fullstack
							JavaScript developer. I have been working as a developer for about
							four years now and have gained a lot of experience in both
							frontend and backend technologies. In my free time, I enjoy
							staying up to date with the latest developments in the world of
							technology and coding. I am always looking for new challenges and
							opportunities to learn and grow as a developer.
						</p>
					</div>
				</div>
				<Divider />
				<div className='mt-12'>
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
