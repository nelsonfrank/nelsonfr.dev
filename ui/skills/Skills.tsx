// components
import {
  Css,
  Expressjs,
  Html,
  Typescript,
  Javascript,
  Nodejs,
  Reactjs,
  Tailwindcss,
  MongoDB,
  Sass,
  Graphql,
  tRPC as TRPC,
} from "@/components/icons";

const Skills = () => {
  return (
    <div className="nf-mt-12">
      <h1 className="nf-text-3xl nf-font-semibold nf-text-primary">
        Tech skills
      </h1>

      <div className="nf-flex nf-justify-evenly nf-items-center nf-flex-wrap nf-gap-4 nf-mt-8 md:nf-w-4/5 md:nf-mx-auto">
        <Typescript />
        <Reactjs />
        <MongoDB />
        <Html />
        <Graphql />
        <Css />
        <Tailwindcss />
        <Sass />
        <Expressjs />
        <Javascript />
        <Nodejs />
        <TRPC />
      </div>
    </div>
  );
};

export default Skills;
