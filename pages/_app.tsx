// dependencies
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";

// components
import Layout from "@/components/layout";

// global-style
import "../styles/globals.css";

function Root({ Component, pageProps }: AppProps) {
  return (
		<PlausibleProvider domain='example.com'>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</PlausibleProvider>
	);
}

export default Root;
