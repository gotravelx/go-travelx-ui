import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plane,
  Shield,
  Globe,
  Zap,
  Users,
  Building,
  ArrowRight,
} from "lucide-react";
import { Footer } from "@/components/footer";

export default function MarketingPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  About GoTravelX
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Revolutionizing Flight Information with Blockchain
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  GoTravelX is a collaboration between Chain4Travel and leading
                  airlines to provide secure, transparent, and reliable flight
                  information using blockchain technology.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/flifo">
                    <Button size="lg" className="gap-2">
                      <Plane className="h-4 w-4" />
                      Try Flight Tracking
                    </Button>
                  </Link>
                  <Link href="/whitepaper">
                    <Button size="lg" variant="outline">
                      Read Whitepaper
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden border shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm p-8 rounded-xl border shadow-lg text-center">
                      <div className="bg-primary p-4 rounded-full inline-flex mb-4">
                        <Plane className="h-12 w-12 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        Chain4Travel + FLIFO
                      </h3>
                      <p className="text-muted-foreground">
                        Blockchain-powered flight information for the next
                        generation of travel technology
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                About Our Platform
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                GoTravelX combines the power of blockchain with flight
                information to create a secure and transparent ecosystem for
                travelers and airlines.
              </p>
            </div>

            <Tabs defaultValue="platform" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="platform">The Platform</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="team">Our Team</TabsTrigger>
              </TabsList>
              <TabsContent value="platform" className="p-4">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">
                      Flight Information Oracle
                    </h3>
                    <p className="text-muted-foreground">
                      Our FLIFO (Flight Information Oracle) provides real-time,
                      verified flight data directly from airlines to the
                      blockchain. This creates a single source of truth that can
                      be accessed by travelers, airlines, and third-party
                      applications.
                    </p>
                    <h3 className="text-2xl font-bold">Subscription Service</h3>
                    <p className="text-muted-foreground">
                      Users can subscribe to specific flights and receive
                      real-time updates about delays, gate changes, and other
                      important information. Our subscription service offers
                      both standard and secure encrypted options to meet
                      different privacy needs.
                    </p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Benefits</CardTitle>
                      <CardDescription>
                        Why blockchain makes flight information better
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="font-medium">
                              Enhanced Security
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Immutable records and encrypted data transmission
                              protect sensitive flight information.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="font-medium">
                              Global Accessibility
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Decentralized architecture ensures flight data is
                              available anywhere, anytime.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Zap className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="font-medium">
                              Real-Time Updates
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Smart contracts automatically trigger
                              notifications when flight status changes.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="technology" className="p-4">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">
                      Blockchain Infrastructure
                    </h3>
                    <p className="text-muted-foreground">
                      GoTravelX is built on the Camino blockchain, a
                      high-performance blockchain specifically designed for the
                      travel industry. This provides the perfect foundation for
                      our flight information services.
                    </p>
                    <h3 className="text-2xl font-bold">Smart Contracts</h3>
                    <p className="text-muted-foreground">
                      Our platform utilizes advanced smart contracts to automate
                      flight subscriptions, notifications, and data
                      verification. These contracts ensure that all parties
                      receive accurate and timely information.
                    </p>
                    <h3 className="text-2xl font-bold">
                      End-to-End Encryption
                    </h3>
                    <p className="text-muted-foreground">
                      For users who choose secure subscriptions, we implement
                      end-to-end encryption to ensure that sensitive flight
                      details remain private and can only be accessed by the
                      intended recipient.
                    </p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Stack</CardTitle>
                      <CardDescription>
                        The technologies powering GoTravelX
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>Blockchain</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            Camino
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Smart Contracts</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            Solidity
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Frontend</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            Next.js
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Wallet Integration</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            MetaMask
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>API Integration</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            REST & GraphQL
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Data Storage</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            IPFS & On-Chain
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="team" className="p-4">
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">
                      Meet the Team Behind GoTravelX
                    </h3>
                    <p className="mx-auto mt-2 max-w-[700px] text-muted-foreground">
                      Our team combines expertise in blockchain technology,
                      travel industry knowledge, and software development to
                      create the next generation of flight information services.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Team Member 1 */}
                    <Card>
                      <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-2 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>Chain4Travel Team</CardTitle>
                        <CardDescription>Blockchain Experts</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Specialists in blockchain technology for the travel
                          industry, focusing on creating secure and efficient
                          solutions.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Team Member 2 */}
                    <Card>
                      <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-2 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                          <Building className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>Airline Partners</CardTitle>
                        <CardDescription>Industry Leaders</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Major airlines providing real-time flight data and
                          collaborating on the development of the FLIFO
                          platform.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Team Member 3 */}
                    <Card>
                      <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-2 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                          <Plane className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>FLIFO Development</CardTitle>
                        <CardDescription>Technical Team</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Software engineers and UX designers creating an
                          intuitive and powerful flight information platform.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Experience GoTravelX Today
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Connect your wallet and start tracking flights with blockchain
                  security and reliability.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/flifo">
                  <Button size="lg" className="gap-2">
                    <Plane className="h-4 w-4" />
                    Try Flight Tracking
                  </Button>
                </Link>
                <Link href="/whitepaper">
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
