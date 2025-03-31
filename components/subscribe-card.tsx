"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Bell, MapPin, Info, AlertCircle, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { flightService, type MarketedFlightSegment } from "@/services/api";
import { useWeb3 } from "@/contexts/web3-context";
import { toast } from "sonner";
import { FlightData } from "@/types/flight";

export interface FlightStatusViewProps {
  flightData: FlightData;
}

export default function SubscribeFlightCard({
  flightData,
}: FlightStatusViewProps) {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { walletAddress } = useWeb3();

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if flight is already subscribed

  // Handle subscription
  const handleSubscribe = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsSubscribing(true);

      console.log("Subscribing with wallet address:", walletAddress);
      console.log("Flight data:", {
        flightNumber: flightData.flightNumber,
        carrierCode: flightData.carrierCode,
        departureAirport: flightData.departureAirport,
        departureDate: flightData.scheduledDepartureDate,
      });

      await flightService.subscribeToFlight(
        flightData.flightNumber,
        flightData.carrierCode,
        flightData.departureAirport,
        flightData.scheduledDepartureDate,
        walletAddress
      );

      setIsSubscribed(true);
      toast.success("Successfully subscribed to flight updates");
    } catch (error) {
      console.error("Error subscribing to flight:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to subscribe to flight"
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  // Format times with error handling
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date unavailable";
      }

      // Get the day label based on the current date
      const today = new Date();
      const isSameWeekday = date.getDay() === today.getDay();

      let dayLabel = format(date, "EEEE"); // Default day name (e.g., "Wednesday")

      if (isToday(date)) {
        dayLabel = "Today";
      } else if (isTomorrow(date)) {
        dayLabel = "Tomorrow";
      } else if (isSameWeekday) {
        dayLabel = `This ${dayLabel}`;
      }

      return `${dayLabel}, ${format(date, "MMMM d, yyyy")}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      if (!timeString) return "N/A";
      const date = parseISO(timeString);
      if (isNaN(date.getTime())) {
        return "Time unavailable";
      }
      return format(date, "h:mm a");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time unavailable";
    }
  };

  const departureTime = formatTime(flightData.estimatedDepartureUTC);
  const arrivalTime = formatTime(flightData.estimatedArrivalUTC);

  // Calculate flight duration with error handling
  let durationFormatted = "Duration unavailable";
  try {
    if (flightData.estimatedDepartureUTC && flightData.estimatedArrivalUTC) {
      const estimatedDeparture = parseISO(flightData.estimatedDepartureUTC);
      const estimatedArrival = parseISO(flightData.estimatedArrivalUTC);

      if (
        !isNaN(estimatedDeparture.getTime()) &&
        !isNaN(estimatedArrival.getTime())
      ) {
        const durationMs =
          estimatedArrival.getTime() - estimatedDeparture.getTime();
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        durationFormatted = `${durationHours}h ${durationMinutes}m`;
      }
    }
  } catch (error) {
    console.error("Error calculating duration:", error);
  }

  // Format boarding time with error handling
  const boardingTimeFormatted = flightData.boardingTime
    ? formatTime(flightData.boardingTime)
    : "Not available";

  // Get status badge color based on status
  const getStatusBadgeVariant = (status: string | undefined) => {
    if (!status) return "outline";

    switch (status.toLowerCase()) {
      case "on time":
        return "bg-green-500/20 text-green-500";
      case "delayed":
        return "bg-amber-500/20 text-amber-500";
      case "early":
        return "bg-blue-500/20 text-blue-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  // Get flight status badge
  const getFlightStatusBadge = () => {
    const status = flightData.flightStatus || flightData.currentFlightStatus;
    if (!status) return null;

    const badgeText = status;
    let badgeClass = "bg-gray-500/20 text-gray-500";

    switch (status.toLowerCase()) {
      case "in flight":
        badgeClass = "bg-blue-500/20 text-blue-500";
        break;
      case "arrived at gate":
        badgeClass = "bg-green-500/20 text-green-500";
        break;
      case "departed":
        badgeClass = "bg-purple-500/20 text-purple-500";
        break;
      case "cancelled":
        badgeClass = "bg-red-500/20 text-red-500";
        break;
      case "delayed":
        badgeClass = "bg-amber-500/20 text-amber-500";
        break;
    }

    return (
      <Badge variant="outline" className={`${badgeClass} text-lg`}>
        {badgeText}
      </Badge>
    );
  };

  // Don't render anything during SSR to prevent hydration errors
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Card className="p-4 w-full max-w-3xl bg-gradient-to-br from-background to-muted/20">
        <div className="pb-6 flex justify-between">
          <div className="">
            <div className="text-2xl font-semibold">
              Flight Status - {flightData.carrierCode} {flightData.flightNumber}
            </div>
            <span>
              <span>{formatDate(flightData.scheduledDepartureDate)} </span>
            </span>
          </div>
          <div>
            <div className="text-lg font-bold">{getFlightStatusBadge()}</div>
          </div>
        </div>
        <CardContent className="p-4 border-[3px] rounded-xl border-[#0F172A] ">
          <div className="flex flex-col gap-8 ">
            <div className="flex justify-between relative">
              {/* Departure Section */}
              <div className="flex-1 text-left pr-12">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground tracking-wider">
                      DEPARTURE
                    </p>
                    <p className="text-2xl font-bold mt-1">{departureTime}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusBadgeVariant(
                      flightData.departureStatus
                    )} text-lg`}
                  >
                    {flightData.departureStatus || "Status Unknown"}
                  </Badge>
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {flightData.departureAirport}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">
                      {flightData.departureCity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Center Line and Button */}
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-10">
                <div className="relative h-32 flex items-center">
                  <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary to-primary/20"></div>
                  <Button
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
                  >
                    <Plane className="w-6 h-6 " />
                  </Button>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {durationFormatted}
                </p>
              </div>

              {/* Arrival Section */}
              <div className="flex-1 text-right pl-12">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground tracking-wider">
                      ARRIVAL
                    </p>
                    <p className="text-2xl font-bold mt-1">{arrivalTime}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusBadgeVariant(
                      flightData.arrivalStatus
                    )} text-lg`}
                  >
                    {flightData.arrivalStatus || "Status Unknown"}
                  </Badge>
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {flightData.arrivalAirport}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">
                      {flightData.arrivalCity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Flight Details Accordion */}
            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="flight-details" className="border-none">
                <AccordionTrigger className="py-2.5 px-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 hover:no-underline transition-all data-[state=open]:rounded-b-none">
                  <span className="flex items-center gap-2 text-primary font-medium">
                    <Info className="h-4 w-4" />
                    Flight Details
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-0 px-0">
                  <div className="bg-muted/20 border-x border-b border-border rounded-b-lg p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Departure Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-primary">
                          <MapPin className="h-4 w-4" />
                          Departure Details
                        </h3>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Scheduled Departure:
                            </span>
                            <span className="font-medium">
                              {formatTime(
                                flightData.scheduledDepartureUTCDateTime
                              )}
                            </span>
                          </div>

                          {flightData.actualDepartureUTC && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">
                                Actual Departure:
                              </span>
                              <span className="font-medium">
                                {formatTime(flightData.actualDepartureUTC)}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Terminal:
                            </span>
                            <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                              {flightData.departureTerminal || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Gate:</span>
                            <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                              {flightData.departureGate || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Boarding Time:
                            </span>
                            <span className="font-medium">
                              {boardingTimeFormatted}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Delay:
                            </span>
                            <span
                              className={`font-medium ${
                                flightData.departureDelayMinutes ?? 0 > 0
                                  ? "text-destructive"
                                  : "text-emerald-500"
                              }`}
                            >
                              {flightData.departureDelayMinutes ?? 0 > 0
                                ? `${flightData.departureDelayMinutes} minutes`
                                : "On time"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrival Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-primary">
                          <MapPin className="h-4 w-4" />
                          Arrival Details
                        </h3>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Scheduled Arrival:
                            </span>
                            <span className="font-medium">
                              {formatTime(
                                flightData.scheduledArrivalUTCDateTime
                              )}
                            </span>
                          </div>
                          {flightData.actualArrivalUTC && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">
                                Actual Arrival:
                              </span>
                              <span className="font-medium">
                                {formatTime(flightData.actualArrivalUTC)}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Terminal:
                            </span>
                            <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                              {flightData.arrivalTerminal || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Gate:</span>
                            <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                              {flightData.arrivalGate || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Baggage Claim:
                            </span>
                            <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                              {flightData.baggageClaim || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Delay:
                            </span>
                            <span
                              className={`font-medium ${
                                flightData.arrivalDelayMinutes ?? 0 > 0
                                  ? "text-destructive"
                                  : "text-emerald-500"
                              }`}
                            >
                              {flightData.arrivalDelayMinutes ?? 0 > 0
                                ? `${flightData.arrivalDelayMinutes} minutes`
                                : "On time"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Marketing Flight Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="marketing-details" className="border-none">
                <AccordionTrigger className="py-2.5 px-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 hover:no-underline transition-all data-[state=open]:rounded-b-none">
                  <span className="flex items-center gap-2 text-primary font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Marketing Details
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-0 px-0">
                  <div className="bg-muted/20 border-x border-b border-border rounded-b-lg">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="border border-border p-2 text-left">
                            Marketing Airline Code
                          </th>
                          <th className="border border-border p-2 text-left">
                            Marketing Flight Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightData.marketedFlightSegment &&
                        flightData.marketedFlightSegment.length > 0 ? (
                          flightData.marketedFlightSegment.map(
                            (segment, index) => (
                              <tr key={index} className="hover:bg-muted/30">
                                <td className="border border-border p-2">
                                  {segment.MarketingAirlineCode}
                                </td>
                                <td className="border border-border p-2">
                                  {segment.FlightNumber}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr className="hover:bg-muted/30">
                            <td
                              colSpan={2}
                              className="border border-border p-2 text-center"
                            >
                              No marketing flight segments available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Subscribe Button */}
            <div className="flex justify-end">
              {flightData.isSubscribed ? (
                <Button
                  className="bg-red-400 cursor-pointer text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
                  onClick={handleSubscribe}
                  disabled={flightData.isSubscribed}
                >
                  {isSubscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                  Subscribed
                </Button>
              ) : (
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
                  onClick={handleSubscribe}
                  disabled={isSubscribing || isSubscribed}
                >
                  {isSubscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                  {isSubscribed
                    ? "Subscribed"
                    : isSubscribing
                    ? "Subscribing..."
                    : "Subscribe For Updates"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
