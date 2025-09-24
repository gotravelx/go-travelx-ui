"use client";

import { useState, useEffect, Fragment } from "react";
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
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FlightStatusView from "@/components/flight-status-view";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";
import { mapArrivalStateCodeToText } from "@/utils/common";
import { FlightData } from "@/types/flight";

interface FlightDataTableProps {
  flights: FlightData[];
  isLoading?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function ViewFlightDatTable({
  flights,
  isLoading = false,
  currentPage = 1,
  itemsPerPage = 5,
  totalItems = 0,
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
}: FlightDataTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);

  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setLocalItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  const totalPages = Math.ceil(totalItems / localItemsPerPage);

  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
    onPageChange(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number.parseInt(value, 10);
    setLocalItemsPerPage(newItemsPerPage);
    onItemsPerPageChange(newItemsPerPage);
  };

  const startIndex = (localCurrentPage - 1) * localItemsPerPage;
  const endIndex = Math.min(startIndex + localItemsPerPage, totalItems);
  const paginatedFlights = flights.slice(startIndex, endIndex);

  const toggleRow = (flightNumber: string) => {
    setExpandedRow(expandedRow === flightNumber ? null : flightNumber);
  };

  const openFlightDetails = (flight: FlightData) => {
    setSelectedFlight(flight);
    setIsDialogOpen(true);
  };

  const getStatusBadgeColor = (flight: any) => {
    if (flight.isCanceled) return "bg-red-500/20 text-red-500";
    if ((flight.departureDelayMinutes ?? 0) > 0)
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
    if (flight.isCanceled) return "CNCL";
    if ((flight.departureDelayMinutes ?? 0) > 0)
      return `DELAYED ${flight.departureDelayMinutes} min`;

    // Use currentFlightStatus if available, otherwise use statusCode
    if (flight.currentFlightStatus) {
      return flight.currentFlightStatus.toUpperCase();
    }

    switch (flight.statusCode) {
      case "ndpt":
        return "NDPT";
      case "out":
        return "OUT";
      case "off":
        return "OFF";
      case "on":
        return "ON";
      case "in":
        return "IN";
      default:
        return "UNKNOWN";
    }
  };

  const copyTxHash = async (hash: string) => {
    if (!hash) return;

    await navigator.clipboard.writeText(hash);
    toast.success("Transaction hash copied to clipboard");
  };

