//UIs
import Footer from "@/ui/footer";
import Navbar from "@/ui/navbar";

const Layout = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
  return (
    <main className="nf-flex nf-flex-col nf-min-h-screen">
      <Navbar />
      <section className="nf-flex-1">
        <div className="nf-max-w-screen-lg nf-mx-auto">{children}</div>
      </section>
      <Footer />
    </main>
  );
};

export default Layout;
