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
import { AlertCircle, CalendarIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import ViewFlightDatTable from "@/components/view-flight-data-table";

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
    const [departureStation, setDepartureStation] = useState("JFK");
    const [arrivalStation, setArrivalStation] = useState("ORD");

    // Add pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // Handle pagination changes
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      // You might want to trigger a new search here with the updated page
    };

    const handleItemsPerPageChange = (itemsPerPage: number) => {
      setItemsPerPage(itemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
      // You might want to trigger a new search here with the updated items per page
    };

    // Update total items when data changes
    useEffect(() => {
      // This is a placeholder - in a real app, you would get this from your API response
      setTotalItems(20); // Example: 20 total flights
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
              Flight Number
            </label>
            <Input
              id="flight-number"
              placeholder="Enter flight number..."
              value={flightNumber}
              onChange={(e) => onFlightNumberChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              disabled={isLoading}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-48 focus-visible:border-primary"
            />
          </div>
          {/*  */}
          <div className="flex flex-5 flex-col justify-center items-center">
            <div className="pt-4">and/or </div>
          </div>
          {/*  */}
          <div className="flex flex-col w-full md:w-auto">
            <label
              htmlFor="carrier-select"
              className="text-sm font-medium mb-1"
            >
              Departure Station
            </label>
            <Select value={departureStation}>
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
              </SelectContent>
            </Select>
          </div>
          {/*  */}
          {/*  */}
          <div className="flex flex-col w-full md:w-auto">
            <label
              htmlFor="carrier-select"
              className="text-sm font-medium mb-1"
            >
              Arrival Station
            </label>
            <Select value={arrivalStation}>
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
              </SelectContent>
            </Select>
          </div>
          {/*  */}
          {/*  */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1">
              Scheduled Departure Date
            </label>
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
                      onDateChange(selectedDate);
                    }
                    setIsCalendarOpen(false);
                  }}
                  disabled={(d) => d > new Date() || d < new Date("2023-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col justify-end mt-auto">
            <Button
              onClick={onSearch}
              className="h-10 w-full gradient-border md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
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
