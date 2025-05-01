import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "gotravelx",
  description: "flight search engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainNav />
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
