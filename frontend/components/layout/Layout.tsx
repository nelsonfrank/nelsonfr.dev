import React from "react";
import Footer from "@/ui/footer";
import Navbar from "@/ui/navbar";

const Layout = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
  return (
    <section className="nf-flex nf-flex-col nf-min-h-screen">
      <Navbar />
      <section className="nf-max-w-screen-lg nf-mx-auto nf-px-4 nf-mt-4 nf-mb-8 nf-flex nf-flex-col nf-flex-1">
        {children}
      </section>

      <Footer />
    </section>
  );
};

export default Layout;
