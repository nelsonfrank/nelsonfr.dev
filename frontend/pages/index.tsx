import type { NextPage } from 'next'
import Hero from '@/ui/hero'
import Introduction from '@/ui/introduction'

const Home: NextPage = () => {
  return (
    <section className="nf-max-w-screen-lg nf-mx-auto nf-px-4 nf-mt-4 nf-mb-8 nf-flex nf-flex-col nf-flex-1">
      <div>
        <Hero />
        <Introduction />
      </div>
    </section>
  );
}

export default Home
