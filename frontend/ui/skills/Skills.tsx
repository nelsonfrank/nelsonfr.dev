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
    Graphql
} from "@/components/icons";

const Skills = () => {
    return (
        <div className="nf-mt-12">
            <h1 className="nf-text-3xl nf-font-semibold nf-text-primary">
                Tech skills
            </h1>

            <div className="nf-flex nf-justify-evenly nf-items-center nf-flex-wrap nf-gap-4 nf-mt-8">
                <Typescript />
                <Reactjs />
                <Html />
                <Css />
                <Tailwindcss />
                <Sass />
                <Javascript />
                <MongoDB />
                <Expressjs />
                <Nodejs />
                <Graphql />
            </div>
        </div>
    );
};

export default Skills;
