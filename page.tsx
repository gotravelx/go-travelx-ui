"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { type FlightData, flightService } from "@/services/api";
import { Toaster } from "sonner";

import SubscribeFlight from "./pages/subscribe-flight/page";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import UnsubscribeFlight from "./pages/unsubscribe-flight/pages";
import { Footer } from "@/components/footer";
import SubscribeFlightCard from "./components/subscribe-card";
import { format } from "date-fns";

// Replace with this import that properly handles the component type
const ViewFlight = dynamic(() => import("./components/view-flight"), {
  ssr: false,
});

export default function FlightSearch() {
  const [flightNumber, setFlightNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [viewFlightData, setViewFlightData] = useState<FlightData | null>(null);
  const [subscribedFlights, setSubscribedFlights] = useState<FlightData[]>([]);
  const [subscribeFlightData, setSubscribeFlightData] =
    useState<FlightData | null>(null);

  const [searchError, setSearchError] = useState("");
  const [carrier, setCarrier] = useState("UA");
  const [isLoading, setIsLoading] = useState(false);

  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [activeTab, setActiveTab] = useState("view");

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);

      if (value === "view") {
        if (activeTab !== "view") {
          setFlightNumber("");
          setSearchError("");
          setSelectedDate(undefined);
          setCarrier("UA");
          setDepartureStation("");
          setViewFlightData(null);
        }
      } else if (value === "subscribe-flight") {
        setFlightNumber("");
        setSearchError("");
        setSelectedDate(undefined);
        setCarrier("UA");
        setDepartureStation("");
        setArrivalStation("");
        setSubscribeFlightData(null);
      }
    },
    [activeTab]
  );

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

    if (!departureStation) {
      setSearchError("Please enter a departure station");
      return;
    }

    if (!selectedDate) {
      setSearchError("Please select a departure date");
      return;
    }

    try {
      const data = await flightService.searchFlight(
        carrier,
        flightNumber,
        departureStation,
        selectedDate
      );
      setSubscribeFlightData(data);
      setSearchError("");
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
      setIsLoading(true);
      const subscribedFlights = await flightService.getSubscribedFlights();
      let filteredFlights = subscribedFlights;

      if (flightNumber) {
        filteredFlights = filteredFlights.filter((flight) =>
          flight.flightNumber.toString().includes(flightNumber)
        );
      }

      if (carrier) {
        filteredFlights = filteredFlights.filter(
          (flight) => flight.carrierCode === carrier
        );
      }

      if (selectedDate) {
        const dateString = selectedDate
          ? format(selectedDate, "yyyy-MM-dd")
          : undefined;
        filteredFlights = filteredFlights.filter(
          (flight) => flight.scheduledDepartureDate === dateString
        );
      }

      setViewFlightData(filteredFlights.length > 0 ? filteredFlights[0] : null);
      setSearchError("");

      if (filteredFlights.length === 0) {
        setSearchError("No matching flights found");
      }
    } catch (error) {
      console.error("Error fetching flight details:", error);
      setSearchError("Error fetching flight details");
      setViewFlightData(null);
    } finally {
      setIsLoading(false);
    }
  }, [carrier, flightNumber, selectedDate]);

  const handleRefresh = useCallback(async () => {
    if (activeTab === "view") {
      try {
        const flights = await flightService.getSubscribedFlights();
        setSubscribedFlights(flights);
      } catch (error) {
        console.error("Error refreshing subscribed flights:", error);
      }
    } else if (subscribeFlightData) {
      await handleSearch();
    }
  }, [activeTab, viewFlightData, subscribeFlightData, handleSearch]);

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
      <Toaster position="top-right" />
      <main className="flex-grow">
        <Tabs
          defaultValue="view"
          className=" pt-24 px-4 py-8"
          onValueChange={handleTabChange}
          value={activeTab}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="view">View Flight Subscription</TabsTrigger>
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
          <TabsContent
            value="subscribe-flight "
            className="max-h-max min-h-screen"
          >
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
                    setSearchError={setSearchError} // Pass setSearchError prop
                  />

                  {subscribeFlightData && (
                    <motion.div
                      className="mt-6 space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
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
          <TabsContent
            value="un-subscribe-flight"
            className="max-h-max min-h-screen"
          >
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
