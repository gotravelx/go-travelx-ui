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
import { memo, useState, useEffect } from "react";
import { AirportAutocomplete } from "./ui/airportAutocomplete";

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
  }: any) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // -------------------------
    // SET DEFAULT DATE
    // -------------------------
    useEffect(() => {
      if (!selectedDate) {
        onDateChange(new Date());
      }
    }, [selectedDate, onDateChange]);

  // -------------------------
// FLIGHT NUMBER VALIDATION (1–4 digits)
// -------------------------
const handleFlightNumberChange = (value: string) => {
  const numericValue = value.replace(/\D/g, "").slice(0, 4);
  onFlightNumberChange(numericValue);

  // Live validation
  if (numericValue.length === 0) {
    setSearchError("");
  } else if (numericValue.length < 1 || numericValue.length > 4) {
    setSearchError("Flight number must be 1–4 digits");
  } else {
    setSearchError("");
  }
};

    // -------------------------
    // DEPARTURE STATION
    // -------------------------
    const handleDepartureStationChange = (code: string) => {
      const formatted = code.toUpperCase().slice(0, 3);
      setDepartureStation(formatted);
      onDepartureStationChange(formatted);
    };

    // -------------------------
    // ARRIVAL STATION
    // -------------------------
    const handleArrivalStationChange = (code: string) => {
      const formatted = code.toUpperCase().slice(0, 3);
      setArrivalStation(formatted);
      onArrivalStationChange(formatted);
    };

    // -------------------------
    // SEARCH VALIDATION
    // -------------------------
    const handleSearch = () => {
      let errorMessage = "";
    
      if (!flightNumber || flightNumber.length < 1 || flightNumber.length > 4) {
        errorMessage = "Flight number must be 1–4 digits";
      }
      
    
      if (!carrier) {
        errorMessage = "Please select a carrier";
      }
    
      if (errorMessage) {
        setSearchError && setSearchError(errorMessage);
        return;
      }
    
      setSearchError && setSearchError("");
      onSearch();
    };
    
   

    return (
      <div className="w-full mx-auto">
        <style jsx global>{`
          .form-input-enhanced ::placeholder {
            color: rgba(115, 115, 115, 0.8);
            font-weight: 500;
          }
        `}</style>

        {/* FORM ROW */}
        <div className="flex flex-col form-input-enhanced w-full gap-4 md:flex-row">

          {/* CARRIER */}
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="carrier-select" className="text-sm font-medium mb-1">
              Carrier
            </label>

            <Select value={carrier} onValueChange={onCarrierChange}>
              <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-full md:w-[140px]">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>

              <SelectContent className="md:w-[300px]">

                {/* United Airlines */}
                <SelectItem value="UA">UA – United Airlines</SelectItem>

                {/* Star Alliance Partners */}
                <SelectItem value="AI">AI – Air India</SelectItem>
                <SelectItem value="A3">A3 – Aegean Airlines</SelectItem>
                <SelectItem value="JP">JP – Adria Airways</SelectItem>
                <SelectItem value="OZ">OZ – Asiana Airlines</SelectItem>
                <SelectItem value="SN">SN – Brussels Airlines</SelectItem>
                <SelectItem value="MS">MS – EgyptAir</SelectItem>
                <SelectItem value="LO">LO – LOT Polish Airlines</SelectItem>
                <SelectItem value="SK">SK – Scandinavian Airlines</SelectItem>
                <SelectItem value="ZH">ZH – Shenzhen Airlines</SelectItem>
                <SelectItem value="SQ">SQ – Singapore Airlines</SelectItem>
                <SelectItem value="SA">SA – South African Airways</SelectItem>
                <SelectItem value="TG">TG – Thai Airways</SelectItem>
                <SelectItem value="TP">TP – TAP Air Portugal</SelectItem>
                <SelectItem value="TK">TK – Turkish Airlines</SelectItem>
                <SelectItem value="AC">AC – Air Canada</SelectItem>
                <SelectItem value="NZ">NZ – Air New Zealand</SelectItem>
                <SelectItem value="NH">NH – ANA (All Nippon Airways)</SelectItem>
                <SelectItem value="OS">OS – Austrian Airlines</SelectItem>
                <SelectItem value="CA">CA – Air China</SelectItem>
                <SelectItem value="OU">OU – Croatia Airlines</SelectItem>
                <SelectItem value="LH">LH – Lufthansa</SelectItem>
                <SelectItem value="LX">LX – Swiss</SelectItem>
                <SelectItem value="ET">ET – Ethiopian Airlines</SelectItem>
                <SelectItem value="CM">CM – Copa Airlines</SelectItem>
                <SelectItem value="BR">BR – EVA Air</SelectItem>
                <SelectItem value="YX">YX – Republic Airways</SelectItem>


                {/* Codeshare */}
                <SelectItem value="MX">MX – Breeze Airways</SelectItem>
                <SelectItem value="HA">HA – Hawaiian Airlines</SelectItem>
                <SelectItem value="WN">WN – Southwest</SelectItem>
                <SelectItem value="G3">G3 – Gol Airlines</SelectItem>
                <SelectItem value="VS">VS – Virgin Atlantic</SelectItem>

              </SelectContent>
            </Select>
          </div>

          {/* FLIGHT NUMBER */}
          <div className="flex flex-3 flex-col">
            <label htmlFor="flight-number" className="text-sm font-medium mb-1">
              Flight
            </label>

            <Input
              id="flight-number"
              placeholder="Enter Flight Number"
              value={flightNumber}
              onChange={(e) => handleFlightNumberChange(e.target.value)}
              maxLength={4}
              disabled={isLoading}
              className="bg-background/90 border-2 border-primary/50 shadow-sm"
            />
            

          </div>

          {/* AND */}
          <div className="flex flex-5 flex-col justify-center items-center">
            <div className="pt-4">and </div>
          </div>

          {/* FROM */}
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="departure-station" className="text-sm font-medium mb-1">
              From
            </label>

            <AirportAutocomplete
              value={departureStation}
              id="departure-station"
              onSelect={handleDepartureStationChange}
              className="bg-background/90 border-2 border-primary/50 shadow-sm md:w-[200px]"
            />
          </div>

          {/* TO */}
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="arrival-station" className="text-sm font-medium mb-1">
              To
            </label>

            <AirportAutocomplete
              value={arrivalStation}
              id="arrival-station"
              onSelect={handleArrivalStationChange}
              className="bg-background/90 border-2 border-primary/50 shadow-sm md:w-[200px]"
            />
          </div>

          {/* DATE PICKER */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1">Departure Date</label>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-background/90 border-2 border-primary/50 justify-start shadow-sm w-full md:w-auto"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : format(new Date(), "PPP")}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (d) {
                      const normalized = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
                      onDateChange(normalized);
                    }
                    setIsCalendarOpen(false);
                  }}
                  disabled={(d) => d > new Date() || d < new Date("2023-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex justify-end mt-auto">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="h-10 w-full md:w-auto gradient-border"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
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
