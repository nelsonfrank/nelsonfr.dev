import { Metadata } from "next";

import ProjectsData from "@/content/data/projects.json";
import { ProjectCard } from "@/components/card/project-card";

export const metadata: Metadata = {
	title: "Projects",
};

const Page = () => {
	return (
    <div className="grid grid-cols-auto-fit justify-items-center gap-4 my-4">
      {ProjectsData.map((project, index) => (
        <div
          className="flex w-full"
          key={index + 1}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
};

export default Page;
