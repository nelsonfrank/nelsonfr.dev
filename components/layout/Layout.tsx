import React from "react";
import Footer from "@/ui/footer";
import Navbar from "@/ui/navbar";

const Layout = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
  return (
    <section className="nf-flex nf-flex-col nf-min-h-screen">
      <Navbar />
      <section className="nf-flex-1">{children}</section>

      <Footer />
    </section>
  );
};

export default Layout;
