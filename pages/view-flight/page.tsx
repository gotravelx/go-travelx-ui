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
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import ViewFlightDatTable from "@/components/view-flight-data-table";
import { flightService } from "@/services/api";
import { toast } from "sonner";
import { FlightData } from "@/types/flight";

// Create a client-side only component
const ViewFlightClient = memo(
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
    onDateChange: (value: Date | undefined) => void;
    carrier: string;
    onCarrierChange: (value: string) => void;
  }) => {
    if (typeof window === "undefined") return null; // SSR fallback

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Local filter state for View Flight tab
    const [viewDepartureStation, setViewDepartureStation] = useState("");
    const [viewArrivalStation, setViewArrivalStation] = useState("");

    const [subscribedFlights, setSubscribedFlights] = useState<FlightData[]>(
      []
    );
    const [filteredFlights, setFilteredFlights] = useState<FlightData[]>([]);
    const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
    const [localSearchError, setLocalSearchError] = useState("");

    // Add pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch subscribed flights when component mounts
    useEffect(() => {
      const fetchSubscribedFlights = async () => {
        setIsLoadingSubscriptions(true);
        try {
          const flights = await flightService.getSubscribedFlights();
          setSubscribedFlights(flights);
          setFilteredFlights(flights);
          setTotalItems(flights.length);
          setHasInitiallyLoaded(true);
        } catch (error) {
          console.error("Error fetching subscribed flights:", error);
          toast.error("Failed to fetch subscribed flights");
        } finally {
          setIsLoadingSubscriptions(false);
        }
      };

      fetchSubscribedFlights();
    }, []);

    // Handle pagination changes
    const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
    }, []);

    const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
      setItemsPerPage(itemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
    }, []);

    // Handle flight number validation
    const handleFlightNumberChange = useCallback(
      (value: string) => {
        // Only allow numeric input and limit to 4 digits
        const numericValue = value.replace(/\D/g, "").slice(0, 4);
        onFlightNumberChange(numericValue);
      },
      [onFlightNumberChange]
    );

    // Handle departure station validation
    const handleDepartureStationChange = useCallback((value: string) => {
      // Convert to uppercase and limit to 3 characters
      const formattedValue = value.toUpperCase().slice(0, 3);
      setViewDepartureStation(formattedValue);
    }, []);

    // Handle arrival station validation
    const handleArrivalStationChange = useCallback((value: string) => {
      // Convert to uppercase and limit to 3 characters
      const formattedValue = value.toUpperCase().slice(0, 3);
      setViewArrivalStation(formattedValue);
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
      setViewDepartureStation("");
      setViewArrivalStation("");
      onFlightNumberChange("");
      onCarrierChange("UA");
      onDateChange(undefined); // Set to undefined instead of new Date()

      // Reset to original subscribed flights
      setFilteredFlights(subscribedFlights);
      setTotalItems(subscribedFlights.length);
      setLocalSearchError("");
    }, [
      onFlightNumberChange,
      onCarrierChange,
      onDateChange,
      subscribedFlights,
      setLocalSearchError,
    ]);

    // Apply filters to subscribed flights
    const applyFilters = useCallback(() => {
      if (subscribedFlights.length === 0) return;

      // Validate inputs before filtering
      let hasError = false;
      let errorMessage = "";

      if (
        flightNumber &&
        (flightNumber.length !== 4 || !/^\d+$/.test(flightNumber))
      ) {
        errorMessage = "Flight number must be 4 digits";
        hasError = true;
      }

      if (viewDepartureStation && viewDepartureStation.length !== 3) {
        errorMessage = "Departure station must be 3 characters";
        hasError = true;
      }

      if (viewArrivalStation && viewArrivalStation.length !== 3) {
        errorMessage = "Arrival station must be 3 characters";
        hasError = true;
      }

      if (hasError) {
        setLocalSearchError(errorMessage);
        return;
      }

      setLocalSearchError("");

      let filtered = [...subscribedFlights];

      // Filter by flight number if provided
      if (flightNumber) {
        filtered = filtered.filter((flight) =>
          flight.flightNumber.toString().includes(flightNumber)
        );
      }

      // Filter by carrier if provided
      if (carrier) {
        filtered = filtered.filter((flight) => flight.carrierCode === carrier);
      }

      // Filter by departure station if provided
      if (viewDepartureStation) {
        filtered = filtered.filter(
          (flight) => flight.departureAirport === viewDepartureStation
        );
      }

      // Filter by arrival station if provided
      if (viewArrivalStation) {
        filtered = filtered.filter(
          (flight) => flight.arrivalAirport === viewArrivalStation
        );
      }

      // Filter by date if selected (only if a date is actually selected)
      if (selectedDate) {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        filtered = filtered.filter(
          (flight) => flight.scheduledDepartureDate === dateString
        );
      }

      setFilteredFlights(filtered);
      setTotalItems(filtered.length);
      setCurrentPage(1); // Reset to first page after filtering

      if (filtered.length === 0) {
        toast.info("No flights match your search criteria");
      }
    }, [
      subscribedFlights,
      flightNumber,
      carrier,
      viewDepartureStation,
      viewArrivalStation,
      selectedDate,
      setLocalSearchError,
    ]);

    return (
      <div className="w-full ">
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

          <div className="flex flex-3 flex-col">
            <label htmlFor="flight-number" className="text-sm font-medium mb-1">
              Flight
            </label>
            <Input
              id="flight-number"
              placeholder="Enter Flight Number"
              value={flightNumber}
              onChange={(e) => handleFlightNumberChange(e.target.value)}
              disabled={isLoading}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary"
              maxLength={4}
            />
          </div>

          <div className="flex flex-5 flex-col justify-center items-center">
            <div className="pt-4">and/or </div>
          </div>

          {/* Departure Station */}
          <div className="flex flex-col w-full md:w-auto">
            <label
              htmlFor="departure-station"
              className="text-sm font-medium mb-1"
            >
              From
            </label>
            <Input
              id="departure-station"
              placeholder="Enter Station Code"
              value={viewDepartureStation}
              onChange={(e) => handleDepartureStationChange(e.target.value)}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
              maxLength={3}
            />
          </div>

          {/* Arrival Station */}
          <div className="flex flex-col w-full md:w-auto">
            <label
              htmlFor="arrival-station"
              className="text-sm font-medium mb-1"
            >
              To
            </label>
            <Input
              id="arrival-station"
              placeholder="Enter Station Code"
              value={viewArrivalStation}
              onChange={(e) => handleArrivalStationChange(e.target.value)}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
              maxLength={3}
            />
          </div>

          {/* Date Picker */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1">Departure Date</label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-background/90 border-2 border-primary/50 justify-start shadow-sm w-full hover:border-primary md:w-auto"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    onDateChange(date || undefined);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search and Reset Buttons */}
          <div className="flex justify-end mt-auto gap-2">
            <Button
              onClick={applyFilters}
              className="h-10 w-full gradient-border md:w-auto"
              disabled={isLoading || isLoadingSubscriptions}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="h-10 w-full md:w-auto"
              disabled={isLoading || isLoadingSubscriptions}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {localSearchError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localSearchError}</AlertDescription>
          </Alert>
        )}

        {/* Add the flight data table */}
        <div className="mt-8">
          {isLoadingSubscriptions ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading subscribed flights...</span>
            </div>
          ) : hasInitiallyLoaded && filteredFlights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {subscribedFlights.length === 0 ? (
                <>
                  You don't have any flight subscriptions yet.
                  <br />
                  Go to the "Add Flight Subscription" tab to subscribe to
                  flights.
                </>
              ) : (
                <>
                  No flights match your search criteria.
                  <Button
                    variant="link"
                    onClick={resetFilters}
                    className="px-1 text-primary"
                  >
                    Clear all filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <ViewFlightDatTable
              flights={filteredFlights}
              isLoading={isLoading || isLoadingSubscriptions}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    );
  }
);

ViewFlightClient.displayName = "ViewFlightClient";

// Server-side safe component
export default function ViewFlightPage() {
  return (
    <ViewFlightClient
      flightNumber=""
      onFlightNumberChange={() => {}}
      onSearch={() => {}}
      isLoading={false}
      searchError=""
      selectedDate={undefined}
      onDateChange={() => {}}
      carrier="UA"
      onCarrierChange={() => {}}
    />
  );
}
