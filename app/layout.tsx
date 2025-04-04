import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/contexts/web3-context";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react"; // Added import for React

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
