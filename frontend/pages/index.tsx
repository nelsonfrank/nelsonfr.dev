import type { NextPage } from 'next'
import Hero from '@/ui/hero'
import Introduction from '@/ui/introduction'

const Home: NextPage = () => {
  return (
    <section>
      <Hero />
      <Introduction />
    </section>
  )
}

export default Home
