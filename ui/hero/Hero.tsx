"use client";
// dependencies
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
	const router = useRouter();
	return (
		<header>
			<section className='flex flex-col-reverse md:flex-row'>
				<Image
					src='/hero_coding_illustration.svg'
					height={500}
					width={500}
					alt='hero illustrations'
					priority
				/>
				<div className='md:px-8 flex flex-col md:items-center flex-1'>
					<div className='text-center md:mt-20'>
						<h1 className='text-2xl font-light my-4'>
							Hello👋, I'm{" "}
							<span className='text-primary font-medium'>Nelson</span>
						</h1>
						<h2 className='font-semibold text-3xl lg:text-5xl animate-typing'>
							A Fullstack Web Developer
						</h2>

						<p className='my-4'>
							I love using latest technology to solve this era challenges.
						</p>
						<div className='flex justify-center my-6'>
							<button
								className='text-white bg-primary py-3 px-6 rounded-xl'
								onClick={() => router.push("/contacts")}
							>
								Get in touch
							</button>
						</div>
					</div>
				</div>
			</section>
		</header>
	);
};

export default Hero;
