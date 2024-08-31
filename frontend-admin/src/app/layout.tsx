import "./globals.css";
import {cn} from "@/lib/utils";
import {Inter as FontSans} from "next/font/google";
import Providers from "@/components/public/Providers";
import { Toaster } from "@/components/ui/toaster"

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata = {
    title: 'Paris Janitor Admin',
    description: 'Admin panel for Paris Janitor',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
            <Providers>
                {children}
                <Toaster />
            </Providers>
        </body>
        </html>
    )
}