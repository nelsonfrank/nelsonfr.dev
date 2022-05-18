import Footer from '@/ui/footer'
import Navbar from '@/ui/navbar'
import React, { ReactNode } from 'react'

const Layout = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
    return (
        <section className="sh-flex sh-flex-col sh-min-h-screen">
            <Navbar />
            <section className='nf-max-w-screen-lg nf-mx-auto nf-px-4 nf-my-4 nf-flex nf-flex-col nf-flex-1'>
                {children}
            </section>
            <Footer />
        </section>
    )
}

export default Layout