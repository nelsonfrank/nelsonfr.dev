import { ProjectCard } from "@/components/card/project-card";

import projects from "@/content/data/projects.json";





const Page = () => {
  return (
    <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2">
      {projects.slice(0,3).map((project, index) => (
        <div className="col-span-1" key={index+1}>
          <ProjectCard project={project} />
        </div>
      ))}
    </section>
  );
};

export default Page;
