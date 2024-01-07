import { ProjectCard } from "@/components/card/project-card";

export interface IProject {
  date: string;
  readTime: string;
  title: string;
  image: string;
}
const projects: IProject[] = [
  {
    date: "12/29/2022",
    readTime: "5 mins",
    title: "INTRODUCING ASTRO: SHIP LESS JAVASCRIPT",
    image:
      "https://images.unsplash.com/photo-1585020430145-2a6b034f7729?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    date: "12/29/2022",
    readTime: "5 mins",
    title: "INTRODUCING ASTRO: SHIP LESS JAVASCRIPT",
    image:
      "https://images.unsplash.com/photo-1585020430145-2a6b034f7729?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    date: "12/29/2022",
    readTime: "5 mins",
    title: "INTRODUCING ASTRO: SHIP LESS JAVASCRIPT",
    image:
      "https://images.unsplash.com/photo-1585020430145-2a6b034f7729?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  }
];


const Projects = () => {
  return (
    <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <div className="col-span-1" key={index+1}>
          <ProjectCard  />
        </div>
      ))}
    </section>
  );
};

export default Projects;
