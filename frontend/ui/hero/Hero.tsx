import Image from 'next/image'

const Hero = () => {
    return (
        <header>
            <section className='nf-flex nf-flex-col md:nf-flex-row'>
            <Image src="/hero_coding_illustration.svg" height={500} width={500} />
                <div className='md:nf-px-8 nf-flex nf-flex-col md:nf-items-center nf-flex-1'>
                    <div className='nf-text-center md:nf-mt-20'>
                        <h1 className='nf-text-2xl nf-font-light nf-my-4'>Hello, I'm <span className='nf-text-primary nf-font-medium'>Nelson</span></h1>
                        <h2 className='nf-font-semibold nf-text-3xl lg:nf-text-5xl'>A Fullstack Web Developer</h2>

                        <div className='nf-flex nf-justify-center nf-my-10'>
                            <button className='nf-text-white nf-bg-primary nf-py-4 nf-px-6 nf-rounded-xl'>Get in touch</button>
                        </div>
                    </div>
                </div>
            </section>

        </header>
    )
}

export default Hero