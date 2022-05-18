import Image from "next/image";
import { Satelite } from '@/components/icons';
import Experience from '@/ui/experience'
const About = () => {
    return (
        <div className="nf-mx-8">
            <div className="nf-flex nf-justify-between nf-items-center">
                <div className="nf-mr-8">
                    <Image
                        src="/me.jpg"
                        width={150}
                        height={150}
                        layout="fixed"
                        className="nf-rounded-full"
                    />
                </div>
                <div>
                    <div>
                        <div className="nf-flex">
                            <h1 className="nf-text-3xl nf-font-semibold nf-my-2 nf-mr-4">
                                Hello
                            </h1>
                            <Satelite className="nf-animate-bounce" />
                        </div>
                    </div>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo eos
                        perspiciatis repellat doloremque autem reiciendis tempora cumque non
                        libero aut est quae adipisci, natus laudantium exercitationem fuga,
                        obcaecati animi saepe consequatur eaque illum! Amet at laudantium
                        voluptates nostrum deserunt ea in temporibus molestias recusandae
                        neque? Quasi maxime eum a illo.</p>
                </div>
            </div>
            <div className="nf-mt-12">
                <h1 className="nf-text-3xl nf-font-semibold nf-text-primary">Work experince</h1>
                <div>
                    <Experience />
                    <Experience />
                    <Experience />
                </div>
            </div>
        </div>
    );
};

export default About;