  const formatTxHash = (hash: string) => {
    if (!hash) return "N/A";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
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

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 items-center">
        <div className="border-b-2 border-primary h-12 rounded-full w-12 animate-spin" role="status"
  aria-label="Loading flights"
  data-testid="loading-text"></div>
      </div>
    );
  }

  const columnDescriptions = {
    "Txn DTM": "Timestamp of when the transaction was recorded (in UTC/GMT)",
    "Transaction ID":
      "Unique transaction hash (likely from a blockchain ledger)",
    Carrier: "Airline code (e.g., UA for United Airlines)",
    "Flt Nbr": "Flight number",
    From: "Departure airport code and city",
    "Departure State": "U.S. state or region of the departure city",
    To: "Arrival airport code and city",
    "Arrival State": "U.S. state or region of the arrival city",
    "Flight Status": "Flight status in text format (e.g., Departed)",
    "Flight Status Cd":
      "Abbreviated flight status (OUT = Departed, IN = Arrived, NDPT = Not Departed)",
    "Dep Gate": "Assigned departure gate at the airport",
    "Arr Gate": "Assigned arrival gate at the airport",
    "Departure DateTime": "Scheduled departure date and time (in UTC/GMT)",
    "Arrival DateTime": "Scheduled arrival date and time (in UTC/GMT)",
    "Est Dep DTM": "Estimated departure date and time based on current data",
    "Est Arr DTM": "Estimated arrival date and time based on current data",
    "Actual Dep DTM": "Actual time the flight departed (when it left the gate)",
    "Actual Arr DTM":
      "Actual time the flight arrived (when it reached the gate)",
    Bagclaim: "Baggage claim carousel/area for the arriving flight",
    Action: "Options to process flight data",
    "Sch Dep Dt": "Scheduled departure date (in UTC/GMT)",
    Flight: "Carrier code and flight number eg. UA 1234",
  };

  const renderTableHeaderWithTooltip = (
    label: keyof typeof columnDescriptions
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer flex items-center">{label}</div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>{columnDescriptions[label] || "No description available"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // const arrivalStatus = getStatusDisplay(
  //   flightData.arrivalState || "ONT",
  //   true
  // );


  return (
    <>
      <div className="bg-card border border-border rounded-lg w-full overflow-hidden">
        <Table data-testid="flight-table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="hidden md:table-cell">
                {renderTableHeaderWithTooltip("Transaction ID")}
              </TableHead>

              <TableHead>{renderTableHeaderWithTooltip("Flight")}</TableHead>
              <TableHead className="whitespace-nowrap">
                {renderTableHeaderWithTooltip("From")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {renderTableHeaderWithTooltip("To")}
              </TableHead>
              <TableHead className="hidden md:table-cell">
                {renderTableHeaderWithTooltip("Departure DateTime")}
              </TableHead>

              <TableHead>
                {renderTableHeaderWithTooltip("Departure State")}
              </TableHead>

              <TableHead className="hidden md:table-cell">
                {renderTableHeaderWithTooltip("Arrival DateTime")}
              </TableHead>

              <TableHead>
                {renderTableHeaderWithTooltip("Arrival State")}
              </TableHead>
              <TableHead>
                {renderTableHeaderWithTooltip("Flight Status")}
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFlights.length > 0 ? (
              paginatedFlights.map((flight) => (
                <>
                  <TableRow
                    key={`${flight.flightNumber}-${flight.scheduledDepartureDate}`}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="hidden md:table-cell">
                      {flight.blockchainTxHash ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">
                                  {formatTxHash(flight.blockchainTxHash)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyTxHash(flight.blockchainTxHash || "");
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <a
                                  href={`https://columbus.caminoscan.com/tx/${flight.blockchainTxHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                  title="View transaction on Caminoscan"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Blockchain Transaction Hash</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          N/A
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      <div className="flex gap-2 items-center">
                        <Plane className="h-4 text-primary w-4" />
                        {flight.carrierCode} {flight.flightNumber}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <span className="font-medium">
                          {flight?.departureCity} ({flight?.departureAirport})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <span className="font-medium">
                          {flight?.arrivalCity} ({flight?.arrivalAirport})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div className="flex gap-2 items-center">
                        <Calendar className="h-4 text-muted-foreground w-4" />
                        {formatDate(flight?.scheduledDepartureUTCDateTime)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <Badge className="py-2 ">
                          {mapArrivalStateCodeToText(
                            flight?.departureState || ""
                          )}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div className="flex gap-2 items-center">
                        <Calendar className="h-4 text-muted-foreground w-4" />
                        {formatDate(flight?.scheduledArrivalUTCDateTime)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <Badge className="py-2 ">
                          {" "}
                          {mapArrivalStateCodeToText(
                            flight?.arrivalState || ""
                          )}
                        </Badge>
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
                      <TableCell colSpan={10} className="bg-muted/20 p-0">
                        <div className="p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">
                                Departure
                              </h4>
                              <div className="grid grid-cols-2 text-sm gap-2">
                                <div className="text-muted-foreground">
                                  Airport:
                                </div>
                                <div>{flight.departureAirport || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  City:
                                </div>
                                <div>{flight.departureCity || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  Terminal:
                                </div>
                                <div>{flight.departureTerminal || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  Gate:
                                </div>
                                <div>{flight.departureGate || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  Scheduled:
                                </div>
                                <div>
                                  {formatTime(
                                    flight.scheduledDepartureUTCDateTime
                                  ) || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Status:
                                </div>
                                <div>{flight.departureState || "TBD"}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Arrival</h4>
                              <div className="grid grid-cols-2 text-sm gap-2">
                                <div className="text-muted-foreground">
                                  Airport:
                                </div>
                                <div>{flight.arrivalAirport || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  City:
                                </div>
                                <div>{flight.arrivalCity || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  Terminal:
                                </div>
                                <div>{flight.arrivalTerminal || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  Gate:
                                </div>
                                <div>{flight.arrivalGate || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  Scheduled:
                                </div>
                                <div>
                                  {formatTime(
                                    flight.scheduledArrivalUTCDateTime
                                  ) || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Status:
                                </div>
                                <div>{flight.arrivalState || "TBD"}</div>
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
                                <div>{flight.operatingAirline || "TBD"}</div>
                                <div className="text-muted-foreground">
                                  Aircraft:
                                </div>
                                <div>{flight.equipmentModel || "TBD"}</div>
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
                                <div>{flight?.arrivalState || "TBD"}</div>
                                {flight.marketedFlightSegment &&
                                  flight.marketedFlightSegment.length > 0 && (
                                    <>
                                      <div className="text-muted-foreground col-span-2 mt-2 font-semibold">
                                        Codeshare Details:
                                      </div>
                                      {flight.marketedFlightSegment.map(
                                        (segment, idx) => (
                                          <Fragment key={idx}>
                                            <div className="text-muted-foreground pl-2">
                                              Airline:
                                            </div>
                                            <div>
                                              {segment.MarketingAirlineCode ||
                                                "TBD"}{" "}
                                              {segment.FlightNumber || "TBD"}
                                            </div>
                                          </Fragment>
                                        )
                                      )}
                                    </>
                                  )}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No flights found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {totalPages > 0 && (
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
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
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
                        if (localCurrentPage > 1) {
                          handlePageChange(Math.max(localCurrentPage - 1, 1));
                        }
                      }}
                      className="bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
                    />
                  </PaginationItem>
                  {/* Page numbers */}
                  <PaginationItem>
                    <PaginationLink
                      className={
                        "bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
                      }
                    >
                      {localCurrentPage}
                    </PaginationLink>
                  </PaginationItem>
                  {/* Next page button */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (localCurrentPage < totalPages) {
                          handlePageChange(
                            Math.min(localCurrentPage + 1, totalPages)
                          );
                        }
                      }}
                      className="bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
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
            </div>
          </div>
        </div>
      )}

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
