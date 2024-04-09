import { fontHeading, fontLogo, fontMono, fontSans } from "@/libs/fonts";
import { cn } from "@/libs/utils";

import Footer from "@/containers/footer";
import { ThemeProvider } from "@/components/providers";

import "@/styles/globals.css";
import SiteHeader from "@/components/layouts/site-header";
import { Analytics } from "@/components/analytics";

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
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-mono antialiased",
            fontSans.variable,
            fontMono.variable,
            fontHeading.variable,
            fontLogo.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col">
              <SiteHeader />
              <section className="flex-1">
                <div className="mx-4 max-w-screen-lg lg:mx-auto">
                  {children}
                </div>
              </section>
              <Footer />
            </main>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  );
}
