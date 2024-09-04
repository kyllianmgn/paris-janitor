import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {Providers} from "@/components/public/providers";
import Header from "@/components/public/Header/Header";
import RootLayoutAds from "@/components/RootLayoutAds";





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
    <body
        className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
        )}
    >
    <Providers>
          <Header/>
            <RootLayoutAds>
                {children}
            </RootLayoutAds>
      </Providers>
      </body>
    </html>
  );
}
