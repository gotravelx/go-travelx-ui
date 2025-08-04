"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { flightService } from "@/services/api"
import { Toaster } from "sonner"
// Update the imports to point to the correct locations
import SubscribeFlight from "@/components/subscribe-flight"
import ViewFlight from "@/components/view-flight"
import UnsubscribeFlight from "@/components/unsubscribe-flight-client"
import { Footer } from "@/components/footer"
import SubscribeFlightCard from "@/components/subscribe-card"
import { format } from "date-fns"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlightData } from "@/types/flight"
import { contractService } from "@/services/contract-service"
import UnsubscribeFlightPage from "@/pages/unsubscribe-flight/pages"


export default function FlightSearch() {
  const [flightNumber, setFlightNumber] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()) // Set default date

  const [viewFlightData, setViewFlightData] = useState<FlightData | null>(null)
  const [subscribeFlightData, setSubscribeFlightData] = useState<FlightData | null>(null)

  const [searchError, setSearchError] = useState("")
  const [carrier, setCarrier] = useState("UA")

  const [isLoading, setIsLoading] = useState(false)

  const [departureStation, setDepartureStation] = useState("")
  const [arrivalStation, setArrivalStation] = useState("")
  const [activeTab, setActiveTab] = useState("view")
  
  // Add wallet address state - you might get this from a wallet context or user session
  const [walletAddress, setWalletAddress] = useState<string>("")

  useEffect(() => {
    // This ensures the component is fully client-side rendered
    console.log("Flight search component mounted")

    // Set default date on component mount
    if (!selectedDate) {
      setSelectedDate(new Date())
    }

    // Get wallet address from contract service
    const loadWalletAddress = async () => {
      try {
        const address = await contractService.getWalletAddress()
        setWalletAddress(address)
      } catch (error) {
        console.error("Error loading wallet address:", error)
      }
    }

    loadWalletAddress()
  }, [selectedDate])

  useEffect(() => {
    if (viewFlightData) {
      console.log("view flight data ------>", viewFlightData)
    }
    if (subscribeFlightData) {
      console.log("subscribe flight data ------>", subscribeFlightData)
    }
  }, [viewFlightData, subscribeFlightData])

  // Clear data when switching tabs
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value)

      if (value === "view") {
        if (activeTab !== "view") {
          setFlightNumber("")
          setSearchError("")
          setSelectedDate(new Date())
          setCarrier("UA")
          setDepartureStation("")
          setViewFlightData(null)
        }
      } else if (value === "subscribe-flight") {
        setFlightNumber("")
        setSearchError("")
        setSelectedDate(new Date())
        setCarrier("UA")
        setDepartureStation("")
        setArrivalStation("")
        setSubscribeFlightData(null)
      } else {
        // Reset unsubscribe tab filters if needed
      }
    },
    [activeTab],
  )

  const handleDepartureStationChange = (value: string) => {
    setDepartureStation(value)
  }

  const handleArrivalStationChange = (value: string) => {
    setArrivalStation(value)
  }

  const handleSearch = useCallback(async () => {
    if (!flightNumber) {
      setSearchError("Please enter a flight number")
      return
    }

    if (!selectedDate) {
      setSearchError("Please select a departure date")
      return
    }

    try {
      setIsLoading(true)
      const data = await flightService.searchFlight(
        carrier,
        flightNumber as string,
        departureStation,
        arrivalStation,
        selectedDate, // passing the Date object directly
      )
      setSubscribeFlightData(data)
      setSearchError("") // Clear any previous errors
    } catch (error) {
      setSearchError("Error fetching flight data")
    } finally {
      setIsLoading(false)
    }
  }, [carrier, flightNumber, departureStation, arrivalStation, selectedDate])

  const handleView = useCallback(async () => {
    if (!flightNumber) {
      setSearchError("Please enter a flight number")
      return
    }

    try {
      setIsLoading(true)

      const subscribedFlights = await flightService.getSubscribedFlights()

      let filteredFlights = subscribedFlights

      if (flightNumber) {
        filteredFlights = filteredFlights.filter((flight) =>
          flight.flightNumber.toString().includes(flightNumber as string),
        )
      }

      if (carrier) {
        filteredFlights = filteredFlights.filter((flight) => flight.carrierCode === carrier)
      }

      if (selectedDate) {
        const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
        filteredFlights = filteredFlights.filter((flight) => flight.scheduledDepartureDate === dateString)
      }

      setViewFlightData(filteredFlights.length > 0 ? filteredFlights[0] : null)
      setSearchError("")

      if (filteredFlights.length === 0) {
        setSearchError("No matching flights found")
      }
    } catch (error) {
      console.error("Error fetching flight details:", error)
      setSearchError("Error fetching flight details")
      setViewFlightData(null)
    } finally {
      setIsLoading(false)
    }
  }, [carrier, flightNumber, selectedDate])

  // Fixed: Ensure the function signature matches what ViewFlight expects
  const handleFlightNumberChange = useCallback((value: string) => {
    setFlightNumber(value)
  }, [])

  const handleCarrierChange = useCallback((value: string) => {
    setCarrier(value)
  }, [])

  const handleDepartureStationChange2 = useCallback((value: string) => {
    setDepartureStation(value)
  }, [])

  // Fixed: Added explicit type for date change handler
  const handleDateChange = useCallback((date: Date | undefined) => {
    setSelectedDate(date)
  }, [])

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
            <TabsTrigger value="subscribe-flight">Add Flight Subscription</TabsTrigger>
            <TabsTrigger value="un-subscribe-flight">Remove Flight Subscription</TabsTrigger>
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
                  {/* Temporarily comment out props until we verify ViewFlight interface */}
                  <ViewFlight 
                    {...{
                      flightNumber,
                      onFlightNumberChange: handleFlightNumberChange,
                      onSearch: handleView,
                      isLoading,
                      searchError,
                      selectedDate,
                      onDateChange: handleDateChange,
                      carrier,
                      onCarrierChange: handleCarrierChange
                    } as any}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          {/* view flight ui end --------------------  */}

          {/* subscribe flight ui start --------------------  */}
          <TabsContent value="subscribe-flight">
            <motion.div
              className="mx-auto min-h-screen"
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
                    onDateChange={handleDateChange} // Fixed: Use the properly typed handler
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
                      <div className="w-full flex items-start justify-start ">
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
            <UnsubscribeFlightPage/>
          </TabsContent>
          {/* un-subscribe-flight ui end --------------------  */}
        </Tabs>
      </main>
      <div className="p-4 text-center mt-auto">
        <Footer />
      </div>
    </div>
  )
}