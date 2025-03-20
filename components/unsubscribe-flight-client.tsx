"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWeb3 } from "@/contexts/web3-context";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import UnSubscribeDataTable from "./unsubscribe-flight-data-table";

// Import from the second file
import type { FlightData } from "@/services/api";

// Dummy flight data from the second file
const SubscribedFlights: FlightData[] = [
  {
    flightNumber: "5300",
    departureDate: "2025-03-06",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-06T15:30:00Z",
    estimatedDepartureUTC: "2025-03-06T12:00:00Z",
    arrivalAirport: "LAS",
    departureAirport: "IAH",
    arrivalCity: "Las Vegas",
    departureCity: "Houston",
    departureGate: "C12",
    arrivalGate: "B8",
    flightStatus: "On Time",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-800",
    phase: "not_departed",
    departureTerminal: "C",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "4",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-06T11:30:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-06T15:30:00Z",
    scheduledDepartureUTCDateTime: "2025-03-06T12:00:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "2339",
    departureDate: "2025-03-07",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-07T22:15:00Z",
    estimatedDepartureUTC: "2025-03-07T19:45:00Z",
    arrivalAirport: "ORD",
    departureAirport: "LAS",
    arrivalCity: "Chicago",
    departureCity: "Las Vegas",
    departureGate: "B10",
    arrivalGate: "C22",
    flightStatus: "Delayed",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-900",
    phase: "not_departed",
    departureTerminal: "1",
    arrivalTerminal: "2",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "7",
    departureDelayMinutes: 25,
    arrivalDelayMinutes: 25,
    boardingTime: "2025-03-07T19:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-07T21:50:00Z",
    scheduledDepartureUTCDateTime: "2025-03-07T19:20:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "1422",
    departureDate: "2025-03-08",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-08T14:00:00Z",
    estimatedDepartureUTC: "2025-03-08T12:30:00Z",
    arrivalAirport: "DEN",
    departureAirport: "ORD",
    arrivalCity: "Denver",
    departureCity: "Chicago",
    departureGate: "C15",
    arrivalGate: "A12",
    flightStatus: "Canceled",
    statusCode: "CNCL",
    equipmentModel: "Airbus A320",
    phase: "not_departed",
    departureTerminal: "2",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-08T12:00:00Z",
    isCanceled: true,
    scheduledArrivalUTCDateTime: "2025-03-08T14:00:00Z",
    scheduledDepartureUTCDateTime: "2025-03-08T12:30:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "7891",
    departureDate: "2025-03-09",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-09T10:15:00Z",
    estimatedDepartureUTC: "2025-03-09T07:45:00Z",
    arrivalAirport: "JFK",
    departureAirport: "DEN",
    arrivalCity: "New York",
    departureCity: "Denver",
    departureGate: "A18",
    arrivalGate: "D5",
    flightStatus: "Arrived At Gate",
    statusCode: "ARRV",
    equipmentModel: "Boeing 787-9",
    phase: "arrived",
    departureTerminal: "1",
    arrivalTerminal: "4",
    actualDepartureUTC: "2025-03-09T07:50:00Z",
    actualArrivalUTC: "2025-03-09T10:10:00Z",
    baggageClaim: "12",
    departureDelayMinutes: 5,
    arrivalDelayMinutes: -5,
    boardingTime: "2025-03-09T07:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-09T10:15:00Z",
    scheduledDepartureUTCDateTime: "2025-03-09T07:45:00Z",
    outTimeUTC: "2025-03-09T07:40:00Z",
    offTimeUTC: "2025-03-09T07:50:00Z",
    onTimeUTC: "2025-03-09T10:05:00Z",
    inTimeUTC: "2025-03-09T10:10:00Z",
  },
  {
    flightNumber: "5301",
    departureDate: "2025-03-06",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-06T15:30:00Z",
    estimatedDepartureUTC: "2025-03-06T12:00:00Z",
    arrivalAirport: "LAS",
    departureAirport: "IAH",
    arrivalCity: "Las Vegas",
    departureCity: "Houston",
    departureGate: "C12",
    arrivalGate: "B8",
    flightStatus: "On Time",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-800",
    phase: "not_departed",
    departureTerminal: "C",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "4",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-06T11:30:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-06T15:30:00Z",
    scheduledDepartureUTCDateTime: "2025-03-06T12:00:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "2340",
    departureDate: "2025-03-07",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-07T22:15:00Z",
    estimatedDepartureUTC: "2025-03-07T19:45:00Z",
    arrivalAirport: "ORD",
    departureAirport: "LAS",
    arrivalCity: "Chicago",
    departureCity: "Las Vegas",
    departureGate: "B10",
    arrivalGate: "C22",
    flightStatus: "Delayed",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-900",
    phase: "not_departed",
    departureTerminal: "1",
    arrivalTerminal: "2",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "7",
    departureDelayMinutes: 25,
    arrivalDelayMinutes: 25,
    boardingTime: "2025-03-07T19:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-07T21:50:00Z",
    scheduledDepartureUTCDateTime: "2025-03-07T19:20:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "1423",
    departureDate: "2025-03-08",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-08T14:00:00Z",
    estimatedDepartureUTC: "2025-03-08T12:30:00Z",
    arrivalAirport: "DEN",
    departureAirport: "ORD",
    arrivalCity: "Denver",
    departureCity: "Chicago",
    departureGate: "C15",
    arrivalGate: "A12",
    flightStatus: "Canceled",
    statusCode: "CNCL",
    equipmentModel: "Airbus A320",
    phase: "not_departed",
    departureTerminal: "2",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-08T12:00:00Z",
    isCanceled: true,
    scheduledArrivalUTCDateTime: "2025-03-08T14:00:00Z",
    scheduledDepartureUTCDateTime: "2025-03-08T12:30:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "7892",
    departureDate: "2025-03-09",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-09T10:15:00Z",
    estimatedDepartureUTC: "2025-03-09T07:45:00Z",
    arrivalAirport: "JFK",
    departureAirport: "DEN",
    arrivalCity: "New York",
    departureCity: "Denver",
    departureGate: "A18",
    arrivalGate: "D5",
    flightStatus: "Arrived At Gate",
    statusCode: "ARRV",
    equipmentModel: "Boeing 787-9",
    phase: "arrived",
    departureTerminal: "1",
    arrivalTerminal: "4",
    actualDepartureUTC: "2025-03-09T07:50:00Z",
    actualArrivalUTC: "2025-03-09T10:10:00Z",
    baggageClaim: "12",
    departureDelayMinutes: 5,
    arrivalDelayMinutes: -5,
    boardingTime: "2025-03-09T07:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-09T10:15:00Z",
    scheduledDepartureUTCDateTime: "2025-03-09T07:45:00Z",
    outTimeUTC: "2025-03-09T07:40:00Z",
    offTimeUTC: "2025-03-09T07:50:00Z",
    onTimeUTC: "2025-03-09T10:05:00Z",
    inTimeUTC: "2025-03-09T10:10:00Z",
  },
];

