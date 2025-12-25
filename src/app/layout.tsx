import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ellua - Quiet the Food Noise",
  description: "A compassionate companion for emotional eating. Understand your patterns, break the cycle, and find calm. No judgment, just support.",
  keywords: ["emotional eating", "binge eating", "food noise", "recovery", "self-care", "mindful eating"],
  openGraph: {
    title: "Ellua - Quiet the Food Noise",
    description: "A compassionate companion for emotional eating. Understand your patterns, break the cycle, and find calm.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
