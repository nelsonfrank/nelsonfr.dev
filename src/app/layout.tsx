import { fontHeading, fontLogo, fontMono, fontSans } from "@/libs/fonts";
import { cn } from "@/libs/utils";

import Footer from "@/containers/footer";
import { ThemeProvider } from "@/components/providers";

import "@/styles/globals.css";
import SiteHeader from "@/components/layouts/site-header";

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
						fontHeading.variable,
						fontLogo.variable
					)}
				>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						disableTransitionOnChange
					>
						<main className='flex flex-col min-h-screen max-w-5xl mx-auto relative'>
							<SiteHeader />
							<section className='flex-1'>
								<div className='max-w-screen-lg mx-4 lg:mx-auto'>{children}</div>
							</section>
							<Footer />
						</main>
					</ThemeProvider>
				</body>
			</html>
		</>
	);
}
