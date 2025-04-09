"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, BookOpen, Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-switcher";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                GoTravelX
              </span>
              {/* <span>Dev</span> */}
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              )}
            >
              About
            </Link>
            <Link
              href="/marketing"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/marketing")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Marketing
            </Link>
            <Link href="/flifo">
              <Button className="gap-2">
                <Plane className="h-4 w-4" />
                Flight Info
              </Button>
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                isActive("/") && "bg-muted"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/marketing"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                isActive("/marketing") && "bg-muted"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link
              href="/whitepaper"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                isActive("/whitepaper") && "bg-muted"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span>Whitepaper</span>
            </Link>
            <Link
              href="/flifo"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md bg-primary text-primary-foreground"
              )}
            >
              <Plane className="h-4 w-4" />
              <span>Flight Tracking</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
