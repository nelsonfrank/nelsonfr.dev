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
		<div className='mt-12'>
			<h1 className='text-3xl font-semibold text-primary'>Tech skills</h1>

			<div className='flex justify-evenly items-center flex-wrap gap-4 mt-8 md:w-4/5 md:mx-auto'>
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
