"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Plane,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FlightStatusView from "@/components/flight-status-view";
import type { FlightData } from "@/services/api";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";

interface FlightDataTableProps {
  flights: FlightData[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  selectedFlights: Set<string>;
  onFlightSelect: (flightId: string) => void;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
}

export default function UnSubscribeDataTable({
  flights,
  isLoading,
  currentPage,
  itemsPerPage,
  totalItems,
  selectedFlights,
  onFlightSelect,
  selectAll,
  onSelectAll,
}: FlightDataTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Add a new state for the unsubscribe confirmation dialog
  const [isUnsubscribeDialogOpen, setIsUnsubscribeDialogOpen] = useState(false);
  const [flightToUnsubscribe, setFlightToUnsubscribe] =
    useState<FlightData | null>(null);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  // The flights array is already paginated by the parent component
  const paginatedFlights = flights;

  const toggleRow = (flightNumber: string) => {
    setExpandedRow(expandedRow === flightNumber ? null : flightNumber);
  };

  const openFlightDetails = (flight: FlightData) => {
    setSelectedFlight(flight);
    setIsDialogOpen(true);
  };

  // Add a function to handle the unsubscribe action
  const handleUnsubscribe = (flight: FlightData) => {
    setFlightToUnsubscribe(flight);
    setIsUnsubscribeDialogOpen(true);
  };

  // Add a function to confirm unsubscription
  const confirmUnsubscribe = () => {
    if (flightToUnsubscribe) {
      setIsUnsubscribing(true);

      // Simulate API call with timeout
      setTimeout(() => {
        // Here you would call your API to unsubscribe from the flight
        console.log(
          `Unsubscribed from flight ${flightToUnsubscribe.carrierCode} ${flightToUnsubscribe.flightNumber}`
        );

        // Show success message
        toast.success(
          `Successfully unsubscribed from flight ${flightToUnsubscribe.carrierCode} ${flightToUnsubscribe.flightNumber}`
        );

        // Close the dialog and reset state
        setIsUnsubscribeDialogOpen(false);
        setFlightToUnsubscribe(null);
        setIsUnsubscribing(false);
      }, 1000);
    }
  };

  const getStatusBadgeColor = (flight: FlightData) => {
    if (flight.isCanceled) return "bg-red-500/20 text-red-500";
    if (flight?.departureDelayMinutes ?? 0 > 0)
      return "bg-yellow-500/20 text-yellow-500";

    switch (flight.statusCode) {
      case "NDPT":
        return "bg-blue-500/20 text-blue-500";
      case "OUT":
        return "bg-yellow-500/20 text-yellow-500";
      case "OFF":
        return "bg-blue-500/20 text-blue-500";
      case "ON":
        return "bg-purple-500/20 text-purple-500";
      case "IN":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getStatusText = (flight: FlightData) => {
    if (flight.isCanceled) return "Canceled";
    if (flight.departureDelayMinutes ?? 0 > 0)
      return `Delayed ${flight.departureDelayMinutes} min`;

    switch (flight.statusCode) {
      case "NDPT":
        return "Not Departed";
      case "OUT":
        return "Departed";
      case "OFF":
        return "In Flight";
      case "ON":
        return "Landing";
      case "IN":
        return "Arrived";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      return "Invalid time";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 items-center">
        <div className="border-b-2 border-primary h-12 rounded-full w-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg w-full overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                  aria-label="Select all flights"
                />
              </TableHead>
              <TableHead>Flt</TableHead>
              <TableHead className="hidden md:table-cell">Sch Dep Dt</TableHead>
              <TableHead>Dep Stn</TableHead>
              <TableHead>Arr Stn</TableHead>
              <TableHead className="hidden md:table-cell">
                Est Dep DTM
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Est Arr DTM
              </TableHead>
              <TableHead>Sts</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFlights.map((flight) => (
              <>
                <TableRow
                  key={flight.flightNumber}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedFlights.has(flight.flightNumber)}
                      onCheckedChange={() =>
                        onFlightSelect(flight.flightNumber)
                      }
                      aria-label={`Select flight ${flight.flightNumber}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex gap-2 items-center">
                      <Plane className="h-4 text-primary w-4" />
                      {flight.carrierCode} {flight.flightNumber}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex gap-2 items-center">
                      <Calendar className="h-4 text-muted-foreground w-4" />
                      {flight.departureDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <span className="font-medium">
                        {flight.departureAirport}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <span className="font-medium">
                        {flight.arrivalAirport}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex gap-2 items-center">
                      <Clock className="h-4 text-muted-foreground w-4" />
                      {flight.estimatedDepartureUTC}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-2 items-center">
                      <Clock className="h-4 text-muted-foreground w-4" />
                      {flight.estimatedArrivalUTC}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusBadgeColor(
                        flight
                      )} p-2 px-4 text-md`}
                    >
                      {getStatusText(flight)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnsubscribe(flight)}
                      >
                        Unsubscribe
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 p-0 w-8"
                      onClick={() => toggleRow(flight.flightNumber)}
                    >
                      {expandedRow === flight.flightNumber ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === flight.flightNumber && (
                  <TableRow key={`${flight.flightNumber}-expanded`}>
                    <TableCell colSpan={8} className="bg-muted/20 p-0">
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Departure</h4>
                            <div className="grid grid-cols-2 text-sm gap-2">
                              <div className="text-muted-foreground">
                                Airport:
                              </div>
                              <div>{flight.departureAirport}</div>
                              <div className="text-muted-foreground">City:</div>
                              <div>{flight.departureCity}</div>
                              <div className="text-muted-foreground">
                                Terminal:
                              </div>
                              <div>{flight.departureTerminal || "N/A"}</div>
                              <div className="text-muted-foreground">Gate:</div>
                              <div>{flight.departureGate || "N/A"}</div>
                              <div className="text-muted-foreground">
                                Scheduled:
                              </div>
                              <div>
                                {formatTime(
                                  flight.scheduledDepartureUTCDateTime
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Arrival</h4>
                            <div className="grid grid-cols-2 text-sm gap-2">
                              <div className="text-muted-foreground">
                                Airport:
                              </div>
                              <div>{flight.arrivalAirport}</div>
                              <div className="text-muted-foreground">City:</div>
                              <div>{flight.arrivalCity}</div>
                              <div className="text-muted-foreground">
                                Terminal:
                              </div>
                              <div>{flight.arrivalTerminal || "N/A"}</div>
                              <div className="text-muted-foreground">Gate:</div>
                              <div>{flight.arrivalGate || "N/A"}</div>
                              <div className="text-muted-foreground">
                                Scheduled:
                              </div>
                              <div>
                                {formatTime(flight.scheduledArrivalUTCDateTime)}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">
                              Flight Details
                            </h4>
                            <div className="grid grid-cols-2 text-sm gap-2">
                              <div className="text-muted-foreground">
                                Carrier:
                              </div>
                              <div>{flight.operatingAirline}</div>
                              <div className="text-muted-foreground">
                                Aircraft:
                              </div>
                              <div>{flight.equipmentModel}</div>
                              <div className="text-muted-foreground">
                                Status:
                              </div>
                              <div>
                                <Badge
                                  variant="outline"
                                  className={`${getStatusBadgeColor(
                                    flight
                                  )} p-2 px-4 text-md`}
                                >
                                  {getStatusText(flight)}
                                </Badge>
                              </div>
                              <div className="text-muted-foreground">
                                Delay:
                              </div>
                              <div>
                                {flight?.departureDelayMinutes ?? 0 > 0
                                  ? `${flight.departureDelayMinutes} minutes`
                                  : "None"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={() => openFlightDetails(flight)}
                            className="gradient-border"
                          >
                            View Full Details
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
            {paginatedFlights.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No flights found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Flight Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <Plane className="h-5 w-5" />
              Flight {selectedFlight?.carrierCode}{" "}
              {selectedFlight?.flightNumber} Status
            </DialogTitle>
          </DialogHeader>
          {selectedFlight && <FlightStatusView flightData={selectedFlight} />}
        </DialogContent>
      </Dialog>

      {/* Unsubscribe Confirmation Dialog */}
      <Dialog
        open={isUnsubscribeDialogOpen}
        onOpenChange={setIsUnsubscribeDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Unsubscription</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to unsubscribe from flight{" "}
              {flightToUnsubscribe?.carrierCode}{" "}
              {flightToUnsubscribe?.flightNumber}?
            </p>
            <p className="text-muted-foreground mt-2">
              {flightToUnsubscribe?.departureAirport} →{" "}
              {flightToUnsubscribe?.arrivalAirport} on{" "}
              {formatDate(flightToUnsubscribe?.departureDate || "")}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUnsubscribeDialogOpen(false)}
              disabled={isUnsubscribing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmUnsubscribe}
              disabled={isUnsubscribing}
            >
              {isUnsubscribing ? "Unsubscribing..." : "Unsubscribe"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
