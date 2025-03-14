"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowUp,
  ArrowDown,
  Building2,
  Timer,
  AlertTriangle,
  Luggage,
  Terminal,
  Calendar,
  SettingsIcon,
} from "lucide-react";
import { format } from "date-fns-tz";
import type { FlightData } from "@/services/api";
import { convertUTCToLocal } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlightStatusViewProps {
  flightData: FlightData;
  isLoading?: boolean;
}

type FlightPhase = "not_departed" | "out" | "off" | "on" | "in" | "canceled";
type TimeFormat = "utc" | "local";

export default function FlightStatusView({
  flightData,
}: FlightStatusViewProps) {
  const [activeTab, setActiveTab] = useState<FlightPhase>("not_departed");
  const [currentStatus, setCurrentStatus] = useState("");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("utc");
  const [timezone, setTimezone] = useState("America/New_York");

  // Map API status code to flight phase
  const getFlightPhase = useCallback(
    (statusCode: string, isCanceled: boolean): FlightPhase => {
      if (isCanceled) return "canceled";

      switch (statusCode) {
        case "NDPT":
          return "not_departed";
        case "OUT":
          return "out";
        case "OFF":
          return "off";
        case "ON":
          return "on";
        case "IN":
          return "in";
        case "CNCL":
          return "canceled";
        default:
          return "not_departed";
      }
    },
    []
  );

  // Get status description
  const getStatusDescription = useCallback((phase: FlightPhase): string => {
    switch (phase) {
      case "not_departed":
        return "Not Departed";
      case "out":
        return "Departed";
      case "off":
        return "In Flight";
      case "on":
        return "Landing";
      case "in":
        return "Arrived";
      case "canceled":
        return "Canceled";
      default:
        return "Unknown";
    }
  }, []);

  useEffect(() => {
    // Set initial phase based on flight status
    const phase = getFlightPhase(flightData.statusCode, flightData.isCanceled);
    setActiveTab(phase);
    //setActiveTab("off");
    setCurrentStatus(getStatusDescription(phase));
  }, [
    flightData.statusCode,
    flightData.isCanceled,
    getFlightPhase,
    getStatusDescription,
  ]);

  const formatTime = useCallback(
    (dateString: string | undefined) => {
      if (!dateString) return "Not available";

      if (timeFormat === "utc") {
        return formatUTCTime(dateString);
      } else {
        return convertUTCToLocal(dateString, timezone);
      }
    },
    [timeFormat, timezone]
  );

  const formatUTCTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Time not available";
      }
      return format(date, "yyyy-MM-dd:HH:mm", { timeZone: "UTC" });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Time not available";
    }
  };

  useEffect(() => {
    console.log(flightData);
  }, [flightData]);

  const getTimeRemaining = (targetDate: string) => {
    try {
      const now = new Date();
      const target = new Date(targetDate);

      // Check if target date is valid
      if (isNaN(target.getTime())) {
        return "Time not available";
      }

      const diff = target.getTime() - now.getTime();

      if (diff < 0) return "";

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Time not available";
    }
  };

  const getStatusBadgeColor = (phase: FlightPhase) => {
    switch (phase) {
      case "not_departed":
        return "bg-blue-500/20 text-blue-500";
      case "out":
        return "bg-yellow-500/20 text-yellow-500";
      case "off":
        return "bg-blue-500/20 text-blue-500";
      case "on":
        return "bg-purple-500/20 text-purple-500";
      case "in":
        return "bg-green-500/20 text-green-500";
      case "canceled":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  // City Information Component
  const CityInfo = ({
    city,
    estimatedTime,
    actualTime,
    scheduledTime,
    type,
    terminal,
    airport,
  }: {
    city: string;
    estimatedTime: string;
    actualTime?: string;
    scheduledTime: string;
    type: "departure" | "arrival";
    terminal?: string;
    airport: string;
  }) => (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">
          {type === "departure" ? "From" : "To"}
        </span>
      </div>
      <div className="text-2xl font-bold">{city}</div>
      <div>
        <span className="text-lg font-medium">
          {type === "departure" ? "Departure Airport" : "Arrival Airport"}:{" "}
          {airport}
        </span>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">Estimated Time:</div>
          <div className="font-mono">{formatTime(estimatedTime)}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">Scheduled Time:</div>
          <div className="font-mono">{formatTime(scheduledTime)}</div>
        </div>
        {actualTime && (
          <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground">Actual Time:</div>
            <div className="font-mono">{formatTime(actualTime)}</div>
          </div>
        )}
      </div>

      {terminal && (
        <div className="flex items-center gap-2  mt-2">
          <div className="text-sm text-muted-foreground">Terminal Gate :</div>
          <div>{terminal}</div>
        </div>
      )}
    </div>
  );

  if (activeTab === "canceled") {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Flight Canceled
            </div>
            <Badge
              variant="outline"
              className={`${getStatusBadgeColor("canceled")} text-lg`}
            >
              Canceled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-end">
              <Select
                value={timeFormat}
                onValueChange={(value) => setTimeFormat(value as TimeFormat)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC Time</SelectItem>
                  <SelectItem value="local">Local Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CityInfo
                city={flightData.departureCity}
                estimatedTime={flightData.estimatedDepartureUTC}
                actualTime={flightData.actualDepartureUTC}
                scheduledTime={flightData.scheduledDepartureUTCDateTime}
                type="departure"
                terminal={flightData.departureTerminal}
                airport={flightData.departureAirport}
              />
              <CityInfo
                city={flightData.arrivalCity}
                estimatedTime={flightData.estimatedArrivalUTC}
                actualTime={flightData.actualArrivalUTC}
                scheduledTime={flightData.scheduledDepartureUTCDateTime}
                type="arrival"
                terminal={flightData.arrivalTerminal}
                airport={flightData.arrivalAirport}
              />
            </div>

            {/* <FlightTimingDetails /> */}

            <div className="text-sm text-muted-foreground text-center">
              This flight has been canceled. Please contact{" "}
              {flightData.carrierCode} for more information.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Status
          </div>

          <div className="flex justify-between gap-5">
            <Select
              value={timeFormat}
              onValueChange={(value) => setTimeFormat(value as TimeFormat)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC Time</SelectItem>
                <SelectItem value="local">Local Time</SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant="outline"
              className={`${getStatusBadgeColor(activeTab)} text-lg`}
            >
              {currentStatus}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Time Format Selector */}

          {/* City and Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CityInfo
              city={flightData.departureCity}
              estimatedTime={flightData.estimatedDepartureUTC}
              actualTime={flightData.actualDepartureUTC}
              scheduledTime={flightData.scheduledDepartureUTCDateTime}
              type="departure"
              terminal={flightData.departureTerminal}
              airport={flightData.departureAirport}
            />
            <CityInfo
              city={flightData.arrivalCity}
              estimatedTime={flightData.estimatedArrivalUTC}
              actualTime={flightData.actualArrivalUTC}
              scheduledTime={flightData.scheduledDepartureUTCDateTime}
              type="arrival"
              terminal={flightData.arrivalTerminal}
              airport={flightData.arrivalAirport}
            />
          </div>

          {/* Detailed Flight Timing Information */}
          {/* <FlightTimingDetails /> */}

          {/* Flight Progress */}
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="not_departed"
                disabled={activeTab !== "not_departed"}
                className="flex items-center gap-2"
              >
                <Timer className="h-4 w-4" />
                Not Departed
              </TabsTrigger>
              <TabsTrigger
                value="out"
                disabled={activeTab !== "out"}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                OUT
              </TabsTrigger>
              <TabsTrigger
                value="off"
                disabled={activeTab !== "off"}
                className="flex items-center gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                OFF
              </TabsTrigger>
              <TabsTrigger
                value="on"
                disabled={activeTab !== "on"}
                className="flex items-center gap-2"
              >
                <ArrowDown className="h-4 w-4" />
                ON
              </TabsTrigger>
              <TabsTrigger
                value="in"
                disabled={activeTab !== "in"}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                IN
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                {/* Not Departed Tab */}
                <TabsContent value="not_departed" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Estimated Departure:</span>
                            <span>
                              {formatTime(flightData.estimatedDepartureUTC)}
                            </span>
                          </div>

                          <Badge variant="outline" className="text-lg">
                            {getTimeRemaining(flightData.estimatedDepartureUTC)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Schedule Departure:{" "}
                              {formatTime(
                                flightData.scheduledDepartureUTCDateTime
                              )}
                            </span>
                            {/* <span className="font-mono font-bold">{formatTime(flightData.scheduledDepartureUTCDateTime)}</span> */}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Departure Gate:</span>
                          <span className="font-bold">
                            {flightData.departureGate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <span>Aircraft:</span>
                          <span className="font-bold">
                            {flightData.equipmentModel}
                          </span>
                        </div>
                        {flightData.boardingTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Boarding Time:</span>
                            <span className="font-bold">
                              {flightData.boardingTime}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">
                            {flightData.carrierCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">
                            {flightData.operatingAirline}
                          </span>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Aircraft is at the gate preparing for departure
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="out" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Gate Departure:</span>
                            <span className="font-mono font-bold">
                              {formatTime(
                                flightData.outTimeUTC ||
                                  flightData.estimatedDepartureUTC
                              )}
                            </span>
                          </div>
                          {flightData.departureDelayMinutes !== 0 && (
                            <Badge
                              variant={
                                flightData.departureDelayMinutes > 0
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-lg"
                            >
                              {flightData.departureDelayMinutes > 0
                                ? `Delayed ${flightData.departureDelayMinutes} min`
                                : `Early ${Math.abs(
                                    flightData.departureDelayMinutes
                                  )} min`}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Gate:</span>
                          <span className="font-bold">
                            {flightData.departureGate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <span>Aircraft:</span>
                          <span className="font-bold">
                            {flightData.equipmentModel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">
                            {flightData.carrierCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">
                            {flightData.operatingAirline}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Aircraft has left the gate and is taxiing
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="off" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Takeoff Time:</span>
                            <span className="font-mono font-bold">
                              {formatTime(
                                flightData.offTimeUTC ||
                                  flightData.estimatedDepartureUTC
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Estimated Arrival:</span>
                          <span className="font-mono font-bold">
                            {formatTime(flightData.estimatedArrivalUTC)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Arrival Gate:</span>
                          <span className="font-bold">
                            {flightData.arrivalGate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Route:</span>
                          <span className="font-bold">
                            {flightData.departureCity} →{" "}
                            {flightData.arrivalCity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">
                            {flightData.carrierCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">
                            {flightData.operatingAirline}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="on" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Landing Time:</span>
                            <span className="font-mono font-bold">
                              {formatTime(
                                flightData.onTimeUTC ||
                                  flightData.estimatedArrivalUTC
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Arrival Gate:</span>
                          <span className="font-bold">
                            {flightData.arrivalGate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Destination:</span>
                          <span className="font-bold">
                            {flightData.arrivalCity}
                          </span>
                        </div>
                        {flightData.baggageClaim && (
                          <div className="flex items-center gap-2">
                            <Luggage className="h-4 w-4 text-muted-foreground" />
                            <span>Baggage Claim:</span>
                            <span className="font-bold">
                              {flightData.baggageClaim}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">
                            {flightData.carrierCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">
                            {flightData.operatingAirline}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="in" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Arrived:</span>
                            <span className="font-mono font-bold">
                              {formatTime(
                                flightData.inTimeUTC ||
                                  flightData.actualArrivalUTC ||
                                  flightData.estimatedArrivalUTC
                              )}
                            </span>
                          </div>
                          {flightData.arrivalDelayMinutes !== 0 && (
                            <Badge
                              variant={
                                flightData.arrivalDelayMinutes > 0
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-lg"
                            >
                              {flightData.arrivalDelayMinutes > 0
                                ? `Delayed ${flightData.arrivalDelayMinutes} min`
                                : `Early ${Math.abs(
                                    flightData.arrivalDelayMinutes
                                  )} min`}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Arrival Gate:</span>
                          <span className="font-bold">
                            {flightData.arrivalGate}
                          </span>
                        </div>
                        {flightData.baggageClaim && (
                          <div className="flex items-center gap-2">
                            <Luggage className="h-4 w-4 text-muted-foreground" />
                            <span>Baggage Claim:</span>
                            <span className="font-bold">
                              {flightData.baggageClaim}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Trip Pair:</span>
                          <span className="font-bold">
                            {flightData.departureCity} (
                            {flightData.departureAirport}) →{" "}
                            {flightData.arrivalCity} (
                            {flightData.arrivalAirport})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Flight Duration:</span>
                          <span className="font-bold">
                            {(() => {
                              try {
                                const arrival = new Date(
                                  flightData.actualArrivalUTC ||
                                    flightData.estimatedArrivalUTC
                                );
                                const departure = new Date(
                                  flightData.actualDepartureUTC ||
                                    flightData.estimatedDepartureUTC
                                );

                                // Check if both dates are valid
                                if (
                                  isNaN(arrival.getTime()) ||
                                  isNaN(departure.getTime())
                                ) {
                                  return "Duration not available";
                                }

                                const durationMinutes = Math.round(
                                  (arrival.getTime() - departure.getTime()) /
                                    (1000 * 60)
                                );
                                const hours = Math.floor(durationMinutes / 60);
                                const minutes = durationMinutes % 60;
                                return `${hours}h ${minutes}m`;
                              } catch (error) {
                                console.error(
                                  "Error calculating duration:",
                                  error
                                );
                                return "Duration not available";
                              }
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">
                            {flightData.carrierCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">
                            {flightData.operatingAirline}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