export default function UnsubscribeFlightClient() {
  const { isLoading } = useWeb3();

  // State for flights and filtering
  const [subscribedFlights, setSubscribedFlights] =
    useState<FlightData[]>(SubscribedFlights);
  const [filteredFlights, setFilteredFlights] =
    useState<FlightData[]>(SubscribedFlights);
  const [isUnsubscribing, setIsUnsubscribing] = useState<
    Record<string, boolean>
  >({});
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage, setFlightsPerPage] = useState(5);

  // Search filters state
  const [flightNumber, setFlightNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchError, setSearchError] = useState("");
  const [carrier, setCarrier] = useState("UA");
  const [departureStation, setDepartureStation] = useState("JFK");
  const [arrivalStation, setArrivalStation] = useState("ORD");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Handlers for filter changes
  const handleFlightNumberChange = useCallback((value: string) => {
    setFlightNumber(value);
  }, []);

  const handleCarrierChange = useCallback((value: string) => {
    setCarrier(value);
  }, []);

  const handleDepartureStationChange = useCallback((value: string) => {
    setDepartureStation(value);
  }, []);

  const handleArrivalStationChange = useCallback((value: string) => {
    setArrivalStation(value);
  }, []);

  const onFlightNumberChange = useCallback((value: string) => {
    setFlightNumber(value);
  }, []);

  const onDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Search function
  const onSearch = useCallback(() => {
    setIsSearching(true);
    setSearchError("");

    // Validate flight number
    if (flightNumber && !/^\d+$/.test(flightNumber)) {
      setSearchError("Flight number must contain only digits");
      setIsSearching(false);
      return;
    }

    // Filter flights based on search criteria
    const results = subscribedFlights.filter((flight) => {
      // Match carrier
      if (carrier && flight.carrierCode !== carrier) {
        return false;
      }

      // Match flight number if provided
      if (flightNumber && flight.flightNumber !== flightNumber) {
        return false;
      }

      // Match departure station
      if (departureStation && flight.departureAirport !== departureStation) {
        return false;
      }

      // Match arrival station
      if (arrivalStation && flight.arrivalAirport !== arrivalStation) {
        return false;
      }

      // Match date if selected (only check if it's the same day)
      if (selectedDate) {
        const flightDate = new Date(flight.departureDate);
        const searchDate = new Date(selectedDate);

        if (
          flightDate.getFullYear() !== searchDate.getFullYear() ||
          flightDate.getMonth() !== searchDate.getMonth() ||
          flightDate.getDate() !== searchDate.getDate()
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredFlights(results);
    setCurrentPage(1); // Reset to first page after search

    // Show success toast
    toast.success("Search completed successfully");
    setIsSearching(false);
  }, [
    flightNumber,
    carrier,
    departureStation,
    arrivalStation,
    selectedDate,
    subscribedFlights,
  ]);

  // Reset to first page when rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [flightsPerPage]);

  // Calculate pagination
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );
  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* search functionality start*/}
          <Card>
            <CardHeader>
              <CardTitle>UnSubscription Flight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full mx-auto">
                <style jsx global>{`
                  .form-input-enhanced ::placeholder {
                    color: rgba(115, 115, 115, 0.8);
                    font-weight: 500;
                  }
                `}</style>
                <div className="flex flex-col form-input-enhanced w-full gap-4 md:flex-row">
                  <div className="flex flex-col w-full md:w-auto">
                    <label
                      htmlFor="carrier-select"
                      className="text-sm font-medium mb-1"
                    >
                      Carrier
                    </label>
                    <Select value={carrier} onValueChange={handleCarrierChange}>
                      <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus:border-primary md:w-[120px]">
                        <SelectValue placeholder="Carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UA">UA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-3 flex-col">
                    <label
                      htmlFor="flight-number"
                      className="text-sm font-medium mb-1"
                    >
                      Flight Number
                    </label>
                    <Input
                      id="flight-number"
                      placeholder="Enter flight number..."
                      value={flightNumber}
                      onChange={(e) => onFlightNumberChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && onSearch()}
                      disabled={isSearching}
                      className="bg-background/90 border-2 border-primary/50 shadow-sm w-48 focus-visible:border-primary"
                    />
                  </div>

                  <div className="flex flex-5 flex-col justify-center items-center">
                    <div className="pt-4">and/or </div>
                  </div>

                  <div className="flex flex-col w-full md:w-auto">
                    <label
                      htmlFor="departure-station"
                      className="text-sm font-medium mb-1"
                    >
                      Departure Station
                    </label>
                    <Select
                      value={departureStation}
                      onValueChange={handleDepartureStationChange}
                    >
                      <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus:border-primary md:w-[120px]">
                        <SelectValue placeholder="Departure Station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LAX">LAX</SelectItem>
                        <SelectItem value="SFO">SFO</SelectItem>
                        <SelectItem value="DEN">DEN</SelectItem>
                        <SelectItem value="MIA">MIA</SelectItem>
                        <SelectItem value="JFK">JFK</SelectItem>
                        <SelectItem value="ORD">ORD</SelectItem>
                        <SelectItem value="PHX">PHX</SelectItem>
                        <SelectItem value="SAN">SAN</SelectItem>
                        <SelectItem value="IAH">IAH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col w-full md:w-auto">
                    <label
                      htmlFor="arrival-station"
                      className="text-sm font-medium mb-1"
                    >
                      Arrival Station
                    </label>
                    <Select
                      value={arrivalStation}
                      onValueChange={handleArrivalStationChange}
                    >
                      <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus:border-primary md:w-[120px]">
                        <SelectValue placeholder="Arrival Station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LAX">LAX</SelectItem>
                        <SelectItem value="SFO">SFO</SelectItem>
                        <SelectItem value="DEN">DEN</SelectItem>
                        <SelectItem value="MIA">MIA</SelectItem>
                        <SelectItem value="JFK">JFK</SelectItem>
                        <SelectItem value="ORD">ORD</SelectItem>
                        <SelectItem value="PHX">PHX</SelectItem>
                        <SelectItem value="SAN">SAN</SelectItem>
                        <SelectItem value="LAS">LAS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col w-full md:w-auto">
                    <label className="text-sm font-medium mb-1">
                      Scheduled Departure Date
                    </label>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-background/90 border-2 border-primary/50 justify-start shadow-sm w-full hover:border-primary md:w-auto"
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {selectedDate
                            ? format(selectedDate, "PPP")
                            : format(new Date(), "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(selectedDate) => {
                            if (selectedDate) {
                              onDateChange(selectedDate);
                            }
                            setIsCalendarOpen(false);
                          }}
                          disabled={(d) =>
                            d > new Date() || d < new Date("2023-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col justify-end mt-auto">
                    <Button
                      onClick={onSearch}
                      className="h-10 w-full gradient-border md:w-auto"
                      disabled={isSearching}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>

                {searchError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{searchError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="mt-8">
                {/* Pass pagination props to the data table */}
                <UnSubscribeDataTable
                  flights={currentFlights}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  itemsPerPage={flightsPerPage}
                  totalItems={filteredFlights.length}
                />
              </div>
            </CardContent>
            <CardFooter>
              {/* Pagination controls */}
              <div className="flex justify-between w-full items-center">
                <div className="text-muted-foreground text-sm">
                  Showing{" "}
                  {filteredFlights.length === 0 ? 0 : indexOfFirstFlight + 1}-
                  {Math.min(indexOfLastFlight, filteredFlights.length)} of{" "}
                  {filteredFlights.length} flights
                </div>

                <div className="flex justify-end gap-4 items-center">
                  <Select
                    value={flightsPerPage.toString()}
                    onValueChange={(value) =>
                      setFlightsPerPage(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-[80px] focus:border-primary">
                      <SelectValue placeholder="10" />
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
                                setCurrentPage(1);
                              }}
                              disabled={currentPage === 1}
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
                                setCurrentPage((prev) => Math.max(prev - 1, 1));
                              }}
                              className="bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
                              disabled={currentPage === 1}
                            />
                          </PaginationItem>

                          {/* Current page indicator */}
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
                                setCurrentPage((prev) =>
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
                                setCurrentPage(totalPages);
                              }}
                              disabled={currentPage === totalPages}
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
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
