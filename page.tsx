"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, Wallet, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWeb3 } from "@/contexts/web3-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-switcher"
import { WalletInfo } from "@/components/wallet-info"
import { motion } from "framer-motion"
import { Toaster } from "sonner"
import type { FlightData } from "@/services/api"
import { NavBar } from "@/components/nav-bar"
import { FlightStatusView } from "./components/flight-status-view"
import { toast } from "sonner"
import { memo } from "react"

// Memoized subscription plan card component
const SubscriptionPlanCard = memo(({
  plan,
  isLoading,
  onSubscribe
}: {
  plan: { name: string; price: string; duration: string; months: number; features: string[] };
  isLoading: boolean;
  onSubscribe: (months: number, price: string) => void
}) => (
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
        onClick={() => onSubscribe(plan.months, plan.price)}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Subscribe Now"}
      </Button>
    </CardFooter>
  </Card>
));

// Memoized wallet connection card
const WalletConnectionCard = memo(({
  error,
  isLoading,
  onConnect
}: {
  error: string | null;
  isLoading: boolean;
  onConnect: () => void
}) => (
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
      <Button className="w-full gradient-border" onClick={onConnect} disabled={isLoading}>
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading ? "Connecting..." : "Connect MetaMask"}
      </Button>
    </CardContent>
  </Card>
));

// Memoized search form component
const FlightSearchForm = memo(({
  flightNumber,
  onFlightNumberChange,
  onSearch,
  isLoading,
  searchError
}: {
  flightNumber: string;
  onFlightNumberChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  searchError: string;
}) => (
  <div>
    <div className="flex space-x-2">
      <Input
        placeholder="Enter flight number..."
        value={flightNumber}
        onChange={(e) => onFlightNumberChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onSearch()}
        disabled={isLoading}
        className="glass-card"
      />
      <Button onClick={onSearch} disabled={isLoading} className="gradient-border">
        <Search className="h-4 w-4 mr-2" />
        Search Carrier
      </Button>
    </div>

    {searchError && (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{searchError}</AlertDescription>
      </Alert>
    )}
  </div>
));

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
  const [lastInteractionTime, setLastInteractionTime] = useState<number | undefined>()
  const [contractCallCount, setContractCallCount] = useState(0)

  // Memoize this value to prevent recalculations on every render
  const hasActiveSubscription = useMemo(() =>
    subscriptionExpiry ? new Date() < subscriptionExpiry : false,
    [subscriptionExpiry]
  )

  useEffect(() => {
    if (isConnected) {
      checkSubscription()
    }
  }, [isConnected, checkSubscription])

  // Move console.log to useEffect to prevent it from running on every render
  useEffect(() => {
    if (flightData) {
      console.log("main------>", flightData);
    }
  }, [flightData]);

  const trackContractInteraction = useCallback(() => {
    setLastInteractionTime(Date.now())
    setContractCallCount((prev) => prev + 1)
  }, [])

  const handleSearch = useCallback(async () => {
    if (!hasActiveSubscription) {
      setSearchError("Please subscribe to search flights")
      return
    }

    if (!flightNumber) {
      setSearchError("Please enter a flight number")
      return
    }

    try {
      trackContractInteraction()

      // Search for flight data directly
      const data = await searchAndStoreFlight(flightNumber)
      setFlightData(data)
      setSearchError("")
      toast.success(`Flight ${flightNumber} data retrieved successfully`)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Failed to fetch flight data")
      setFlightData(null)
      toast.error(`Error retrieving flight data: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [hasActiveSubscription, flightNumber, trackContractInteraction, searchAndStoreFlight])

  const handleSubscribe = useCallback(async (months: number, value: string) => {
    try {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: true }))
      trackContractInteraction()
      await subscribeToService(months, value)
      setIsSubscribed(true)
      toast.success(`Successfully subscribed for ${months} month${months > 1 ? "s" : ""}`)
    } catch (err) {
      console.error("Failed to subscribe:", err)
      toast.error(`Subscription failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: false }))
    }
  }, [trackContractInteraction, subscribeToService])

  const handleRefresh = useCallback(async () => {
    if (flightData) {
      await handleSearch()
    }
  }, [flightData, handleSearch])

  const handleFlightNumberChange = useCallback((value: string) => {
    setFlightNumber(value)
  }, [])

  // Memoize subscription plans to prevent recreation on each render
  const subscriptionPlans = useMemo(() => [
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
  ], [])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-secondary/10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-8 max-w-md pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <WalletConnectionCard
              error={error}
              isLoading={isLoading}
              onConnect={connectWallet}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-secondary/10">
      <NavBar
        lastInteractionTime={lastInteractionTime}
        onRefresh={handleRefresh}
        contractCallCount={contractCallCount}
      />
      <Toaster position="top-right" />
      <div className="absolute top-20 right-4 flex items-center gap-4">
        <WalletInfo address={walletAddress} subscriptionExpiry={subscriptionExpiry} />
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8 pt-24">
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
                  <SubscriptionPlanCard
                    plan={plan}
                    isLoading={!!subscriptionLoading[plan.months]}
                    onSubscribe={handleSubscribe}
                  />
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
                <CardTitle>Search Flight Carrier</CardTitle>
                <CardDescription>Enter a flight number to get real-time information</CardDescription>
              </CardHeader>
              <CardContent>
                <FlightSearchForm
                  flightNumber={flightNumber}
                  onFlightNumberChange={handleFlightNumberChange}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  searchError={searchError}
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
        )}
      </div>
    </div>
  )
}