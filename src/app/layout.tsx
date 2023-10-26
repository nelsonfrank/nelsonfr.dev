import { fontHeading, fontMono, fontSans } from "@/libs/fonts";
import { cn } from "@/libs/utils";

import Footer from "@/containers/footer";
import Navbar from "@/containers/navbar";

import "@/styles/globals.css";

export const metadata = {
	title: "Nelson Frank, Software Developer Based in Dar es salaam, Tanzania.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<html lang='en' suppressHydrationWarning>
				<body
					className={cn(
						"min-h-screen bg-background font-mono antialiased",
						fontSans.variable,
						fontMono.variable,
						fontHeading.variable
					)}
				>
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
