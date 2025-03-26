"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plane, Bell, Clock, MapPin, Info, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { Badge } from "./ui/badge";
import { useState } from "react";
export interface FlightStatusViewProps {
  flightData: {
    flightNumber: string;
    departureDate: string;
    carrierCode: string;
    operatingAirline: string;
    estimatedArrivalUTC: string;
    estimatedDepartureUTC: string;
    arrivalAirport: string;
    departureAirport: string;
    arrivalCity: string;
    departureCity: string;
    departureGate: string;
    arrivalGate: string;
    flightStatus: string;
    statusCode: string;
    equipmentModel: string;
    phase: string;
    departureTerminal: string;
    arrivalTerminal: string;
    actualDepartureUTC: string;
    actualArrivalUTC: string;
    baggageClaim: string;
    departureDelayMinutes: number;
    arrivalDelayMinutes: number;
    boardingTime: string;
    isCanceled: boolean;
    scheduledArrivalUTCDateTime: string;
    scheduledDepartureUTCDateTime: string;
    outTimeUTC: string;
    offTimeUTC: string;
    onTimeUTC: string;
    inTimeUTC: string;
  };
}

const marketingData = [
  { MarketingAirlineCode: "NZ", FlightNumber: "6619" },
  { MarketingAirlineCode: "LH", FlightNumber: "8642" },
  { MarketingAirlineCode: "CM", FlightNumber: "1672" },
  { MarketingAirlineCode: "AC", FlightNumber: "3754" },
];

export default function SubscribeFlightCard({
  flightData,
}: FlightStatusViewProps) {
  // Replace the date formatting section with this safer implementation

  const [currentStatus, setCurrentStatus] = useState("");
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

  return (
    <>
      <Card className="p-4 w-full max-w-3xl bg-gradient-to-br from-background to-muted/20">
        <div className="pb-6 flex justify-between">
          <div className="">
            <div className="text-2xl font-semibold">
              Flight Status - {flightData.carrierCode} {flightData.flightNumber}
            </div>
            {/* show here day ex : Wednesday, March 21, 2025 */}
            <span>
              <span>{formatDate(flightData.departureDate)}</span>
            </span>
          </div>
          <div>
            <div className="text-lg font-bold">
              <Badge
                variant="outline"
                className={`bg-green-500/20 text-green-500 text-lg`}
              >
                Arrived At Gate
              </Badge>
            </div>
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
                    className={`bg-green-500/20 text-green-500 text-lg`}
                  >
                    On Time
                  </Badge>
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {flightData.departureAirport}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">
                      {flightData.departureCity}, US
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
                    className={`bg-green-500/20 text-green-500 text-lg`}
                  >
                    On Time
                  </Badge>
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {flightData.arrivalAirport}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">
                      {flightData.arrivalCity}, US
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
                                flightData.departureDelayMinutes > 0
                                  ? "text-destructive"
                                  : "text-emerald-500"
                              }`}
                            >
                              {flightData.departureDelayMinutes > 0
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
                                flightData.arrivalDelayMinutes > 0
                                  ? "text-destructive"
                                  : "text-emerald-500"
                              }`}
                            >
                              {flightData.arrivalDelayMinutes > 0
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
            {/* Marketing Flight Details Accordion */}{" "}
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
                        {marketingData.map((detail, index) => (
                          <tr key={index} className="hover:bg-muted/30">
                            <td className="border border-border p-2">
                              {detail.MarketingAirlineCode}
                            </td>
                            <td className="border border-border p-2">
                              {detail.FlightNumber}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Subscribe Button */}
            <div className="flex justify-end">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
                <Bell className="h-4 w-4" />
                Subscribe For Updates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
