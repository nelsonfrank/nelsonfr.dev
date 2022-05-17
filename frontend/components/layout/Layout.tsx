import Footer from '@/ui/footer'
import Navbar from '@/ui/navbar'
import React, { ReactNode } from 'react'

const Layout = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
    return (
        <>
            <Navbar />
            <section className='nf-max-w-screen-xl nf-mx-auto nf-px-4 nf-my-4'>
                {children}
            </section>
            <Footer />
        </>
    )
}

export default Layout