import { Metadata } from "next";
// components
import Card from "@/components/card";

import ProjectsData from "@/content/data/projects.json";

export const metadata: Metadata = {
	title: "Projects",
};

const Projects = () => {
	return (
		<div className='grid grid-cols-auto-fit gap-2 justify-items-center'>
			{ProjectsData.map((project) => (
				<Card
					key={project.name}
					title={project.name}
					description={project.description}
					img={project.img}
					repoUrl={project.repoUrl}
					url={project.url}
				/>
			))}
		</div>
	);
};

export default Projects;
