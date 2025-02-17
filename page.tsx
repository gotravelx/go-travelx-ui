"use client"

import { useState, useEffect } from "react"
import { Search, Plane, MapPin, Wallet, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWeb3 } from "@/contexts/web3-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-switcher"
import { WalletInfo } from "@/components/wallet-info"
import { TransactionTable } from "@/components/transaction-table"
import { FlightUpdatesView } from "@/components/flight-updates"
import { motion } from "framer-motion"
import { Toaster } from "sonner"
import type { FlightData } from "@/services/api"

export default function FlightSearch() {
  const {
    isConnected,
    isLoading,
    error,
    walletAddress,
    subscriptionExpiry,
    transactions,
    flightUpdates,
    connectWallet,
    subscribeToService,
    searchAndStoreFlight,
    checkSubscription,
  } = useWeb3()

  const [flightNumber, setFlightNumber] = useState("")
  const [flightData, setFlightData] = useState<FlightData | null>(null)
  const [searchError, setSearchError] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState<Record<number, boolean>>({})

  const hasActiveSubscription = subscriptionExpiry ? new Date() < subscriptionExpiry : false

  useEffect(() => {
    if (isConnected) {
      checkSubscription()
    }
  }, [isConnected, checkSubscription])

  const handleSearch = async () => {
    if (!hasActiveSubscription) {
      setSearchError("Please subscribe to search flights")
      return
    }

    if (!flightNumber) {
      setSearchError("Please enter a flight number")
      return
    }

    try {
      const data = await searchAndStoreFlight(flightNumber)
      setFlightData(data)
      setSearchError("")
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Failed to fetch flight data")
      setFlightData(null)
    }
  }

  const handleSubscribe = async (months: number, value: string) => {
    try {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: true }))
      await subscribeToService(months, value)
      setIsSubscribed(true)
    } catch (err) {
      console.error("Failed to subscribe:", err)
    } finally {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: false }))
    }
  }

  const formatDateTime = (utcDateTime: string) => {
    return new Date(utcDateTime).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on time":
        return "bg-green-500/20 text-green-500 dark:bg-green-500/30"
      case "delayed":
        return "bg-yellow-500/20 text-yellow-500 dark:bg-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-500 dark:bg-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-500 dark:bg-blue-500/30"
    }
  }

  const subscriptionPlans = [
    {
      name: "Monthly",
      price: "0.1",
      duration: "1 month",
      months: 1,
      features: ["Unlimited searches", "24/7 support", "Real-time updates"],
    },
    {
      name: "Quarterly",
      price: "0.25",
      duration: "3 months",
      months: 3,
      features: ["All Monthly features", "Priority support", "Flight alerts"],
    },
    {
      name: "Bi-annual",
      price: "0.45",
      duration: "6 months",
      months: 6,
      features: ["All Quarterly features", "Price tracking", "Historical data"],
    },
    {
      name: "Annual",
      price: "0.8",
      duration: "1 year",
      months: 12,
      features: ["All Bi-annual features", "VIP support", "Custom reports"],
    },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-secondary/10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-8 max-w-md pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Connect Wallet</CardTitle>
                <CardDescription>Connect your MetaMask wallet to access flight search</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button className="w-full gradient-border" onClick={connectWallet} disabled={isLoading}>
                  <Wallet className="mr-2 h-4 w-4" />
                  {isLoading ? "Connecting..." : "Connect MetaMask"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-secondary/10">
      <Toaster position="top-right" />
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <WalletInfo address={walletAddress} subscriptionExpiry={subscriptionExpiry} />
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8 pt-20">
        <motion.h1
          className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Flight Tracker
        </motion.h1>

        {!hasActiveSubscription ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-2xl font-semibold text-center mb-6">Choose a Subscription Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="flex flex-col glass-card hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.duration}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-3xl font-bold mb-4">{plan.price} CAM</div>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center text-sm">
                            <span className="mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full gradient-border"
                        onClick={() => handleSubscribe(plan.months, plan.price)}
                        disabled={subscriptionLoading[plan.months]}
                      >
                        {subscriptionLoading[plan.months] ? "Processing..." : "Subscribe Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Search Flight</CardTitle>
                <CardDescription>Enter a flight number to get real-time information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter flight number..."
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    disabled={isLoading}
                    className="glass-card"
                  />
                  <Button onClick={handleSearch} disabled={isLoading} className="gradient-border">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {searchError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{searchError}</AlertDescription>
                  </Alert>
                )}

                {flightData && (
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="glass-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Plane className="h-5 w-5" />
                              Flight {flightData.flightNumber}
                              <Badge variant="outline" className="animate-pulse-slow">
                                {flightData.operatingAirline}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">{flightData.equipmentModel}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(flightData.flightStatus)}>{flightData.flightStatus}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                <h3 className="font-semibold">Departure</h3>
                              </div>
                              <div className="pl-6">
                                <p className="text-2xl font-bold">{flightData.departureCity}</p>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Gate: {flightData.departureGate}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Time: {formatDateTime(flightData.estimatedDepartureUTC)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                <h3 className="font-semibold">Arrival</h3>
                              </div>
                              <div className="pl-6">
                                <p className="text-2xl font-bold">{flightData.arrivalCity}</p>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Gate: {flightData.arrivalGate}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Time: {formatDateTime(flightData.estimatedArrivalUTC)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      {/* Add Transaction Table */}
      <div className="container mx-auto px-4 py-8">
        <TransactionTable transactions={transactions} />
      </div>

      {/* Add Flight Updates */}
      {flightUpdates && (
        <div className="container mx-auto px-4 pb-8">
          <FlightUpdatesView updates={flightUpdates} />
        </div>
      )}
    </div>
  )
}

