import type { Metadata } from "next";
import { Josefin_Slab, Josefin_Sans } from "next/font/google";
import "./globals.css";
import Background from "./components/Background";

const josefinSlab = Josefin_Slab({
  variable: "--font-josefin-slab",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Datum Dons | Community Code Review",
  description:
    "Datum Dons is a Gimbalabs project developing and maintaining Aiken validators for Cardano. We welcome community code reviews and contributions to build robust, secure smart contracts.",
  keywords: [
    "Cardano",
    "Aiken",
    "Smart Contracts",
    "Validators",
    "Blockchain",
    "Code Review",
    "Open Source",
  ],
  authors: [{ name: "Datum Dons Community" }],
  openGraph: {
    title: "Datum Dons | Community Code Review",
    description:
      "Building and maintaining Aiken validators for Cardano with community-driven development and code reviews.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Datum Dons | Community Code Review",
    description:
      "Building and maintaining Aiken validators for Cardano with community-driven development and code reviews.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefinSlab.variable} ${josefinSans.variable} antialiased`}
      >
        <Background />
        {children}
      </body>
    </html>
  );
}
