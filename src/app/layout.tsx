import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ellua – Quiet the Food Noise",
  description: "Your compassionate companion for emotional eating. Join the waitlist for early access.",
  keywords: ["emotional eating", "binge eating", "food noise", "self-awareness", "companion app"],
  openGraph: {
    title: "Ellua – Quiet the Food Noise",
    description: "Your compassionate companion for emotional eating. No judgment. No diets. Just understanding.",
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
