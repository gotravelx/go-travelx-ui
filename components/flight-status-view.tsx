"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
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
  SettingsIcon,
} from "lucide-react"
import { format } from "date-fns-tz"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { convertUTCToLocal } from "@/utils/common"
import type { FlightData, FlightPhase } from "@/types/flight"

interface FlightStatusViewProps {
  flightData: FlightData
  isLoading?: boolean
}

export type ExtendedFlightPhase = FlightPhase | "cncl"
type TimeFormat = "utc" | "local"

export default function FlightStatusView({ flightData }: FlightStatusViewProps) {
  // Check if flightData is empty or all strings are empty
  const isFlightDataEmpty = Object.values(flightData).every((value) => typeof value === "string" && value.trim() === "")
  const [currentPhase, setCurrentPhase] = useState<ExtendedFlightPhase>("ndpt")
  const [activeTab, setActiveTab] = useState<ExtendedFlightPhase>("ndpt")
  const [currentStatus, setCurrentStatus] = useState("")
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("utc")
  const [timezone, setTimezone] = useState("America/New_York")

  // Map API status code to flight phase
  const getFlightPhase = useCallback((statusCode: string, isCanceled: boolean): FlightPhase => {
    if (isCanceled) return "cncl"

    switch (statusCode) {
      case "NDPT":
        return "ndpt"
      case "OUT":
        return "out"
      case "OFF":
        return "off"
      case "ON":
        return "on"
      case "IN":
        return "in"
      case "CNCL":
        return "cncl"
      default:
        return "ndpt"
    }
  }, [])

  // Get status description
  const getStatusDescription = useCallback((phase: FlightPhase): string => {
    switch (phase) {
      case "ndpt":
        return "Not Departed"
      case "out":
        return "Departed"
      case "off":
        return "In Flight"
      case "on":
        return "Landing"
      case "in":
        return "Arrived"
      case "cncl":
        return "Canceled"
      default:
        return "Unknown"
    }
  }, [])

  const formatTime = useCallback(
    (dateString: string | undefined) => {
      if (!dateString) return "Not available"

      if (timeFormat === "utc") {
        return formatUTCTime(dateString)
      } else {
        return convertUTCToLocal(dateString, timezone)
      }
    },
    [timeFormat, timezone],
  )

  const formatUTCTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Time not available"
      }
      return format(date, "yyyy-MM-dd:HH:mm", { timeZone: "UTC" })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Time not available"
    }
  }

  const getTimeRemaining = (targetDate: string) => {
    try {
      const now = new Date()
      const target = new Date(targetDate)

      // Check if target date is valid
      if (isNaN(target.getTime())) {
        return "Time not available"
      }

      const diff = target.getTime() - now.getTime()

      if (diff < 0) return ""

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m remaining`
    } catch (error) {
      console.error("Error calculating time remaining:", error)
      return "Time not available"
    }
  }

  // Get all regular phases in order
  const getPhaseOrder = (): FlightPhase[] => {
    return ["ndpt", "out", "off", "on", "in", "cncl"]
  }

  // Get accessible tabs based on current phase
  const getAccessibleTabs = (currentPhase: FlightPhase): FlightPhase[] => {
    if (currentPhase === "cncl") {
      return ["cncl"]
    }

    const allPhases = getPhaseOrder().filter((phase) => phase !== "cncl")
    const currentIndex = allPhases.indexOf(currentPhase)

    // Return all phases up to and including the current phase
    return allPhases.slice(0, currentIndex + 1)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as FlightPhase)
  }

  const getStatusBadgeColor = (phase: FlightPhase) => {
    switch (phase) {
      case "ndpt":
        return "bg-blue-500/20 text-blue-500"
      case "out":
        return "bg-yellow-500/20 text-yellow-500"
      case "off":
        return "bg-blue-500/20 text-blue-500"
      case "on":
        return "bg-purple-500/20 text-purple-500"
      case "in":
        return "bg-green-500/20 text-green-500"
      case "cncl":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

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
    city: string
    estimatedTime: string
    actualTime?: string
    scheduledTime: string
    type: "departure" | "arrival"
    terminal?: string
    airport: string
  }) => (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">{type === "departure" ? "From" : "To"}</span>
      </div>
      <div className="text-2xl font-bold">{city || "TBD"}</div>
      <div>
        <span className="text-lg font-medium">
          {type === "departure" ? "Departure Airport" : "Arrival Airport"}: {airport || "TBD"}
        </span>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">Estimated Time:</div>
          <div className="font-mono">{formatTime(estimatedTime) || "TBD"}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">Scheduled Time:</div>
          <div className="font-mono">{formatTime(scheduledTime) || "TBD"}</div>
        </div>
        {actualTime && (
          <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground">Actual Time:</div>
            <div className="font-mono">{formatTime(actualTime) || "TBD"}</div>
          </div>
        )}
      </div>

      {terminal && (
        <div className="flex items-center gap-2 mt-2">
          <div className="text-sm text-muted-foreground">Terminal Gate:</div>
          <div>{terminal || "TBD"}</div>
        </div>
      )}
    </div>
  )

  useEffect(() => {
    // Set initial phase based on flight status
    const phase = getFlightPhase(flightData.statusCode, flightData.isCanceled)
    setCurrentPhase(phase)
    setActiveTab(phase)
    setCurrentStatus(getStatusDescription(phase))
  }, [flightData.statusCode, flightData.isCanceled, getFlightPhase, getStatusDescription])

  useEffect(() => {
    console.log(flightData)
  }, [flightData])

  if (isFlightDataEmpty) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Flight Not Found
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            The flight information could not be found. Please check the flight number and try again.
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentPhase === "cncl") {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Flight Canceled
            </div>
            <Badge variant="outline" className={`${getStatusBadgeColor("cncl")} text-lg`}>
              Canceled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-end">
              <Select value={timeFormat} onValueChange={(value) => setTimeFormat(value as TimeFormat)}>
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

            <div className="text-sm text-muted-foreground text-center">
              This flight has been canceled. Please contact {flightData.carrierCode} for more information.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Status
          </div>

          <div className="flex justify-between gap-5">
            <Select value={timeFormat} onValueChange={(value) => setTimeFormat(value as TimeFormat)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC Time</SelectItem>
                <SelectItem value="local">Local Time</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className={`${getStatusBadgeColor(currentPhase)} text-lg`}>
              {currentStatus}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

          {/* Flight Progress */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList
              className={`grid w-full ${
                currentPhase === "canceled"
                  ? "grid-cols-1"
                  : getAccessibleTabs(currentPhase).length === 1
                    ? "grid-cols-1"
                    : getAccessibleTabs(currentPhase).length === 2
                      ? "grid-cols-2"
                      : getAccessibleTabs(currentPhase).length === 3
                        ? "grid-cols-3"
                        : getAccessibleTabs(currentPhase).length === 4
                          ? "grid-cols-4"
                          : "grid-cols-5"
              }`}
            >
              {currentPhase !== "canceled" &&
                getAccessibleTabs(currentPhase).map((phase) => (
                  <TabsTrigger key={phase} value={phase} className="flex items-center gap-2">
                    {phase === "ndpt" && <Timer className="h-4 w-4" />}
                    {phase === "out" && <ArrowRight className="h-4 w-4" />}
                    {phase === "off" && <ArrowUp className="h-4 w-4" />}
                    {phase === "on" && <ArrowDown className="h-4 w-4" />}
                    {phase === "in" && <CheckCircle2 className="h-4 w-4" />}
                    {phase === "ndpt" && "NDPT"}
                    {phase === "out" && "OUT"}
                    {phase === "off" && "OFF"}
                    {phase === "on" && "ON"}
                    {phase === "in" && "IN"}
                  </TabsTrigger>
                ))}
              {currentPhase === "canceled" && (
                <TabsTrigger value="canceled" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Canceled
                </TabsTrigger>
              )}
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
                <TabsContent value="ndpt" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Estimated Departure:</span>
                            <span>{formatTime(flightData.estimatedDepartureUTC)}</span>
                          </div>

                          <Badge variant="outline" className="text-lg">
                            {getTimeRemaining(flightData.estimatedDepartureUTC)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Schedule Departure: {formatTime(flightData.scheduledDepartureUTCDateTime)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Departure Gate:</span>
                          <span className="font-bold">{flightData.departureGate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <span>Aircraft:</span>
                          <span className="font-bold">{flightData.equipmentModel}</span>
                        </div>
                        {flightData.boardingTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Boarding Time:</span>
                            <span className="font-bold">{flightData.boardingTime}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">{flightData.carrierCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">{flightData.operatingAirline}</span>
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
                              {formatTime(flightData.outTimeUTC || flightData.estimatedDepartureUTC)}
                            </span>
                          </div>
                          {flightData.departureDelayMinutes !== 0 && (
                            <Badge
                              variant={(flightData.departureDelayMinutes ?? 0 > 0) ? "destructive" : "outline"}
                              className="text-lg"
                            >
                              {(flightData.departureDelayMinutes ?? 0 > 0)
                                ? `Delayed ${flightData.departureDelayMinutes} min`
                                : `Early ${Math.abs(flightData.departureDelayMinutes ?? 0)} min`}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Gate:</span>
                          <span className="font-bold">{flightData.departureGate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <span>Aircraft:</span>
                          <span className="font-bold">{flightData.equipmentModel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">{flightData.carrierCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">{flightData.operatingAirline}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Aircraft has left the gate and is taxiing</div>
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
                              {formatTime(flightData.offTimeUTC || flightData.estimatedDepartureUTC)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Estimated Arrival:</span>
                          <span className="font-mono font-bold">{formatTime(flightData.estimatedArrivalUTC)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Arrival Gate:</span>
                          <span className="font-bold">{flightData.arrivalGate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Route:</span>
                          <span className="font-bold">
                            {flightData.departureCity} → {flightData.arrivalCity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">{flightData.carrierCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">{flightData.operatingAirline}</span>
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
                              {formatTime(flightData.onTimeUTC || flightData.estimatedArrivalUTC)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Arrival Gate:</span>
                          <span className="font-bold">{flightData.arrivalGate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Destination:</span>
                          <span className="font-bold">{flightData.arrivalCity}</span>
                        </div>
                        {flightData.baggageClaim && (
                          <div className="flex items-center gap-2">
                            <Luggage className="h-4 w-4 text-muted-foreground" />
                            <span>Baggage Claim:</span>
                            <span className="font-bold">{flightData.baggageClaim}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">{flightData.carrierCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">{flightData.operatingAirline}</span>
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
                                flightData.inTimeUTC || flightData.actualArrivalUTC || flightData.estimatedArrivalUTC,
                              )}
                            </span>
                          </div>
                          {flightData.arrivalDelayMinutes !== 0 && (
                            <Badge
                              variant={(flightData.arrivalDelayMinutes ?? 0) > 0 ? "destructive" : "outline"}
                              className="text-lg"
                            >
                              {(flightData.arrivalDelayMinutes ?? 0) > 0
                                ? `Delayed ${flightData.arrivalDelayMinutes} min`
                                : `Early ${Math.abs(flightData.arrivalDelayMinutes ?? 0)} min`}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Arrival Gate:</span>
                          <span className="font-bold">{flightData.arrivalGate}</span>
                        </div>
                        {flightData.baggageClaim && (
                          <div className="flex items-center gap-2">
                            <Luggage className="h-4 w-4 text-muted-foreground" />
                            <span>Baggage Claim:</span>
                            <span className="font-bold">{flightData.baggageClaim}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Trip Pair:</span>
                          <span className="font-bold">
                            {flightData.departureCity} ({flightData.departureAirport}) → {flightData.arrivalCity} (
                            {flightData.arrivalAirport})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Flight Duration:</span>
                          <span className="font-bold">
                            {(() => {
                              try {
                                const arrival = new Date(flightData.actualArrivalUTC || flightData.estimatedArrivalUTC)
                                const departure = new Date(
                                  flightData.actualDepartureUTC || flightData.estimatedDepartureUTC,
                                )

                                // Check if both dates are valid
                                if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
                                  return "Duration not available"
                                }

                                const durationMinutes = Math.round(
                                  (arrival.getTime() - departure.getTime()) / (1000 * 60),
                                )
                                const hours = Math.floor(durationMinutes / 60)
                                const minutes = durationMinutes % 60
                                return `${hours}h ${minutes}m`
                              } catch (error) {
                                console.error("Error calculating duration:", error)
                                return "Duration not available"
                              }
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Carrier Code:</span>
                          <span className="font-bold">{flightData.carrierCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Operated By:</span>
                          <span className="font-bold">{flightData.operatingAirline}</span>
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
  )
}
