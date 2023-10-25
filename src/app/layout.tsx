import Footer from "@/containers/footer";
import Navbar from "@/containers/navbar";
import "@/styles/globals.css";

export const metadata = {
	title: "OpenAI Text Generator App",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<html lang='en'>
				<body>
					<main className='flex flex-col min-h-screen'>
						<Navbar />
						<section className='flex-1'>
							<div className='max-w-screen-lg mx-auto'>{children}</div>
						</section>
						<Footer />
					</main>
				</body>
			</html>
		</>
	);
}
