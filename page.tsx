"use client";

import { useState } from "react";
import { Search, Plane, MapPin, Wallet, AlertCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface FlightData {
  flightNumber: string;
  estimatedArrivalUTC: string;
  estimatedDepartureUTC: string;
  arrivalCity: string;
  departureCity: string;
  operatingAirline: string;
  departureGate: string;
  arrivalGate: string;
  flightStatus: string;
  equipmentModel: string;
  exists: boolean;
}

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
  const [flightData, setFlightData] = useState<FlightData | null>(null);
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
      if (!flight.exists) {
        throw new Error("Flight not found");
      }
      setFlightData(flight);
      setSearchError("");
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "Failed to fetch flight data"
      );
      setFlightData(null);
    }
  };

  const handleSubscribe = async (months: number, value: string) => {
    try {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: true }));
      await subscribeToService(months, value);
      setIsSubscribed(true);
    } catch (err) {
      console.error("Failed to subscribe:", err);
    } finally {
      setSubscriptionLoading((prev) => ({ ...prev, [months]: false }));
    }
  };

  const getFlightTimeStatus = (flight: FlightData) => {
    const now = new Date();
    const departureTime = new Date(flight.estimatedDepartureUTC);
    const arrivalTime = new Date(flight.estimatedArrivalUTC);

    if (flight.flightStatus.toLowerCase() === "cancelled") {
      return {
        status: "Not Live",
        color: "bg-gray-500",
        message: "Flight Cancelled",
      };
    }

    const timeToDeparture = Math.floor(
      (departureTime.getTime() - now.getTime()) / (1000 * 60)
    ); // in minutes
    const timeToArrival = Math.floor(
      (arrivalTime.getTime() - now.getTime()) / (1000 * 60)
    ); // in minutes

    if (timeToDeparture > 0) {
      return {
        status: "Ready for Takeoff",
        color: "bg-yellow-500",
        message: `Departure in ${timeToDeparture} min`,
      };
    }

    if (timeToDeparture <= 0 && timeToArrival > 0) {
      return {
        status: "In Air",
        color: "bg-blue-500",
        message: `Arrival in ${timeToArrival} min`,
      };
    }

    return { status: "Landed", color: "bg-green-500", message: " " };
  };

  const formatDateTime = (utcDateTime: string) => {
    return new Date(utcDateTime).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on time":
        return "bg-green-500";
      case "delayed":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

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
                <AlertCircle className="h-4 w-4" />
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
      <h1 className="text-3xl font-bold text-center mb-8">Flight Tracker</h1>

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
                  <div className="text-3xl font-bold mb-4">
                    {plan.price} CAM
                  </div>
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
                    onClick={() => handleSubscribe(plan.months, plan.price)}
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
                Enter a flight number to get real-time information
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
                  {isLoading ? "Req...." : "Request Data"}
                </Button>
              </div>

              {searchError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}

              {flightData && (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Plane className="h-5 w-5" />
                            Flight {flightData.flightNumber}
                            <Badge variant="outline">
                              {flightData.operatingAirline}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {flightData.equipmentModel}
                          </CardDescription>
                        </div>

                        {/* Display Live Status */}
                        {(() => {
                          const { status, color, message } =
                            getFlightTimeStatus(flightData);
                          return (
                            <Badge className={color}>
                              {status} - {message}
                            </Badge>
                          );
                        })()}
                        <Badge
                          className={getStatusColor(flightData.flightStatus)}
                        >
                          {flightData.flightStatus}
                        </Badge>
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
                                {flightData.departureCity}
                              </p>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Gate: {flightData.departureGate}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Time:{" "}
                                  {formatDateTime(
                                    flightData.estimatedDepartureUTC
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
                                {flightData.arrivalCity}
                              </p>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Gate: {flightData.arrivalGate}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Time:{" "}
                                  {formatDateTime(
                                    flightData.estimatedArrivalUTC
                                  )}
                                </p>
                              </div>
                            </div>
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