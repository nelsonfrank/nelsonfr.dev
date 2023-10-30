"use client";
import { Button } from "@/components/ui/button";
// dependencies
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
	const router = useRouter();
	return (
		<header>
			<section className='flex flex-col-reverse md:flex-row'>
				<div className='md:px-8 flex flex-col md:items-center flex-1'>
					<div className='text-center md:text-left md:mt-20'>
						<h1 className='text-2xl font-light my-4'>
							Hello👋, I'm{" "}
							<span className='text-primary font-medium'>Nelson Frank</span>
						</h1>
						<h2 className='font-semibold text-3xl md:text-4xl lg:text-5xl animate-typing'>
							A Fullstack Web Developer
						</h2>

						<p className='my-4'>
							I love using latest technology to solve this era challenges.
						</p>
						<div className='flex my-8 justify-center md:justify-start'>
							<Button
								variant='default'
								className='py-6 rounded-xl'
								onClick={() => router.push("/contacts")}
							>
								Contact Me
							</Button>
						</div>
					</div>
				</div>
				<div className='hidden md:flex  md:justify-center flex-1'>
					<Image
						src='/hero_coding_illustration.svg'
						height={400}
						width={400}
						alt='hero illustrations'
						priority
						className='rounded-full'
					/>
				</div>
			</section>
		</header>
	);
};

export default Hero;
