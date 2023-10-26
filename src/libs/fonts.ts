import { IBM_Plex_Mono as FontMono, Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const fontMono = FontMono({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ["latin"],
    variable: "--font-mono",
})

// Font files can be colocated inside of `pages`
export const fontHeading = localFont({
    src: "../assets/fonts/CalSans-SemiBold.woff2",
    variable: "--font-heading",
})