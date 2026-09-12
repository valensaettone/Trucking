import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Reliance Express Ltd. — Freight & Logistics Across North America",
    template: "%s | Reliance Express Ltd.",
  },
  description:
    "Toronto-based transportation and logistics. Local, regional and long-haul freight, expedited shipping and supply chain management across Canada and the United States.",
  keywords: [
    "freight",
    "trucking",
    "logistics",
    "Toronto",
    "long-haul",
    "expedited shipping",
    "supply chain management",
  ],
  openGraph: {
    title: "Reliance Express Ltd. — Freight & Logistics Across North America",
    description:
      "Fast, safe and tailored transportation solutions, dispatched daily from the Greater Toronto Area.",
    locale: "en_CA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070c13",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
