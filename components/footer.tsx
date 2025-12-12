"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Image from "next/image";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    toast.success("Thanks for subscribing to our newsletter!");
    setEmail("");
  };

  const currentYear = new Date().getFullYear();
  if (!mounted) return null;
  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-border/50 pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
            <Image
                src={theme === "dark" ? "/gotravelx-white.png" : "/gotravelx-dark.png"}
                alt="GoTravelX Logo"
                width={75}
                height={80}
                className="rounded-md"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                GoTravelX
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Revolutionizing flight tracking with blockchain technology. Get
              real-time updates and subscribe to your favorite flights.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-left">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowRight size={14} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowRight size={14} />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowRight size={14} />
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowRight size={14} />
                  <span>Flight Tracking</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowRight size={14} />
                  <span>Subscriptions</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowRight size={14} />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-left">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground text-left">
                  900 Oakmont Lane, Suite 350, Westmont, IL 60559
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground text-left">
                  +1 (708) 247-1764
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground text-left">
                  sales@gotravelx.com
                </span>
              </li>
            </ul>
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2 text-left">
                Business Hours
              </h4>
              <p className="text-sm text-muted-foreground text-left">
                Monday - Friday: 9:00 AM - 6:00 PM
              </p>
              <p className="text-sm text-muted-foreground text-left">
                Saturday: 10:00 AM - 4:00 PM
              </p>
              <p className="text-sm text-muted-foreground text-left">
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-left">Newsletter</h3>
            <p className="text-sm text-muted-foreground text-left">
              Subscribe to our newsletter to receive updates on new features and
              promotions.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  Subscribe
                </Button>
              </div>
            </form>
            <div className="pt-2">
              <Button
                variant="link"
                className="text-sm p-0 h-auto text-muted-foreground hover:text-primary text-left"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide Details" : "More About GoTravelX"}
                <ChevronUp
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-sm text-muted-foreground space-y-2"
                >
                  <p className="text-left">
                    GoTravelX is a cutting-edge flight tracking platform that
                    leverages blockchain technology to provide secure,
                    transparent, and reliable flight information.
                  </p>
                  <p className="text-left">
                    Our mission is to revolutionize the way travelers access and
                    interact with flight data, offering real-time updates and
                    personalized notifications.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <p className="text-sm text-muted-foreground text-left">
            © {currentYear} GoTravelX. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row gap-4 text-sm">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
