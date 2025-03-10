"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/web3-context";
import { ThemeToggle } from "@/components/theme-switcher";
import { motion } from "framer-motion";
import { FlightData, flightService } from "@/services/api";
import { Toaster } from "sonner";
import { NavBar } from "@/components/nav-bar";
import FlightStatusView from "@/components/flight-status-view";
import SubscribeFlight from "./pages/subscribe-flight/page";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewFlight from "./pages/view-flight/page";
import UnsubscribeFlight from "./pages/unsubscribe-flight/pages";
import { Footer } from "@/components/footer";
import WalletConnectionCard from "./pages/wallet-connect-card/page";

export default function FlightSearch() {
  const { isConnected, isLoading, error, connectWallet } = useWeb3();

  const [flightNumber, setFlightNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [searchError, setSearchError] = useState("");
  const [carrier, setCarrier] = useState("UA");
  const [departureStation, setDepartureStation] = useState("IAS");

  const [lastInteractionTime, setLastInteractionTime] = useState<
    number | undefined
  >();
  const [contractCallCount, setContractCallCount] = useState(0);

  useEffect(() => {
    if (flightData) {
      console.log("main------>", flightData);
    }
  }, [flightData]);

  const handleSearch = useCallback(async () => {
    if (!flightNumber || !carrier) {
      setSearchError("Please enter a flight number and select a carrier");
      return;
    }

    try {
      const data = await flightService.searchFlight(
        carrier,
        flightNumber,
        selectedDate
      );
      setFlightData(data);
      setSearchError(""); // Clear any previous errors
    } catch (error) {
      setSearchError("Error fetching flight data");
    }
  }, [carrier, flightNumber, selectedDate]);

  const handleRefresh = useCallback(async () => {
    if (flightData) {
      await handleSearch();
    }
  }, [flightData, handleSearch]);

  const handleFlightNumberChange = useCallback((value: string) => {
    setFlightNumber(value);
  }, []);

  const handleCarrierChange = useCallback((value: string) => {
    setCarrier(value);
  }, []);

  const handleDepartureStationChang = useCallback((value: string) => {
    setDepartureStation(value);
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-secondary/10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-8 max-w-md pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WalletConnectionCard
              error={error}
              isLoading={isLoading}
              onConnect={connectWallet}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-secondary/10">
      <NavBar
        lastInteractionTime={lastInteractionTime}
        onRefresh={handleRefresh}
        contractCallCount={contractCallCount}
      />
      <Toaster position="top-right" />
      <main className="flex-grow">
        <Tabs
          defaultValue="view"
          className="container max-w-5xl mx-auto px-4 py-8 pt-24"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="view">View Flight Subscriptions</TabsTrigger>
            <TabsTrigger value="subscribe-flight">
              Add Flight Subscription
            </TabsTrigger>
            <TabsTrigger value="un-subscribe-flight">
              Remove Flight Subscription
            </TabsTrigger>
          </TabsList>

          {/* view flight ui start --------------------  */}
          <TabsContent value="view" className="min-h-screen max-h-max">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>View Flight Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <ViewFlight
                    flightNumber={flightNumber}
                    onFlightNumberChange={handleFlightNumberChange}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    searchError={searchError}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    carrier={carrier} // Pass carrier state
                    onCarrierChange={handleCarrierChange} // Pass handler
                  />

                  {flightData && (
                    <motion.div
                      className="mt-6 space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FlightStatusView flightData={flightData} />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          {/* view flight ui end --------------------  */}

          {/* subscribe flight ui start --------------------  */}
          <TabsContent value="subscribe-flight">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Add Flight Subscription </CardTitle>
                </CardHeader>
                <CardContent>
                  <SubscribeFlight
                    flightNumber={flightNumber}
                    onFlightNumberChange={handleFlightNumberChange}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    searchError={searchError}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    carrier={carrier} // Pass carrier state
                    departureStation={departureStation}
                    onDepartureStationChange={handleDepartureStationChang}
                    onCarrierChange={handleCarrierChange} // Pass handler
                  />

                  {flightData && (
                    <motion.div
                      className="mt-6 space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FlightStatusView flightData={flightData} />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          {/* subscribe flight ui end --------------------  */}

          {/* un-subscribe-flight  ui start --------------------  */}
          <TabsContent value="un-subscribe-flight">
            <UnsubscribeFlight />
          </TabsContent>
          {/* un-subscribe-flight ui end --------------------  */}
        </Tabs>
      </main>
      <div className="mt-auto  text-center p-4">
        <Footer />
      </div>
    </div>
  );
}
