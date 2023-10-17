//UIs
import Footer from "@/ui/footer";
import Navbar from "@/ui/navbar";

const Layout = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
  return (
		<main className='flex flex-col min-h-screen'>
			<Navbar />
			<section className='flex-1'>
				<div className='max-w-screen-lg mx-auto'>{children}</div>
			</section>
			<Footer />
		</main>
	);
};

export default Layout;
