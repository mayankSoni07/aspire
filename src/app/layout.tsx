/**
 * Root layout component that wraps all pages in the application
 * Provides the HTML structure, font configuration, and global metadata
 * This layout is applied to every page in the Next.js application
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Configure the Geist Sans font from Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure the Geist Mono font from Google Fonts  
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for SEO and browser display
export const metadata: Metadata = {
  title: "Aspire Cards",
  description: "Aspire card management challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0E2A47]`}>
        {children}
      </body>
    </html>
  );
}
