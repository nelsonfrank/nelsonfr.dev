// components
import Card from "@/components/card";
import SEO from "@/components/seo";

import ProjectsData from "@/data/projects.json";

const Projects = () => {
  return (
    <div className="nf-grid nf-grid-cols-card-lists nf-gap-2 nf-justify-items-center">
      <SEO title="Projects" />
      {ProjectsData.map((project) => (
        <Card
          key={project.name}
          title={project.name}
          description={project.description}
          img={project.img}
          fallbackImg={project.fallbackImg}
        />
      ))}
    </div>
  );
};

export default Projects;
