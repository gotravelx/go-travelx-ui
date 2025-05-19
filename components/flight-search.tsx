"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { type FlightData, flightService } from "@/services/api";
import { Toaster } from "sonner";
// Update the imports to point to the correct locations
import SubscribeFlight from "@/components/subscribe-flight";
import ViewFlight from "@/components/view-flight";
import UnsubscribeFlight from "@/components/unsubscribe-flight-client";
import { Footer } from "@/components/footer";
import SubscribeFlightCard from "@/components/subscribe-card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FlightSearch() {
  const [flightNumber, setFlightNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  ); // Set default date
  const router = useRouter();

  // Separate states for different views
  const [viewFlightData, setViewFlightData] = useState<FlightData | null>(null);
  const [subscribedFlights, setSubscribedFlights] = useState<FlightData[]>([]);
  const [subscribeFlightData, setSubscribeFlightData] =
    useState<FlightData | null>(null);

  const [searchError, setSearchError] = useState("");
  const [carrier, setCarrier] = useState("UA");
  // stations
  const [isLoading, setIsLoading] = useState(false);

  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [activeTab, setActiveTab] = useState("view");

  const [lastInteractionTime, setLastInteractionTime] = useState<
    number | undefined
  >();
  const [contractCallCount, setContractCallCount] = useState(0);

  useEffect(() => {
    // This ensures the component is fully client-side rendered
    console.log("Flight search component mounted");

    // Set default date on component mount
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate]);

  useEffect(() => {
    if (viewFlightData) {
      console.log("view flight data ------>", viewFlightData);
    }
    if (subscribeFlightData) {
      console.log("subscribe flight data ------>", subscribeFlightData);
    }
  }, [viewFlightData, subscribeFlightData]);

  // Clear data when switching tabs
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);

      // Reset filters for each tab independently
      if (value === "view") {
        // Don't reset view tab filters when coming from other tabs
        if (activeTab !== "view") {
          setFlightNumber("");
          setSearchError("");
          setSelectedDate(new Date()); // Set to current date instead of undefined
          setCarrier("UA");
          setDepartureStation("");
          setViewFlightData(null);
        }
      } else if (value === "subscribe-flight") {
        // Reset subscribe tab filters
        setFlightNumber("");
        setSearchError("");
        setSelectedDate(new Date()); // Set to current date instead of undefined
        setCarrier("UA");
        setDepartureStation("");
        setArrivalStation("");
        setSubscribeFlightData(null);
      } else {
        // Reset unsubscribe tab filters if needed
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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [carrier, flightNumber, departureStation, selectedDate]);

  const handleView = useCallback(async () => {
    if (!flightNumber) {
      setSearchError("Please enter a flight number");
      return;
    }

    try {
      setIsLoading(true);

      // Instead of calling the API directly, we'll use our getSubscribedFlights method
      // and then filter the results based on the search criteria
      const subscribedFlights = await flightService.getSubscribedFlights();

      // Filter the flights based on the search criteria
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
      // Refresh subscribed flights
      try {
        const flights = await flightService.getSubscribedFlights();
        setSubscribedFlights(flights);
      } catch (error) {
        console.error("Error refreshing subscribed flights:", error);
      }
    } else if (subscribeFlightData) {
      await handleSearch();
    }
  }, [activeTab, subscribeFlightData, handleSearch]);

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
          className="container mt-20 mx-auto px-4 py-4"
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
                    setSearchError={setSearchError}
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
