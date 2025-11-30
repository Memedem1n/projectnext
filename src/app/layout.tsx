import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navbar } from "@/components/layout/Navbar";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { ComparisonBar } from "@/components/listing/ComparisonBar";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectNexx - Yeni Nesil İlan Platformu",
  description: "Güvenli alışverişin yeni adresi ProjectNexx ile hayalindeki ürüne ulaş.",
};

import { headers } from "next/headers";

// ... imports

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const subdomain = headersList.get("x-subdomain");
  const isAdmin = subdomain === "admin" || subdomain === "yonetim";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ComparisonProvider>
            {!isAdmin && <Navbar />}
            {children}
            {!isAdmin && <Footer />}
            <ComparisonBar />
          </ComparisonProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
