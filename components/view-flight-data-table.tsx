"use client";

import { useState, useEffect } from "react";
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
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FlightStatusView from "@/components/flight-status-view";
import type { FlightData } from "@/services/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import flights from "@/utils/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { CardContent } from "./ui/card";
import { toast } from "sonner";

// Dummy flight data for initial display
const dummyFlights: FlightData[] = flights;

interface FlightDataTableProps {
  flights?: FlightData[];
  isLoading?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function ViewFlightDatTable({
  flights = dummyFlights,
  isLoading = false,
  currentPage = 1,
  itemsPerPage = 5,
  totalItems = dummyFlights.length,
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
}: FlightDataTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Add pagination state
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);

  // Update local state when props change
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setLocalItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / localItemsPerPage);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
    onPageChange(page);
  };

  // Handle items per page changes
  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number.parseInt(value, 10);
    setLocalItemsPerPage(newItemsPerPage);
    onItemsPerPageChange(newItemsPerPage);
  };

  const startIndex = (localCurrentPage - 1) * localItemsPerPage;
  const endIndex = startIndex + localItemsPerPage;
  const paginatedFlights = flights.slice(startIndex, endIndex);

  const toggleRow = (flightNumber: string) => {
    setExpandedRow(expandedRow === flightNumber ? null : flightNumber);
  };

  const openFlightDetails = (flight: FlightData) => {
    setSelectedFlight(flight);
    setIsDialogOpen(true);
  };

  const getStatusBadgeColor = (flight: FlightData) => {
    if (flight.isCanceled) return "bg-red-500/20 text-red-500";
    if (flight.departureDelayMinutes > 0)
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
    if (flight.departureDelayMinutes > 0)
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

  const copyAddress = async () => {
    await navigator.clipboard.writeText(
      "0x70c8a24de705c1d62601376974669863bb21cd6a35ef7127a5d130f44a10a469"
    );
    toast.success("transactions copied to clipboard");
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
              <TableHead>Transaction Id</TableHead>
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardContent className="flex items-center justify-between p-4 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">
                              {formatAddress(
                                "0x70c8a24de705c1d62601376974669863bb21cd6a35ef7127a5d130f44a10a469"
                              )}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={copyAddress}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Camino Transaction Hash</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openFlightDetails(flight)}
                    >
                      Details
                    </Button>
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
                                  className={`${getStatusBadgeColor(flight)}`}
                                >
                                  {getStatusText(flight)}
                                </Badge>
                              </div>
                              <div className="text-muted-foreground">
                                Delay:
                              </div>
                              <div>
                                {flight.departureDelayMinutes > 0
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
          </TableBody>
          {paginatedFlights.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No flights found
              </TableCell>
            </TableRow>
          )}
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-muted-foreground text-sm">
          Showing{" "}
          {totalItems === 0
            ? 0
            : (localCurrentPage - 1) * localItemsPerPage + 1}
          -{Math.min(localCurrentPage * localItemsPerPage, totalItems)} of{" "}
          {totalItems} flights
        </div>

        <div className="flex justify-end gap-4 items-center">
          <Select
            value={localItemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-[80px] focus:border-primary">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            {totalPages > 0 && (
              <Pagination>
                <PaginationContent>
                  {/* First page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                      disabled={localCurrentPage === 1}
                      className="bg-background/90 border-2 border-primary/50 h-9 shadow-sm w-9 focus:border-primary"
                    >
                      <span className="sr-only">First page</span>
                      <span>«</span>
                    </Button>
                  </PaginationItem>
                  {/* Previous page button */}
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(localCurrentPage - 1, 1));
                      }}
                      className="bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
                      disabled={localCurrentPage === 1}
                    />
                  </PaginationItem>
                  {/* Page numbers */}
                  <PaginationItem>
                    <PaginationLink
                      className={
                        "bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
                      }
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  {/* Next page button */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setLocalCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                      }}
                      className="bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                  {/* Last page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                      disabled={localCurrentPage === totalPages}
                      className="bg-background/90 border-2 border-primary/50 h-9 shadow-sm w-9 focus:border-primary"
                    >
                      <span className="sr-only">Last page</span>
                      <span>»</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
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
    </>
  );
}
