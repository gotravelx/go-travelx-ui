"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Bell, MapPin, Info, AlertCircle, Loader2, LockIcon, ShieldCheck, ShieldAlert } from "lucide-react"
import { Badge } from "./ui/badge"
import { useState, useEffect } from "react"
import { flightService } from "@/services/api"
import { toast } from "sonner"
import { format, parseISO, isToday, isTomorrow } from "date-fns"
import type { FlightData } from "@/types/flight"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getStatusDisplay } from "@/utils/common"

export interface FlightStatusViewProps {
  flightData: FlightData
}



export default function SubscribeFlightCard({ flightData }: FlightStatusViewProps) {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isSecureSubscribing, setIsSecureSubscribing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSecureSubscribed, setIsSecureSubscribed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // State for confirmation dialogs
  const [isStandardDialogOpen, setIsStandardDialogOpen] = useState(false)
  const [isSecureDialogOpen, setIsSecureDialogOpen] = useState(false)

  // Handle standard subscription button click - opens confirmation dialog
  const handleSubscribeClick = () => {
    setIsStandardDialogOpen(true)
  }

  // Handle secure subscription button click - opens confirmation dialog
  const handleSecureSubscribeClick = () => {
    setIsSecureDialogOpen(true)
  }

  // Execute standard subscription after confirmation
  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true)
      console.log("Flight data:", {
        flightNumber: flightData.flightNumber,
        carrierCode: flightData.carrierCode,
        departureAirport: flightData.departureAirport,
        arrivalAirport:flightData.arrivalAirport,
        departureDate: flightData.scheduledDepartureDate,
      })

      await flightService.subscribeToFlight({
        flightNumber: flightData.flightNumber,
        carrierCode: flightData.carrierCode,
        departureAirport: flightData.departureAirport,
        arrivalAirport:flightData.arrivalAirport,
        scheduledDepartureDate: flightData.scheduledDepartureDate,
      })

      setIsSubscribed(true)
      toast.success("Successfully subscribed to standard flight updates")
    } catch (error) {
      console.error("Error subscribing to flight:", error)
      toast.error(error instanceof Error ? error.message : "Failed to subscribe to flight")
    } finally {
      setIsSubscribing(false)
      setIsStandardDialogOpen(false)
    }
  }

  // Execute secure subscription after confirmation
  const handleSecureSubscribe = async () => {
    try {
      setIsSecureSubscribing(true)
      console.log("Flight data:", {
        flightNumber: flightData.flightNumber,
        carrierCode: flightData.carrierCode,
        arrivalAirport:flightData.arrivalAirport,
        departureAirport: flightData.departureAirport,
        departureDate: flightData.scheduledDepartureDate,
      })

      // In a real implementation, this would call a different API endpoint for secure subscriptions
      await flightService.subscribeToFlight({
        flightNumber: flightData.flightNumber,
        carrierCode: flightData.carrierCode,
        departureAirport: flightData.departureAirport,
        arrivalAirport:flightData.arrivalAirport,
        scheduledDepartureDate: flightData.scheduledDepartureDate,
      })

      setIsSecureSubscribed(true)
      toast.success("Successfully subscribed to secure encrypted flight updates")
    } catch (error) {
      console.error("Error subscribing to flight:", error)
      toast.error(error instanceof Error ? error.message : "Failed to subscribe to flight")
    } finally {
      setIsSecureSubscribing(false)
      setIsSecureDialogOpen(false)
    }
  }

  // Format times with error handling
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Date unavailable"
      }

      // Get the day label based on the current date
      const today = new Date()
      const isSameWeekday = date.getDay() === today.getDay()

      let dayLabel = format(date, "EEEE") // Default day name (e.g., "Wednesday")

      if (isToday(date)) {
        dayLabel = "Today"
      } else if (isTomorrow(date)) {
        dayLabel = "Tomorrow"
      } else if (isSameWeekday) {
        dayLabel = `${dayLabel}`
      }

      return `${dayLabel}, ${format(date, "MMMM d, yyyy")}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date unavailable"
    }
  }

  const formatTime = (timeString: string) => {
    try {
      if (!timeString) return "TBD"
      const date = parseISO(timeString)
      if (isNaN(date.getTime())) {
        return "TBD"
      }
      return format(date, "h:mm a")
    } catch (error) {
      console.error("Error formatting time:", error)
      return "TBD"
    }
  }

  const departureTime = formatTime(flightData.estimatedDepartureUTC)
  const arrivalTime = formatTime(flightData.estimatedArrivalUTC)

  // Calculate flight duration with error handling
  let durationFormatted = "Duration unavailable"
  try {
    if (flightData.estimatedDepartureUTC && flightData.estimatedArrivalUTC) {
      const estimatedDeparture = parseISO(flightData.estimatedDepartureUTC)
      const estimatedArrival = parseISO(flightData.estimatedArrivalUTC)

      if (!isNaN(estimatedDeparture.getTime()) && !isNaN(estimatedArrival.getTime())) {
        const durationMs = estimatedArrival.getTime() - estimatedDeparture.getTime()
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
        durationFormatted = `${durationHours}h ${durationMinutes}m`
      }
    }
  } catch (error) {
    console.error("Error calculating duration:", error)
  }

  // Format boarding time with error handling
  const boardingTimeFormatted = flightData.boardingTime ? formatTime(flightData.boardingTime) : "Not available"

  // Get flight status badge
  const getFlightStatusBadge = () => {
    const status = flightData.flightStatus || flightData.currentFlightStatus
    if (!status) return null

    const badgeText = status
    let badgeClass = "bg-gray-500/20 text-gray-500"

    switch (status.toLowerCase()) {
      case "in flight":
        badgeClass = "bg-blue-500/20 text-blue-500"
        break
      case "arrived at gate":
        badgeClass = "bg-green-500/20 text-green-500"
        break
      case "departed":
        badgeClass = "bg-purple-500/20 text-purple-500"
        break
      case "cancelled":
        badgeClass = "bg-red-500/20 text-red-500"
        break
      case "delayed":
        badgeClass = "bg-amber-500/20 text-amber-500"
        break
    }

    return (
      <Badge variant="outline" className={`${badgeClass} text-lg`}>
        {badgeText}
      </Badge>
    )
  }

  // Get departure and arrival status displays
  const departureStatus = getStatusDisplay(flightData.departureState || "ONT", false)
  const arrivalStatus = getStatusDisplay(flightData.arrivalState || "ONT", true)

  // Don't render anything during SSR to prevent hydration errors
  if (!isMounted) {
    return null
  }

  return (
    <Card className="p-4 w-full bg-gradient-to-br from-background to-muted/20">
      {/* Flight header outside the flex container */}
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Flight Card */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="border-[3px] p-4 rounded-xl border-[#0F172A]">
              <div className="pb-4 flex justify-between">
                <div>
                  <div className="text-2xl font-semibold">
                    Flight Status - {flightData.carrierCode} {flightData.flightNumber}
                  </div>
                  <span>{formatDate(flightData.scheduledDepartureDate)}</span>
                </div>
                <div>
                  <div className="text-lg font-bold">{getFlightStatusBadge()}</div>
                </div>
              </div>

              <div className="flex justify-between relative">
                {/* Departure Section */}
                <div className="flex-1 text-left pr-12">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground tracking-wider">DEPARTURE</p>
                      <p className="text-2xl font-bold mt-1">{departureTime}</p>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-primary">{flightData.departureAirport}</span>
                      <p className="text-sm text-muted-foreground mt-2">{flightData.departureCity}</p>
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
                      <Plane className="w-6 h-6" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{durationFormatted}</p>
                </div>

                {/* Arrival Section */}
                <div className="flex-1 text-right pl-12">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground tracking-wider">ARRIVAL</p>
                      <p className="text-2xl font-bold mt-1">{arrivalTime}</p>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-primary">{flightData.arrivalAirport}</span>
                      <p className="text-sm text-muted-foreground mt-2">{flightData.arrivalCity}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscribe Buttons */}
              <div className="flex flex-col sm:flex-row mt-[55px] justify-center w-full ">
                {/* Standard Subscription Button with Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full sm:w-1/2">
                        <Button
                          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2 w-full"
                          onClick={handleSubscribeClick}
                          disabled={isSubscribing || flightData.isSubscribed}
                        >
                          {isSubscribed ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LockIcon className="h-4 w-4" />
                          )}
                          {isSubscribed
                            ? "Securely Subscribed"
                            : isSubscribed
                              ? "Subscribing..."
                              : "Private Subscription"}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Subscribe to standard non-encrypted flight updates</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Right side - Flight Details */}
          <div className="w-full lg:w-1/2 border rounded-lg flex flex-col">
            <div className="bg-muted/30 p-3 border-b flex items-center gap-2 text-primary font-medium">
              <Info className="h-4 w-4" />
              Flight Details
            </div>

            <div className="p-5 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departure Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <MapPin className="h-4 w-4" />
                    Departure Details
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Departure Status:</span>
                      <Badge variant="outline" className={departureStatus.color}>
                        {departureStatus.text}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Scheduled Departure:</span>
                      <span className="font-medium">{formatTime(flightData.scheduledDepartureUTCDateTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Actual Departure:</span>
                      <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md whitespace-nowrap">
                        {formatTime(flightData.actualDepartureUTC)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Terminal:</span>
                      <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md whitespace-nowrap">
                        {flightData.departureTerminal || "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gate:</span>
                      <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                        {flightData.departureGate || "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Boarding Time:</span>
                      <span className="font-medium">{boardingTimeFormatted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Delay:</span>
                      <span
                        className={`font-medium ${
                          (flightData.departureDelayMinutes ?? 0) > 0 ? "text-destructive" : "text-emerald-500"
                        }`}
                      >
                        {(flightData.departureDelayMinutes ?? 0) > 0
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
                      <span className="text-muted-foreground">Arrival Status:</span>
                      <Badge variant="outline" className={arrivalStatus.color}>
                        {arrivalStatus.text}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Scheduled Arrival:</span>
                      <span className="font-medium">{formatTime(flightData.scheduledArrivalUTCDateTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Actual Arrival:</span>
                      <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md whitespace-nowrap">
                        {formatTime(flightData?.actualArrivalUTC || "TBD")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Terminal:</span>
                      <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md whitespace-nowrap">
                        {flightData.arrivalTerminal || "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gate:</span>
                      <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                        {flightData.arrivalGate || "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Baggage Claim:</span>
                      <span className="font-medium px-2 py-0.5 bg-accent/50 rounded-md">
                        {flightData.baggageClaim || "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Delay:</span>
                      <span
                        className={`font-medium ${
                          (flightData.arrivalDelayMinutes ?? 0) > 0 ? "text-destructive" : "text-emerald-500"
                        }`}
                      >
                        {(flightData.arrivalDelayMinutes ?? 0) > 0
                          ? `${flightData.arrivalDelayMinutes} minutes`
                          : "On time"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Codeshare Details section */}
              <div className="mt-6">
                <h3 className="font-semibold flex items-center gap-2 text-primary mb-3">
                  <AlertCircle className="h-4 w-4" />
                  Codeshare Airline Details
                </h3>
                <div className="bg-muted/20 border border-border rounded-lg">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-2 text-left">Codeshare</th>
                        <th className="border border-border p-2 text-left">Flight Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flightData.marketedFlightSegment && flightData.marketedFlightSegment.length > 0 ? (
                        flightData.marketedFlightSegment.map((segment, index) => (
                          <tr key={index} className="hover:bg-muted/30">
                            <td className="border border-border p-2">{segment.MarketingAirlineCode || "TBD"}</td>
                            <td className="border border-border p-2">{segment.FlightNumber || "TBD"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-muted/30">
                          <td colSpan={2} className="border border-border p-2 text-center">
                            No codeshare flight segments available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Standard Subscription Confirmation Dialog */}
      <Dialog open={isStandardDialogOpen} onOpenChange={setIsStandardDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Confirm Standard Subscription
            </DialogTitle>
            <DialogDescription>
              You are about to subscribe to standard flight updates for {flightData.carrierCode}{" "}
              {flightData.flightNumber}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <h4 className="font-medium text-sm mb-2">Subscription Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Flight:</span>
                <span>
                  {flightData.carrierCode} {flightData.flightNumber}
                </span>
                <span className="text-muted-foreground">Route:</span>
                <span>
                  {flightData.departureAirport} → {flightData.arrivalAirport}
                </span>
                <span className="text-muted-foreground">Date:</span>
                <span>{formatDate(flightData.scheduledDepartureDate)}</span>
                <span className="text-muted-foreground">Departure:</span>
                <span>{departureTime}</span>
                <span className="text-muted-foreground">Arrival:</span>
                <span>{arrivalTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium text-sm">Standard Subscription Features</h4>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground pl-7 list-disc">
                <li>Non-encrypted flight notifications</li>
                <li>Basic flight status information</li>
                <li>Regular update frequency</li>
                <li>Lower blockchain gas costs</li>
                <li>Updates visible to network participants</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                By subscribing, you agree to receive flight updates through the blockchain network. Standard
                subscriptions are not encrypted and may be visible to other network participants.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsStandardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubscribe} disabled={isSubscribing}>
              {isSubscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Confirm Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secure Subscription Confirmation Dialog */}
      <Dialog open={isSecureDialogOpen} onOpenChange={setIsSecureDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockIcon className="h-5 w-5" />
              Confirm Secure Subscription
            </DialogTitle>
            <DialogDescription>
              You are about to subscribe to secure encrypted flight updates for {flightData.carrierCode}{" "}
              {flightData.flightNumber}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <h4 className="font-medium text-sm mb-2">Subscription Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Flight:</span>
                <span>
                  {flightData.carrierCode} {flightData.flightNumber}
                </span>
                <span className="text-muted-foreground">Route:</span>
                <span>
                  {flightData.departureAirport} → {flightData.arrivalAirport}
                </span>
                <span className="text-muted-foreground">Date:</span>
                <span>{formatDate(flightData.scheduledDepartureDate)}</span>
                <span className="text-muted-foreground">Departure:</span>
                <span>{departureTime}</span>
                <span className="text-muted-foreground">Arrival:</span>
                <span>{arrivalTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <h4 className="font-medium text-sm">Secure Subscription Features</h4>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground pl-7 list-disc">
                <li>End-to-end encrypted updates</li>
                <li>Access to sensitive flight information</li>
                <li>Real-time secure notifications</li>
                <li>Blockchain-verified data integrity</li>
                <li>Enhanced privacy protection</li>
              </ul>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-md border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Secure subscriptions use encryption to protect your flight data. Only you will be able to decrypt and
                view the detailed flight information. This subscription type requires slightly higher gas fees due to
                the encryption overhead.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSecureDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSecureSubscribe}
              disabled={isSecureSubscribing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSecureSubscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Confirm Secure Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
