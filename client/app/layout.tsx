import type { Metadata } from "next";
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
  title: "Portfolio Dashboard | Real-Time Financial Tracking",
  description:
    "Track your investment portfolio in real-time with live market data from Yahoo Finance and Google Finance. Monitor gains, losses, and sector performance.",
  keywords:
    "portfolio, investments, stocks, NSE, BSE, finance, dashboard",
  authors: [{ name: "OctaByte" }],
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="h-full bg-slate-950">
        {children}
      </body>
    </html>
  );
}
