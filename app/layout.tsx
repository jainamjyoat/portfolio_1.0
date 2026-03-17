import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. IMPORT YOUR NEW PREMIUM COMPONENTS
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import MobileMenu from "@/components/MobileMenu"; // <-- ADDED THIS!


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. UPDATE YOUR METADATA FOR SEO & BROWSER TABS
export const metadata: Metadata = {
  title: "Jainam Jyoat | Developer Portfolio",
  description: "CSE B.Tech Student and Full Stack Developer. Bridging the gap between robust back-end logic and intuitive front-end experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background-dark`}
      >
        {/* 3. ADD THE COMPONENTS HERE SO THEY RUN ON EVERY PAGE */}
        
        <Preloader />
        <CustomCursor />
        <MobileMenu /> {/* <-- AND DROPPED IT RIGHT HERE! */}
        
        {children}
        
      </body>
    </html>
  );
}