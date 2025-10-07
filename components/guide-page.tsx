"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Footer } from "./footer";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center py-12 gap-8 px-4">
        {/* Left Side: Text + Buttons */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">
            GoTravelX User Guide – United Flight Subscriptions & Blockchain Data
            Access
          </h1>
            
          <p className="text-lg text-muted-foreground mb-6">
            Learn how to subscribe to United Airlines flights, access
            blockchain-powered flight data, and receive real-time updates with
            zero manual effort.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Button size="lg" onClick={() => router.push("/flifo")}>
              Subscribe Flights
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/about")}
            >
              Read Full Docs
            </Button>
          </div>
        </div>

        {/* Right Side: Workflow Diagram */}
        <div className="flex justify-center items-center py-24">
          <div className="flex justify-center items-center min-h-[500px] bg-gray-100 rounded-xl shadow-md border border-gray-200 p-8">
            <Image
              src="/flowBlockchain.png"
              alt="GoTravelX Subscription Workflow"
              width={800}
              height={500}
              className="w-full max-w-lg h-auto rounded-xl border shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          GoTravelX enables users and app owners to subscribe to United Airlines
          flight information and receive accurate, real-time updates. All flight
          data is securely stored on the Camino Blockchain in a{" "}
          <b>compressed format</b>, which the backend automatically{" "}
          <b>decompresses</b> when fetched — ensuring the app always receives
          human-readable and up-to-date flight details.
        </CardContent>
      </Card>

      {/* Workflow Tabs */}
      <Tabs defaultValue="step1" className="mb-12">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="step1">Step 1</TabsTrigger>
          <TabsTrigger value="step2">Step 2</TabsTrigger>
          <TabsTrigger value="step3">Step 3</TabsTrigger>
          <TabsTrigger value="step4">Step 4</TabsTrigger>
        </TabsList>

        <TabsContent value="step1">
          <Card>
            <CardHeader>
              <CardTitle>User / App Owner Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              1️⃣ Log in to GoTravelX → Navigate to <b>Subscribe Flights</b> →
              Enter the United flight number and date → Confirm.
              <br />✅ The subscription is saved in the{" "}
              <b>FlightSubscriptions</b> DynamoDB table, with a blockchain
              transaction hash linked to it for traceability.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step2">
          <Card>
            <CardHeader>
              <CardTitle>Flight Event Recording</CardTitle>
            </CardHeader>
            <CardContent>
              ✈️ GoTravelX continuously fetches live United flight data. The
              backend then <b>compresses</b> the data and:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Stores it in the <b>FlightEvents</b> DynamoDB table for quick
                  lookups.
                </li>
                <li>
                  Pushes the compressed record to the <b>Camino Blockchain</b>{" "}
                  via the smart contract <b>FlightStatusOracle</b>.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step3">
          <Card>
            <CardHeader>
              <CardTitle>Access & Decompression</CardTitle>
            </CardHeader>
            <CardContent>
              🔍 When your app queries blockchain data using the{" "}
              <b>transaction hash</b>, the backend automatically{" "}
              <b>decompresses</b> it before sending back results. You receive
              clean, readable, and structured flight event data — no manual
              decompression or decoding is required.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              🔔 Subscribed users and app owners get instant updates via{" "}
              <b>WebSockets</b>. Any flight change (delays, arrival,
              cancellations) is automatically decompressed and pushed to the
              user dashboard — providing real-time visibility without refreshes.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Notes Section */}
      <Card className="bg-muted/50 mb-12">
        <CardHeader>
          <CardTitle>Key Notes for App Owners</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              No manual compression or decompression is required — handled
              entirely by backend.
            </li>
            <li>
              All data retrieved from Camino Blockchain is ready-to-use and
              human-readable.
            </li>
            <li>
              Real-time updates are automatically delivered to subscribed users.
            </li>
            <li>
              DynamoDB and blockchain records remain synchronized for
              reliability.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Final CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">
          Start Tracking United Flights Today
        </h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to flights, view real-time blockchain-verified updates, and
          experience transparent flight tracking powered by GoTravelX.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/flifo")}>
            Subscribe Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/about")}
          >
            Read Full Documentation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
