// dependencies
import type { AppProps } from "next/app";

// components
import Layout from "@/components/layout";

// global-style
import "../styles/globals.css";

function Root({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default Root;
