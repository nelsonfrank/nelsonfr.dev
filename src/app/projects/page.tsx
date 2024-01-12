import { Metadata } from "next";

import ProjectsData from "@/content/data/projects.json";
import { ProjectCard } from "@/components/card/project-card";

export const metadata: Metadata = {
	title: "Projects",
};

const Page = () => {
	return (
    <div className="grid grid-cols-auto-fit justify-items-center gap-2">
      {ProjectsData.map((project, index) => (
        <div
          className="mx-2 my-4 px-4 flex w-full md:px-0"
          key={index + 1}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
};

export default Page;
