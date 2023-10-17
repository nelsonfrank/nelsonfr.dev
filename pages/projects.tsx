// components
import Card from "@/components/card";
import SEO from "@/components/seo";

import ProjectsData from "@/data/projects.json";

const Projects = () => {
  return (
		<div className='grid grid-cols-card-lists gap-2 justify-items-center'>
			<SEO title='Projects' />
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
