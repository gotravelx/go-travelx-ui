"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Shield,
  Globe,
  Zap,
  ChevronRight,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { HeroVideoDialog } from "@/components/hero-video-dialog";

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Introducing GoTravelX Blockchain Flight Tracker
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Blockchain-Powered Flight Tracking & Notifications
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Get real-time flight updates with the security and
                  transparency of blockchain technology. Subscribe to flight
                  notifications and never miss an update.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/flifo">
                    <Button size="lg" className="gap-2">
                      <Plane className="h-4 w-4" />
                      Track Flights
                    </Button>
                  </Link>
                  <Link href="/marketing">
                    <Button size="lg" variant="outline">
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm p-8 rounded-xl border shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-primary p-2 rounded-full">
                          <Plane className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-bold">UA 1422</div>
                          <div className="text-sm text-muted-foreground">
                            Chicago → Denver
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <div className="font-medium">ORD</div>
                          <div className="text-muted-foreground">12:30 PM</div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-full h-[1px] bg-border relative">
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">DEN</div>
                          <div className="text-muted-foreground">2:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                See GoTravelX in Action
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Watch how our blockchain-powered flight tracking system works.
                From subscription to real-time notifications, experience the
                future of travel technology.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <HeroVideoDialog />
            </div>
            <div className="max-w-4xl mx-auto text-center">
              <button
                onClick={() => {
                  window.open("https://gotravelx.com/client/", "_blank");
                }}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Eye className="h-4 w-4" />
                See Client App
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose GoTravelX?
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Our blockchain-powered platform offers unique advantages for
                travelers and airlines alike.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl border shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure & Encrypted</h3>
                <p className="text-muted-foreground">
                  End-to-end encrypted flight updates with blockchain
                  verification for maximum security and privacy.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl border shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
                <p className="text-muted-foreground">
                  Track flights from major airlines worldwide with real-time
                  updates and notifications.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl border shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
                <p className="text-muted-foreground">
                  Receive instant notifications about gate changes, delays, and
                  other important flight information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Experience the Future of Flight Tracking?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Connect your wallet and start tracking flights with blockchain
                  security today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/flifo">
                  <Button size="lg" className="gap-2">
                    <Plane className="h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
                <Link href="/marketing">
                  <Button size="lg" variant="outline">
                    Read Whitepaper
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
