"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { AlertCircle, CalendarIcon, XCircle } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import ViewFlightDatTable from "@/components/view-flight-data-table";

// Sample airport data
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

const ViewFlight = memo(
  ({
    flightNumber,
    onFlightNumberChange,
    onSearch,
    isLoading,
    searchError,
    selectedDate,
    onDateChange,
    carrier,
    onCarrierChange,
  }: {
    flightNumber: string;
    onFlightNumberChange: (value: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    searchError: string;
    selectedDate: Date | undefined;
    onDateChange: (value: Date) => void;
    carrier: string;
    onCarrierChange: (value: string) => void;
  }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [departureStation, setDepartureStation] = useState("");
    const [arrivalStation, setArrivalStation] = useState("");
    const [departureResults, setDepartureResults] = useState(airports);
    const [arrivalResults, setArrivalResults] = useState(airports);
    const [showDepartureResults, setShowDepartureResults] = useState(false);
    const [showArrivalResults, setShowArrivalResults] = useState(false);

    // Add pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // Handle pagination changes
    const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
      // You might want to trigger a new search here with the updated page
    }, []);

    const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
      setItemsPerPage(itemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
      // You might want to trigger a new search here with the updated items per page
    }, []);

    // Update total items when data changes
    useEffect(() => {
      // This is a placeholder - in a real app, you would get this from your API response
      setTotalItems(20); // Example: 20 total flights
    }, []);

    // Search function for departure station
    const searchDepartureStation = useCallback((query: string) => {
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
    const searchArrivalStation = useCallback((query: string) => {
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
    const selectDepartureStation = useCallback((code: string) => {
      setDepartureStation(code);
      setShowDepartureResults(false);
    }, []);

    // Select arrival station
    const selectArrivalStation = useCallback((code: string) => {
      setArrivalStation(code);
      setShowArrivalResults(false);
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
      setDepartureStation("JFK");
      setArrivalStation("ORD");
      onFlightNumberChange("");
      onCarrierChange("UA");
      onDateChange(new Date());
    }, [onFlightNumberChange, onCarrierChange, onDateChange]);

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

    return (
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
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-3 flex-col">
            <label htmlFor="flight-number" className="text-sm font-medium mb-1">
              Flt
            </label>
            <Input
              id="flight-number"
              placeholder="Enter Flt no."
              value={flightNumber}
              onChange={(e) => onFlightNumberChange(e.target.value)}
              // onKeyDown={(e) => e.key === "Enter" && onSearch()}
              disabled={isLoading}
              className="bg-background/90 border-2 border-primary/50 shadow-sm focus-visible:border-primary"
            />
          </div>

          <div className="flex flex-5 flex-col justify-center items-center">
            <div className="pt-4">and/or </div>
          </div>

          {/* Departure Station */}
          <div className="flex flex-col w-full md:w-auto relative">
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
                onChange={(e) => searchDepartureStation(e.target.value)}
                onFocus={() => setShowDepartureResults(true)}
                className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
              />
              {showDepartureResults && (
                <div className="absolute z-10 mt-1 w-64 bg-background border border-border rounded-md shadow-lg max-h-auto">
                  {departureResults.map((airport) => (
                    <div
                      key={airport.code}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => selectDepartureStation(airport.code)}
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
                onChange={(e) => searchArrivalStation(e.target.value)}
                onFocus={() => setShowArrivalResults(true)}
                className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
              />
              {showArrivalResults && (
                <div className="absolute z-10 mt-1 w-64 bg-background border border-border rounded-md shadow-lg max-h-auto">
                  {arrivalResults.map((airport) => (
                    <div
                      key={airport.code}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => selectArrivalStation(airport.code)}
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
            <label className="text-sm font-medium mb-1">Sch Dpt Dt</label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                  disabled={(d) => d > new Date() || d < new Date("2023-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search and Reset Buttons */}
          <div className="flex  gap-2 justify-end mt-auto">
            <Button
              onClick={onSearch}
              className="h-10 w-full gradient-border md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="h-10 w-full md:w-auto"
              disabled={isLoading}
            >
              Clear Filter
            </Button>
          </div>
        </div>

        {searchError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}

        {/* Add the flight data table */}
        <div className="mt-8">
          <ViewFlightDatTable
            isLoading={isLoading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    );
  }
);

ViewFlight.displayName = "ViewFlight";

export default ViewFlight;
