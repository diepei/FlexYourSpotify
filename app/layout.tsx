import type { Metadata } from "next";
import { Bricolage_Grotesque, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flex Your Spotify — See a song's streams",
  description: "Check the total number of streams for any Spotify song from its URL.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${robotoMono.variable}`}>
      <body>
        <div className="noise" aria-hidden="true" />
        <header>
          <Link className={`${bricolage.className} brand`} href="/" aria-label="Flex Your Spotify, home">
            <span>FLEX YOUR SPOTIFY</span>
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
