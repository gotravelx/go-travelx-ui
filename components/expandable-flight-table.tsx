"use client"

import React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Plane, Calendar, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { FlightData } from "@/types/flight"

interface ExpandableFlightTableProps {
  flights?: FlightData[]
  isLoading?: boolean
}

export default function ExpandableFlightTable({ flights = [], isLoading = false }: ExpandableFlightTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (flightNumber: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [flightNumber]: !prev[flightNumber],
    }))
  }

  const getStatusBadgeColor = (flight: FlightData) => {
    if (flight.isCanceled) return "bg-red-500/20 text-red-500"
    if (flight.departureDelayMinutes ?? 0 > 0) return "bg-yellow-500/20 text-yellow-500"

    switch (flight.statusCode) {
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
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const getStatusText = (flight: FlightData) => {
    if (flight.isCanceled) return "Canceled"
    if (flight.departureDelayMinutes ?? 0 > 0) return `Delayed ${flight.departureDelayMinutes} min`

    switch (flight.statusCode) {
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
      default:
        return "Unknown"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (error) {
      return "Invalid date"
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date)
    } catch (error) {
      return "Invalid time"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"  role="status"
  aria-label="loading"></div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Flight</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Route</TableHead>
            <TableHead className="hidden md:table-cell">Departure</TableHead>
            <TableHead className="hidden lg:table-cell">Arrival</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights?.map((flight) => (
            <React.Fragment key={flight.flightNumber}>
              <TableRow
                key={flight.flightNumber}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleRow(flight.flightNumber)}
              >
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    {expandedRows[flight.flightNumber] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-primary" />
                    {flight.carrierCode} {flight.flightNumber}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(flight.scheduledDepartureUTCDateTime)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{flight.departureAirport}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{flight.arrivalAirport}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatTime(flight.scheduledDepartureUTCDateTime)}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatTime(flight.scheduledArrivalUTCDateTime)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`p-2 px-4 text-md ${getStatusBadgeColor(flight)}`}>
                    {getStatusText(flight)}
                  </Badge>
                </TableCell>
              </TableRow>
              <AnimatePresence>
                {expandedRows[flight.flightNumber] && (
                  <TableRow key={`${flight.flightNumber}-expanded`}>
                    <TableCell colSpan={7} className="p-0">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="m-2 border-0 shadow-none">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Flight Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="text-muted-foreground">Carrier:</div>
                                  <div>{flight.operatingAirline}</div>
                                  <div className="text-muted-foreground">Aircraft:</div>
                                  <div>{flight.equipmentModel}</div>
                                  <div className="text-muted-foreground">Flight Number:</div>
                                  <div>
                                    {flight.carrierCode} {flight.flightNumber}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Departure</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="text-muted-foreground">City:</div>
                                  <div>{flight.departureCity}</div>
                                  <div className="text-muted-foreground">Airport:</div>
                                  <div>{flight.departureAirport}</div>
                                  <div className="text-muted-foreground">Terminal:</div>
                                  <div>{flight.departureTerminal || "N/A"}</div>
                                  <div className="text-muted-foreground">Gate:</div>
                                  <div>{flight.departureGate || "N/A"}</div>
                                  <div className="text-muted-foreground">Scheduled:</div>
                                  <div>{formatTime(flight.scheduledDepartureUTCDateTime)}</div>
                                  <div className="text-muted-foreground">Estimated:</div>
                                  <div>{formatTime(flight.estimatedDepartureUTC)}</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Arrival</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="text-muted-foreground">City:</div>
                                  <div>{flight.arrivalCity}</div>
                                  <div className="text-muted-foreground">Airport:</div>
                                  <div>{flight.arrivalAirport}</div>
                                  <div className="text-muted-foreground">Terminal:</div>
                                  <div>{flight.arrivalTerminal || "N/A"}</div>
                                  <div className="text-muted-foreground">Gate:</div>
                                  <div>{flight.arrivalGate || "N/A"}</div>
                                  <div className="text-muted-foreground">Scheduled:</div>
                                  <div>{formatTime(flight.scheduledArrivalUTCDateTime)}</div>
                                  <div className="text-muted-foreground">Estimated:</div>
                                  <div>{formatTime(flight.estimatedArrivalUTC)}</div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Here you would navigate to the detailed flight view
                                  window.location.href = `/view-flight?carrier=${
                                    flight.carrierCode
                                  }&flight=${flight.flightNumber}&date=${
                                    formatDate(flight.scheduledDepartureUTCDateTime) || "N/A"
                                  }`
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
