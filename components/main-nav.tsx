"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, BookOpen, Home, Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-switcher";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MainNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-6">
        <div className="h-22 flex items-center justify-between mt-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center">
              {isMounted && (theme === "light" || resolvedTheme === "light") ? (
                <Image
                  src="/logo-light.png"
                  alt="GoTravelX Logo"
                  width={240}
                  height={80}
                  className="h-20 w-auto object-contain"
                />
              ) : isMounted && (theme === "dark" || resolvedTheme === "dark") ? (
                <Image
                  src="/logo-dark0.png"
                  alt="GoTravelX Logo"
                  width={240}
                  height={80}
                  className="h-20 w-auto object-contain"
                />
              ) : (
                <Plane className="h-16 w-16 text-primary" />
              )}
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Desktop Menu"
            className="hidden md:flex items-center gap-6"
          >
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

            <Link
              href="/guide"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/guide")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Guide
            </Link>

            {isMounted && (
              isAuthenticated ? (
                <>
                  <Link
                    href="/admin/carriers"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive("/admin/carriers")
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    Carriers
                  </Link>
                  <Link href="/flifo">
                    <Button
                      className="gap-2"
                      variant={isActive("/flifo") ? "default" : "outline"}
                    >
                      <Plane className="h-4 w-4" />
                      Flight Info
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.name ? getInitials(user.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name
                              ? user?.name?.charAt(0)?.toUpperCase() +
                              user?.name?.slice(1)?.toLowerCase()
                              : ""}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.username}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href="/login">
                  <Button className="gap-2">Sign In</Button>
                </Link>
              )
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Mobile Menu"
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
        <nav
          aria-label="Mobile Menu"
          className="md:hidden border-t bg-background"
        >
          <div className="container py-4 px-4 space-y-4">
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
              href="/about"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                isActive("/about") && "bg-muted"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link
              href="/marketing"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                isActive("/marketing") && "bg-muted"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span>Marketing</span>
            </Link>

            {isMounted && (
              isAuthenticated ? (
                <>
                  <Link
                    href="/admin/carriers"
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                      isActive("/admin/carriers") && "bg-muted"
                    )}
                  >
                    <Plane className="h-4 w-4" />
                    <span>Carriers</span>
                  </Link>
                  <Link
                    href="/flifo"
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                      isActive("/flifo") &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Plane className="h-4 w-4" />
                    <span>Flight Tracking</span>
                  </Link>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start mt-2 text-red-500 hover:text-red-600 hover:bg-red-100/10"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </Button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 p-2 rounded-md bg-primary text-primary-foreground"
                >
                  <span>Sign In</span>
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
