//UIs
import Footer from "@/containers/footer";
import Navbar from "@/containers/navbar";

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
