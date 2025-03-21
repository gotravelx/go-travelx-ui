import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, AlertCircle, Plane } from "lucide-react";
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
import flights from "@/utils/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const airports = [
  { code: "JFK", name: "John F. Kennedy International Airport" },
  { code: "ORD", name: "O'Hare International Airport" },
  { code: "LAX", name: "Los Angeles International Airport" },
  { code: "SFO", name: "San Francisco International Airport" },
  { code: "DEN", name: "Denver International Airport" },
  { code: "MIA", name: "Miami International Airport" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport" },
  { code: "SAN", name: "San Diego International Airport" },
];

// Dummy flight data from the second file
const SubscribedFlights = flights;

export default function UnsubscribeFlightClient() {
  const { isLoading } = useWeb3();
  const [isUnsubscribeDialogOpen, setIsUnsubscribeDialogOpen] = useState(false);
  const [subscribedFlights, setSubscribedFlights] =
    useState<FlightData[]>(SubscribedFlights);
  const [filteredFlights, setFilteredFlights] =
    useState<FlightData[]>(SubscribedFlights);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false); // Simplified loading state
  const [error, setError] = useState<string | null>(null);
  const [selectedFlights, setSelectedFlights] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage, setFlightsPerPage] = useState(5);
  const [flightNumber, setFlightNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchError, setSearchError] = useState("");
  const [carrier, setCarrier] = useState("UA");
  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [departureResults, setDepartureResults] = useState(airports);
  const [arrivalResults, setArrivalResults] = useState(airports);
  const [showDepartureResults, setShowDepartureResults] = useState(false);
  const [showArrivalResults, setShowArrivalResults] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // Handle checkbox selection
  const handleFlightSelect = useCallback((flightId: string) => {
    setSelectedFlights((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(flightId)) {
        newSelected.delete(flightId);
      } else {
        newSelected.add(flightId);
      }
      return newSelected;
    });
  }, []);

  // Reset selections when filters change
  useEffect(() => {
    setSelectedFlights(new Set());
    setSelectAll(false);
  }, [filteredFlights]);

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

  const onCarrierChange = useCallback((value: string) => {
    setCarrier(value);
  }, []);

  const onDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Search function for departure station
  const handleDepartureSearch = useCallback((query: string) => {
    setDepartureStation(query);
    if (query.trim() === "") {
      setDepartureResults(airports);
    } else {
      const filteredResults = airports.filter(
        (airport) =>
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setDepartureResults(filteredResults);
    }
    setShowDepartureResults(true);
  }, []);

  // Search function for arrival station
  const handleArrivalSearch = useCallback((query: string) => {
    setArrivalStation(query);
    if (query.trim() === "") {
      setArrivalResults(airports);
    } else {
      const filteredResults = airports.filter(
        (airport) =>
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setArrivalResults(filteredResults);
    }
    setShowArrivalResults(true);
  }, []);

  // Select departure station
  const handleDepartureSelect = useCallback((code: string) => {
    setDepartureStation(code);
    setShowDepartureResults(false);
  }, []);

  // Select arrival station
  const handleArrivalSelect = useCallback((code: string) => {
    setArrivalStation(code);
    setShowArrivalResults(false);
  }, []);

  // Add a reset filters function
  const resetFilters = useCallback(() => {
    setFlightNumber("");
    setCarrier("UA");
    setDepartureStation("JFK");
    setArrivalStation("ORD");
    setSelectedDate(new Date());
    setFilteredFlights(subscribedFlights);
    setSearchError("");
    setSelectedFlights(new Set());
    setSelectAll(false);
  }, [subscribedFlights]);

  // Enhance the onSearch function
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

      // Match date if selected - fix timezone issues
      if (selectedDate) {
        const flightDate = new Date(flight.departureDate);
        const searchDate = new Date(selectedDate);

        // Compare only year, month, and day
        return (
          flightDate.getFullYear() === searchDate.getFullYear() &&
          flightDate.getMonth() === searchDate.getMonth() &&
          flightDate.getDate() === searchDate.getDate()
        );
      }

      return true;
    });

    setFilteredFlights(results);
    setCurrentPage(1); // Reset to first page after search
    setSelectedFlights(new Set()); // Clear selections
    setSelectAll(false);

    if (results.length === 0) {
      toast.info("No flights match your search criteria");
    } else {
      toast.success(`Found ${results.length} matching flights`);
    }

    setIsSearching(false);
  }, [
    flightNumber,
    carrier,
    departureStation,
    arrivalStation,
    selectedDate,
    subscribedFlights,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Computed filtered airports
  const filteredDepartureAirports = departureResults;
  const filteredArrivalAirports = arrivalResults;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDepartureResults(false);
      setShowArrivalResults(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle select all checkbox
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectAll(checked);
      if (checked) {
        const allFlightIds = currentFlights.map(
          (flight) => flight.flightNumber
        );
        setSelectedFlights(new Set(allFlightIds));
      } else {
        setSelectedFlights(new Set());
      }
    },
    [currentFlights]
  );

  // Handle bulk unsubscribe
  const handleBulkUnsubscribe = useCallback(async () => {
    if (selectedFlights.size === 0) {
      toast.error("Please select at least one flight to unsubscribe");
      return;
    }

    setIsUnsubscribing(true); // Start loading

    try {
      // Simulate an API call or actual unsubscribe logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      toast.success(`Unsubscribed from ${selectedFlights.size} flights`);
      setSelectedFlights(new Set());
      setSelectAll(false);
    } catch (error) {
      toast.error("Failed to unsubscribe from flights");
    } finally {
      setIsUnsubscribing(false); // End loading
      setIsUnsubscribeDialogOpen(false); // Close the dialog
    }
  }, [selectedFlights]);

  const handleUnsubscribe = () => {
    if (selectedFlights.size === 0) {
      toast.error("Please select at least one flight to unsubscribe");
      return;
    }
    setIsUnsubscribeDialogOpen(true); // Open the dialog
  };

  // Reset selections when filters change
  useEffect(() => {
    setSelectedFlights(new Set());
    setSelectAll(false);
  }, [filteredFlights]);

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
              {selectedFlights.size > 0 && (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {selectedFlights.size} flight
                    {selectedFlights.size > 1 ? "s" : ""} selected
                  </div>
                </div>
              )}
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
                    <Select value={carrier} onValueChange={onCarrierChange}>
                      <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus:border-primary md:w-[120px]">
                        <SelectValue placeholder="Carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UA">UA</SelectItem>
                        <SelectItem value="AA">AA</SelectItem>
                        <SelectItem value="DL">DL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="flight-number"
                      className="text-sm font-medium mb-1"
                    >
                      Flt
                    </label>
                    <Input
                      id="flight-number"
                      placeholder="Enter Flt no."
                      value={flightNumber}
                      onChange={(e) => onFlightNumberChange(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && onSearch()}
                      disabled={isLoading}
                      className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary"
                    />
                  </div>

                  <div className="flex flex-5 flex-col justify-center items-center">
                    <div className="pt-4">and/or </div>
                  </div>

                  {/* Departure Station */}
                  <div className="flex  flex-col w-full md:w-auto relative">
                    <label
                      htmlFor="departure-station"
                      className="text-sm font-medium mb-1"
                    >
                      Dep Stn
                    </label>
                    <div className="relative">
                      <Input
                        id="departure-station"
                        placeholder="From"
                        value={departureStation}
                        onChange={(e) => handleDepartureSearch(e.target.value)}
                        onFocus={() => setShowDepartureResults(true)}
                        className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
                      />
                      {showDepartureResults && (
                        <div className="absolute z-10 mt-1 w-64 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredDepartureAirports.map((airport) => (
                            <div
                              key={airport.code}
                              className="p-2 hover:bg-accent cursor-pointer"
                              onClick={() =>
                                handleDepartureSelect(airport.code)
                              }
                            >
                              <div className="font-bold">{airport.code}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {airport.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrival Station */}
                  <div className="flex flex-col w-full md:w-auto relative">
                    <label
                      htmlFor="arrival-station"
                      className="text-sm font-medium mb-1"
                    >
                      Arr Stn
                    </label>
                    <div className="relative">
                      <Input
                        id="arrival-station"
                        placeholder="To"
                        value={arrivalStation}
                        onChange={(e) => handleArrivalSearch(e.target.value)}
                        onFocus={() => setShowArrivalResults(true)}
                        className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
                      />
                      {showArrivalResults && (
                        <div className="absolute z-10 mt-1 w-64 bg-background border border-border rounded-md shadow-lg max-h-auto ">
                          {filteredArrivalAirports.map((airport) => (
                            <div
                              key={airport.code}
                              className="p-2 hover:bg-accent cursor-pointer"
                              onClick={() => handleArrivalSelect(airport.code)}
                            >
                              <div className="font-bold">{airport.code}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {airport.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="text-sm font-medium mb-1">
                      Sch Dpt Dt
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
                              const normalizedDate = new Date(
                                Date.UTC(
                                  selectedDate.getFullYear(),
                                  selectedDate.getMonth(),
                                  selectedDate.getDate()
                                )
                              );
                              onDateChange(normalizedDate);
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

                  {/* Search Button Group */}
                  <div className="flex justify-end mt-auto gap-2">
                    <Button
                      onClick={onSearch}
                      className="h-10 w-full gradient-border md:w-auto"
                      disabled={isSearching || isLoading}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      className="h-10 w-full md:w-auto"
                      disabled={isSearching || isLoading}
                    >
                      Clear Filters
                    </Button>
                    {selectedFlights.size > 0 && (
                      <div className="flex justify-between items-center">
                        <Button
                          onClick={handleUnsubscribe}
                          variant="outline"
                          className="h-9"
                        >
                          Unsubscribe Selected
                        </Button>
                      </div>
                    )}
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
                {filteredFlights.length === 0 && !isSearching ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No flights match your search criteria. Try different filters
                    or
                    <Button
                      variant="link"
                      onClick={resetFilters}
                      className="px-1 text-primary"
                    >
                      clear all filters
                    </Button>
                  </div>
                ) : (
                  <UnSubscribeDataTable
                    flights={currentFlights}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    itemsPerPage={flightsPerPage}
                    totalItems={filteredFlights.length}
                    selectedFlights={selectedFlights}
                    onFlightSelect={handleFlightSelect}
                    selectAll={selectAll}
                    onSelectAll={handleSelectAll}
                  />
                )}
              </div>
            </CardContent>

            {/* pagination start */}
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
            {/* pagination end */}
          </Card>
        </div>
      )}

      {/* Unsubscribe Confirmation Dialog */}
      <Dialog
        open={isUnsubscribeDialogOpen}
        onOpenChange={setIsUnsubscribeDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Unsubscription</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to unsubscribe from {selectedFlights.size}{" "}
            selected flight{selectedFlights.size > 1 ? "s" : ""}?
          </p>
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
              onClick={handleBulkUnsubscribe}
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
