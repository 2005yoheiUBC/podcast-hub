import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Syne } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });

export const metadata: Metadata = {
  title: "Radar",
  description: "Your personal podcast research dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50">
        <Nav />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
