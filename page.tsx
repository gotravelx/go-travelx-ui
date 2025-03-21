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
import SubscribeFlightStatusView from "./components/subscribtion-flight-status-view";
import SubscribeFlightCard from "./components/subscribe-card";

export default function FlightSearch() {
  const { isLoading } = useWeb3();

  const [flightNumber, setFlightNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Separate states for different views
  const [viewFlightData, setViewFlightData] = useState<FlightData | null>(null);
  const [subscribeFlightData, setSubscribeFlightData] =
    useState<FlightData | null>(null);

  const [searchError, setSearchError] = useState("");
  const [carrier, setCarrier] = useState("UA");
  // stations

  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [activeTab, setActiveTab] = useState("view");

  const [lastInteractionTime, setLastInteractionTime] = useState<
    number | undefined
  >();
  const [contractCallCount, setContractCallCount] = useState(0);

  useEffect(() => {
    if (viewFlightData) {
      console.log("view flight data ------>", viewFlightData);
    }
    if (subscribeFlightData) {
      console.log("subscribe flight data ------>", subscribeFlightData);
    }
  }, [viewFlightData, subscribeFlightData]);

  // Clear data when switching tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setFlightNumber("");
    setSearchError("");
    setSelectedDate(new Date());
    setCarrier("UA");
    setDepartureStation("JFK");
    setViewFlightData(null);
    setSubscribeFlightData(null);
  }, []);

  const handleDepartureStationChange = (value: string) => {
    setDepartureStation(value);
  };

  const handleArrivalStationChange = (value: string) => {
    setArrivalStation(value);
  };

  const handleSearch = useCallback(async () => {
    if (!flightNumber) {
      setSearchError("Please enter a flight number");
      return;
    }

    try {
      const data = await flightService.searchFlight(
        carrier,
        flightNumber,
        departureStation,
        selectedDate // passing the Date object directly
      );
      setSubscribeFlightData(data);
      setSearchError(""); // Clear any previous errors
    } catch (error) {
      setSearchError("Error fetching flight data");
    }
  }, [carrier, flightNumber, departureStation, selectedDate]);

  const handleView = useCallback(async () => {
    if (!flightNumber) {
      setSearchError("Please enter a flight number");
      return;
    }

    try {
      const data = await flightService.viewFlightDetails(
        carrier,
        flightNumber,
        selectedDate
      );

      setViewFlightData(data);
      setSearchError("");
    } catch (error) {
      setSearchError("Flight is not found");
      setViewFlightData(null);
    }
  }, [carrier, flightNumber, selectedDate]);

  const handleRefresh = useCallback(async () => {
    if (viewFlightData) {
      await handleView();
    } else if (subscribeFlightData) {
      await handleSearch();
    }
  }, [viewFlightData, subscribeFlightData, handleSearch, handleView]);

  const handleFlightNumberChange = useCallback((value: string) => {
    setFlightNumber(value);
  }, []);

  const handleCarrierChange = useCallback((value: string) => {
    setCarrier(value);
  }, []);

  const handleDepartureStationChang = useCallback((value: string) => {
    setDepartureStation(value);
  }, []);

  return (
    <div className="bg-gradient-to-b dark:from-background dark:to-secondary/10 from-background to-muted/50">
      <NavBar
        lastInteractionTime={lastInteractionTime}
        onRefresh={handleRefresh}
        contractCallCount={contractCallCount}
      />
      <Toaster position="top-right" />
      <main className="flex-grow">
        <Tabs
          defaultValue="view"
          className="container mx-auto pt-24 px-4 py-8"
          onValueChange={handleTabChange}
          value={activeTab}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="view">View Flight Subscriptions</TabsTrigger>
            <TabsTrigger value="subscribe-flight">
              Add Flight Subscription
            </TabsTrigger>
            <TabsTrigger value="un-subscribe-flight">
              Remove Flight Subscription
            </TabsTrigger>
          </TabsList>

          {/* view flight ui start --------------------  */}
          <TabsContent value="view" className="max-h-max min-h-screen">
            <motion.div
              className="mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader></CardHeader>
                <CardContent>
                  <ViewFlight
                    flightNumber={flightNumber}
                    onFlightNumberChange={handleFlightNumberChange}
                    onSearch={handleView}
                    isLoading={isLoading}
                    searchError={searchError}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    carrier={carrier} // Pass carrier state
                    onCarrierChange={handleCarrierChange} // Pass handler
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          {/* view flight ui end --------------------  */}

          {/* subscribe flight ui start --------------------  */}
          <TabsContent value="subscribe-flight">
            <motion.div
              className="mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader></CardHeader>
                <CardContent>
                  <SubscribeFlight
                    flightNumber={flightNumber}
                    onFlightNumberChange={handleFlightNumberChange}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    searchError={searchError}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    carrier={carrier}
                    departureStation={departureStation}
                    setDepartureStation={setDepartureStation}
                    arrivalStation={arrivalStation}
                    setArrivalStation={setArrivalStation}
                    onDepartureStationChange={handleDepartureStationChange}
                    onArrivalStationChange={handleArrivalStationChange}
                    onCarrierChange={handleCarrierChange}
                  />

                  {subscribeFlightData && (
                    <motion.div
                      className="mt-6 space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* <SubscribeFlightStatusView
                        flightData={subscribeFlightData}
                      /> */}
                      <div className="w-full flex items-start justify-start">
                        <SubscribeFlightCard flightData={subscribeFlightData} />
                      </div>
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
      <div className="p-4 text-center mt-auto">
        <Footer />
      </div>
    </div>
  );
}
