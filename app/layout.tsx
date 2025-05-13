import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "gotravelx",
  description: "flight search engine",
  generator: "gotravelx",
  applicationName: "gotravelx",
  referrer: "origin-when-cross-origin",
  keywords: [
    "flight",
    "search",
    "engine",
    "gotravelx",
    "travel",
    "flights",
    "search engine",
    "flight search engine",
    "gotravelx flight search engine",
    "gotravelx travel search engine",
    "gotravelx flights search engine",
    "gotravelx flight",
    "gotravelx travel",
    "gotravelx flights",
    "gotravelx search engine",
    "gotravelx flight search",
    "gotravelx travel search",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <MainNav />
            <Toaster position="top-right" />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
