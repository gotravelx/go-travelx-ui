"use client";

import { useState } from "react";
import { Search, Plane, Clock, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWeb3 } from "@/contexts/web3-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FlightSearch() {
  const {
    isConnected,
    isLoading,
    error,
    connectWallet,
    subscribeToService,
    searchFlight,
  } = useWeb3();
  const [flightNumber, setFlightNumber] = useState("");
  const [flightData, setFlightData] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState<
    Record<number, boolean>
  >({});

  const handleSearch = async () => {
    if (!isSubscribed) {
      setSearchError("Please subscribe to search flights");
      return;
    }

    try {
      const flight = await searchFlight(flightNumber);
      setFlightData(flight);
      setSearchError("");
    } catch (err) {
      setSearchError("Failed to fetch flight data");
      setFlightData(null);
    }
  };

  const handleSubscribe = async (months: number) => {
    try {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: true }));
      await subscribeToService(months);
      setIsSubscribed(true);
    } catch (err) {
      console.error("Failed to subscribe:", err);
    } finally {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: false }));
    }
  };

  const formatDateTime = (utcDateTime: string) => {
    return new Date(utcDateTime).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const subscriptionPlans = [
    {
      name: "Monthly",
      price: "0.1 CAM",
      duration: "1 month",
      months: 1,
      features: ["Unlimited searches", "24/7 support", "Real-time updates"],
    },
    {
      name: "Quarterly",
      price: "0.25 CAM",
      duration: "3 months",
      months: 3,
      features: ["All Monthly features", "Priority support", "Flight alerts"],
    },
    {
      name: "Bi-annual",
      price: "0.45 CAM",
      duration: "6 months",
      months: 6,
      features: ["All Quarterly features", "Price tracking", "Historical data"],
    },
    {
      name: "Annual",
      price: "0.8 CAM",
      duration: "1 year",
      months: 12,
      features: ["All Bi-annual features", "VIP support", "Custom reports"],
    },
  ];

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your MetaMask wallet to access flight search
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full"
              onClick={connectWallet}
              disabled={isLoading}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isLoading ? "Connecting..." : "Connect MetaMask"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Go Travel X</h1>

      {!isSubscribed ? (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Choose a Subscription Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-3xl font-bold mb-4">{plan.price}</div>
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
                    className="w-full"
                    onClick={() => handleSubscribe(plan.months)}
                    disabled={subscriptionLoading[plan.months]}
                  >
                    {subscriptionLoading[plan.months]
                      ? "Processing..."
                      : "Subscribe Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Search Flight</CardTitle>
              <CardDescription>
                Enter a flight number (e.g., 1234)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter flight number..."
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  disabled={isLoading}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>

              {searchError && (
                <p className="text-red-500 mt-2">{searchError}</p>
              )}

              {flightData && (
                <div className="mt-6">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center">
                            <Plane className="mr-2 h-5 w-5" />
                            Flight {flightData.FlightNumber}
                          </CardTitle>
                          <CardDescription>
                            {flightData.Fleet} • {flightData.partner} •{" "}
                            {flightData.FlightType}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">Date</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(
                              flightData.FlightOriginationDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
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
                              <p className="text-2xl font-bold">
                                {flightData.DepartureAirport}
                              </p>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Scheduled:{" "}
                                  {formatDateTime(
                                    flightData.DepartureUTCDateTime
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Estimated:{" "}
                                  {formatDateTime(
                                    flightData.EstimatedDepartureUTCTime
                                  )}
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
                              <p className="text-2xl font-bold">
                                {flightData.ArrivalAirport}
                              </p>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Scheduled:{" "}
                                  {formatDateTime(
                                    flightData.ArrivalUTCDateTime
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Estimated:{" "}
                                  {formatDateTime(
                                    flightData.EstimatedArrivalUTCTime
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <h3 className="font-semibold flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              Terminal & Gate
                            </h3>
                            <p className="mt-1">{flightData.ArrivalTermimal}</p>
                            <p className="text-sm text-muted-foreground">
                              Gate {flightData.ArrivalGate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
