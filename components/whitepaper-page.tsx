"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ArrowRight, CheckCircle } from "lucide-react";
import { Footer } from "@/components/footer";

export default function WhitepaperPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  GoTravelX Whitepaper
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Technical Documentation & Vision
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Explore the technical details, architecture, and future
                  roadmap of the GoTravelX blockchain-powered flight information
                  platform.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Link href="/flifo">
                    <Button size="lg" variant="outline">
                      Try the Platform
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-[3/4] rounded-xl overflow-hidden border shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm p-8 rounded-xl border shadow-lg w-full max-w-[80%]">
                      <div className="flex justify-center mb-6">
                        <FileText className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-center">
                        GoTravelX Whitepaper
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Version 1.0 - April 2025
                      </p>
                      <div className="border-t pt-4 mt-4">
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Technical Architecture</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Blockchain Integration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Future Roadmap</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Whitepaper Content Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#introduction"
                        className="text-primary hover:underline"
                      >
                        1. Introduction
                      </a>
                    </li>
                    <li>
                      <a
                        href="#architecture"
                        className="text-muted-foreground hover:text-primary"
                      >
                        2. Technical Architecture
                      </a>
                    </li>
                    <li>
                      <a
                        href="#blockchain"
                        className="text-muted-foreground hover:text-primary"
                      >
                        3. Blockchain Integration
                      </a>
                    </li>
                    <li>
                      <a
                        href="#security"
                        className="text-muted-foreground hover:text-primary"
                      >
                        4. Security & Privacy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#use-cases"
                        className="text-muted-foreground hover:text-primary"
                      >
                        5. Use Cases
                      </a>
                    </li>
                    <li>
                      <a
                        href="#roadmap"
                        className="text-muted-foreground hover:text-primary"
                      >
                        6. Future Roadmap
                      </a>
                    </li>
                    <li>
                      <a
                        href="#conclusion"
                        className="text-muted-foreground hover:text-primary"
                      >
                        7. Conclusion
                      </a>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Download Full PDF
                    </Button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-12">
                <div id="introduction">
                  <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                  <div className="prose dark:prose-invert">
                    <p>
                      The GoTravelX platform represents a paradigm shift in how
                      flight information is distributed, verified, and consumed.
                      By leveraging blockchain technology, we create a
                      decentralized and transparent system that benefits all
                      stakeholders in the travel ecosystem.
                    </p>
                    <p>
                      This whitepaper outlines the technical architecture,
                      blockchain integration, security measures, and future
                      roadmap of the GoTravelX platform, with a particular focus
                      on the Flight Information Oracle (FLIFO) component.
                    </p>
                    <p>
                      The travel industry has long struggled with fragmented
                      information systems, leading to inconsistencies, delays,
                      and poor customer experiences. GoTravelX addresses these
                      challenges by providing a single source of truth for
                      flight information that is secure, reliable, and
                      accessible.
                    </p>
                  </div>
                </div>

                <div id="architecture">
                  <h2 className="text-2xl font-bold mb-4">
                    2. Technical Architecture
                  </h2>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="bg-muted/50 p-4 rounded-lg border text-center">
                        [Architecture Diagram: GoTravelX Platform Components]
                      </div>
                    </CardContent>
                  </Card>
                  <div className="prose dark:prose-invert">
                    <p>
                      The GoTravelX platform consists of several key components:
                    </p>
                    <ul>
                      <li>
                        <strong>Flight Information Oracle (FLIFO):</strong> The
                        core component that collects, verifies, and distributes
                        flight information from airlines to the blockchain.
                      </li>
                      <li>
                        <strong>Smart Contract Layer:</strong> Handles
                        subscriptions, notifications, and data verification
                        through automated contracts.
                      </li>
                      <li>
                        <strong>API Gateway:</strong> Provides standardized
                        access to flight information for third-party
                        applications.
                      </li>
                      <li>
                        <strong>User Interface:</strong> Web and mobile
                        applications for end-users to track flights and manage
                        subscriptions.
                      </li>
                    </ul>
                  </div>
                </div>

                <div id="blockchain">
                  <h2 className="text-2xl font-bold mb-4">
                    3. Blockchain Integration
                  </h2>
                  <div className="prose dark:prose-invert">
                    <p>
                      GoTravelX is built on the Camino blockchain, a
                      high-performance blockchain specifically designed for the
                      travel industry. This integration provides several key
                      benefits:
                    </p>
                    <ul>
                      <li>
                        <strong>Immutability:</strong> Once flight information
                        is recorded on the blockchain, it cannot be altered,
                        ensuring a reliable historical record.
                      </li>
                      <li>
                        <strong>Transparency:</strong> All stakeholders can
                        verify the source and timing of flight information
                        updates.
                      </li>
                      <li>
                        <strong>Smart Contracts:</strong> Automated execution of
                        subscription logic and notifications based on predefined
                        conditions.
                      </li>
                      <li>
                        <strong>Decentralization:</strong> No single point of
                        failure in the distribution of flight information.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Additional sections would continue here */}
                <div className="text-center mt-8">
                  <p className="text-muted-foreground mb-4">
                    This is a preview of the whitepaper. Download the full PDF
                    for complete details.
                  </p>
                  <Button size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Full Whitepaper
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
