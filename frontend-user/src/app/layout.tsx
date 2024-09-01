import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {Providers} from "@/components/public/providers";
import Header from "@/components/public/Header/Header";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Paris Janitor",
  description: "A travel app for Paris Janitor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2643328897463340" crossOrigin="anonymous"></script>
    </head>
    <body
        className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
        )}
    >
    <Providers>
          <Header/>
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
      </Providers>
      </body>
    </html>
  );
}
