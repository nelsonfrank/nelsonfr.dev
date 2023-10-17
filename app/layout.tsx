import "./globals.css";
// import { poppins, inter } from "./fonts";
// import Preloader from "@/components/preloader";
// import StoreProvider from "@/components/store-provider";
// import { NextAuthProvider } from "./provider";
// import { Toaster } from "@/components/ui/toaster";

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
			{/* <NextAuthProvider>
				<Preloader />
				<StoreProvider> */}
			<html lang='en'>
				<body className='max-w-full mx-auto relative h-screen'>{children}</body>
				{/* <Toaster /> */}
			</html>
			{/* </StoreProvider>
			</NextAuthProvider> */}
		</>
	);
}
