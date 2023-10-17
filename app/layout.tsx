import Footer from "@/ui/footer";
import Navbar from "@/ui/navbar";
import "./globals.css";

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
				<body className='max-w-full mx-auto relative h-screen'>
					<main className='flex flex-col'>
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
