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
import { memo, useState } from "react";

const SubscribeFlight = memo(
  ({
    flightNumber,
    onFlightNumberChange,
    onSearch,
    isLoading,
    searchError,
    selectedDate,
    onDateChange,
    carrier,
    departureStation,
    setDepartureStation,
    arrivalStation,
    setArrivalStation,
    onDepartureStationChange,
    onArrivalStationChange,
    onCarrierChange,
    setSearchError,
  }: {
    flightNumber: string;
    onFlightNumberChange: (value: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    searchError: string;
    selectedDate: Date | undefined;
    onDateChange: (value: Date) => void;
    carrier: string;
    departureStation: string;
    setDepartureStation: (value: string) => void;
    arrivalStation: string;
    setArrivalStation: (value: string) => void;
    onDepartureStationChange: (value: string) => void;
    onArrivalStationChange: (value: string) => void;
    onCarrierChange: (value: string) => void;
    setSearchError: (value: string) => void;
  }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Add flight number validation
    const handleFlightNumberChange = (value: string) => {
      // Only allow numeric input and limit to 4 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 4);
      onFlightNumberChange(numericValue);
    };

    // Add departure station validation
    const handleDepartureStationChange = (value: string) => {
      // Convert to uppercase and limit to 3 characters
      const formattedValue = value.toUpperCase().slice(0, 3);
      setDepartureStation(formattedValue);
      onDepartureStationChange(formattedValue);
    };

    // Handle arrival station validation
    const handleArrivalStationChange = (value: string) => {
      // Convert to uppercase and limit to 3 characters
      const formattedValue = value.toUpperCase().slice(0, 3);
      setArrivalStation(formattedValue);
      onArrivalStationChange(formattedValue);
    };

    // Update the onSearch function to validate inputs before searching
    const handleSearch = () => {
      // Validate inputs before searching
      let hasError = false;
      let errorMessage = "";

      if (
        !flightNumber ||
        flightNumber.length !== 4 ||
        !/^\d+$/.test(flightNumber)
      ) {
        errorMessage = "Flight number must be 4 digits";
        hasError = true;
      }

      if (!departureStation || departureStation.length !== 3) {
        errorMessage = "Departure station must be 3 characters";
        hasError = true;
      }

      if (hasError) {
        // Set error message if setSearchError is available
        if (typeof setSearchError === "function") {
          setSearchError(errorMessage);
        }
        return;
      }

      // Clear any previous error if setSearchError is available
      if (searchError && typeof setSearchError === "function") {
        setSearchError("");
      }

      // Proceed with search
      onSearch();
    };

    return (
      <div className="w-full mx-auto min-h-[100vh]">
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
              value={departureStation}
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
              Arr Stn
            </label>
            <Input
              id="arrival-station"
              placeholder="Enter Station Code"
              value={arrivalStation}
              onChange={(e) => handleArrivalStationChange(e.target.value)}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
              maxLength={3}
            />
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

          {/* Search Button */}
          <div className="flex justify-end mt-auto">
            <Button
              onClick={handleSearch}
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
      </div>
    );
  }
);

SubscribeFlight.displayName = "SubscribeFlight";

export default SubscribeFlight;
