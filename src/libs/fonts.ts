import { Sacramento as FontLogo } from "next/font/google"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import localFont from "next/font/local"

export const fontSans = GeistSans

export const fontMono = GeistMono

export const fontLogo = FontLogo({
    weight: ['400'],
    subsets: ["latin"],
    variable: "--font-sacramento-mono",
})
// Font files can be colocated inside of `pages`
export const fontHeading = localFont({
    src: "../assets/fonts/CalSans-SemiBold.woff2",
    variable: "--font-heading",
})
