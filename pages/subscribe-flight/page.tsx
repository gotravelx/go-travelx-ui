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
import { memo, useState, useEffect, useRef } from "react";

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
  }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [showDepartureResults, setShowDepartureResults] = useState(false);
    const [showArrivalResults, setShowArrivalResults] = useState(false);

    // Add refs for the dropdown containers
    const departureDropdownRef = useRef<HTMLDivElement>(null);
    const arrivalDropdownRef = useRef<HTMLDivElement>(null);

    // Filter airports based on search term
    const filteredDepartureAirports = departureStation
      ? airports.filter(
          (airport) =>
            airport.code
              .toLowerCase()
              .includes(departureStation.toLowerCase()) ||
            airport.name.toLowerCase().includes(departureStation.toLowerCase())
        )
      : airports;

    const filteredArrivalAirports = arrivalStation
      ? airports.filter(
          (airport) =>
            airport.code.toLowerCase().includes(arrivalStation.toLowerCase()) ||
            airport.name.toLowerCase().includes(arrivalStation.toLowerCase())
        )
      : airports;

    // Handle departure station search
    const handleDepartureSearch = (value: string) => {
      setDepartureStation(value);
      setShowDepartureResults(true);
    };

    // Handle arrival station search
    const handleArrivalSearch = (value: string) => {
      setArrivalStation(value);
      setShowArrivalResults(true);
    };

    // Handle departure station selection
    const handleDepartureSelect = (code: string) => {
      onDepartureStationChange(code);
      setShowDepartureResults(false);
    };

    // Handle arrival station selection
    const handleArrivalSelect = (code: string) => {
      onArrivalStationChange(code);
      setShowArrivalResults(false);
    };

    // Add click outside handler to close dropdowns
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        // Close departure dropdown if clicked outside
        if (
          departureDropdownRef.current &&
          !departureDropdownRef.current.contains(event.target as Node)
        ) {
          setShowDepartureResults(false);
        }

        // Close arrival dropdown if clicked outside
        if (
          arrivalDropdownRef.current &&
          !arrivalDropdownRef.current.contains(event.target as Node)
        ) {
          setShowArrivalResults(false);
        }
      };

      // Add event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Clean up event listener
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
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
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary"
            />
          </div>

          <div className="flex flex-5 flex-col justify-center items-center">
            <div className="pt-4">and/or </div>
          </div>

          {/* Departure Station */}
          <div
            className="flex flex-col w-full md:w-auto relative"
            ref={departureDropdownRef}
          >
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
                <div className="absolute z-10 mt-1 w-64 bg-background border border-border rounded-md shadow-lg max-h-auto ">
                  {filteredDepartureAirports.map((airport) => (
                    <div
                      key={airport.code}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => handleDepartureSelect(airport.code)}
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
          <div
            className="flex flex-col w-full md:w-auto relative"
            ref={arrivalDropdownRef}
          >
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
                <div className="absolute z-10 mt-1 w-64 bg-background border border-border rounded-md shadow-lg max-h-auto">
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
          <div className="flex  justify-end mt-auto">
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
      </div>
    );
  }
);

SubscribeFlight.displayName = "SubscribeFlight";

export default SubscribeFlight;
