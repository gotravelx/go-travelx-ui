"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CalendarIcon, AlertCircle, Loader2, Code } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import ViewFlightDatTable from "./view-flight-data-table";
import { flightService } from "@/services/api";
import type { FlightData } from "@/types/flight";
import { Label } from "@/components/ui/label"; // Import Label
import { AirportAutocomplete } from "./ui/airportAutocomplete";

export default function ViewFlight() {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalFlights, setTotalFlights] = useState(0);

  const [flightNumber, setFlightNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchError, setSearchError] = useState("");
  const [carrier, setCarrier] = useState("UA");
  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [departureStationError, setDepartureStationError] = useState("");
  const [arrivalStationError, setArrivalStationError] = useState("");
  const [flightNumberError, setFlightNumberError] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFlights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedFlights = await flightService.getSubscribedFlights();
      setFlights(fetchedFlights);
      setTotalFlights(fetchedFlights.length);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to load flights.");
      setFlights([]);
      setTotalFlights(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleCarrierChange = useCallback((value: string) => {
    setCarrier(value);
  }, []);

  const handleFlightNumberChange = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setFlightNumber(numericValue);
    if (numericValue.length === 0) {
      setFlightNumberError("");
    } else if (numericValue.length < 1 || numericValue.length > 4) {
      setFlightNumberError("Flight number must be 1–4 digits");
    } else {
      setFlightNumberError("");
    }
  }, []);

  const handleDepartureSelect = (airport: any) => {
    const code = airport || "";

    setDepartureStation(code);

    if (code.length !== 3) {
      setDepartureStationError("Station code must be 3 characters");
    } else {
      setDepartureStationError("");
    }
  };

  const handleArrivalSelect = (airport: any) => {
    const code = airport || "";
    setArrivalStation(code);

    if (airport.length !== 3) {
      setArrivalStationError("Station code must be 3 characters");
    } else {
      setArrivalStationError("");
    }
  };

  const resetFilters = useCallback(() => {
    setFlightNumber("");
    setCarrier("UA");
    setDepartureStation("");
    setArrivalStation("");
    setSelectedDate(null);
    setSearchError("");
    setFlightNumberError("");
    setDepartureStationError("");
    setArrivalStationError("");
    fetchFlights();
  }, [fetchFlights]);

  const applyFilters = useCallback(async () => {
    setIsSearching(true);
    setSearchError("");
    let hasError = false;

    if (flightNumber && (flightNumber.length < 1 || flightNumber.length > 4)) {
      setFlightNumberError("Flight number must be 1–4 digits");
      hasError = true;
    }
    
    if (departureStation && departureStation.length !== 3) {
      setDepartureStationError("Station code must be 3 characters");
      hasError = true;
    }
    if (arrivalStation && arrivalStation.length !== 3) {
      setArrivalStationError("Station code must be 3 characters");
      hasError = true;
    }

    if (hasError) {
      setIsSearching(false);
      return;
    }

    try {
      const allFlights = await flightService.getSubscribedFlights();
      let filtered = [...allFlights];

      if (flightNumber) {
        filtered = filtered.filter((item) =>
          item.flightNumber.toString().includes(flightNumber)
        );
      }
      if (carrier) {
        filtered = filtered.filter((item) => item.carrierCode === carrier);
      }
      if (departureStation) {
        filtered = filtered.filter(
          (item) => item.departureAirport === departureStation
        );
      }
      if (arrivalStation) {
        filtered = filtered.filter(
          (item) => item.arrivalAirport === arrivalStation
        );
      }
      if (selectedDate) {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        filtered = filtered.filter(
          (item) => item.scheduledDepartureDate === dateString
        );
      }

      setFlights(filtered);
      setTotalFlights(filtered.length);
      setCurrentPage(1);

      if (
        filtered.length === 0 &&
        (flightNumber ||
          carrier ||
          departureStation ||
          arrivalStation ||
          selectedDate)
      ) {
        toast.info("No flights match your search criteria.");
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setSearchError("Error applying filters.");
    } finally {
      setIsSearching(false);
    }
  }, [flightNumber, carrier, departureStation, arrivalStation, selectedDate]);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div>
        <div className="w-full mx-auto">
          <style jsx global>{`
            .form-input-enhanced ::placeholder {
              color: rgba(115, 115, 115, 0.8);
              font-weight: 500;
            }
          `}</style>
          <div className="flex flex-col form-input-enhanced w-full gap-4 md:flex-row">
            <div className="flex flex-col w-full md:w-auto">
              <Label
                htmlFor="carrier-select"
                className="text-sm font-medium mb-1"
              >
                Carrier
              </Label>
              <Select value={carrier} onValueChange={handleCarrierChange}>
                <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus:border-primary md:w-[140px]">
                  <SelectValue placeholder="Any" />
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
                  <SelectItem value="LX">LX – Swiss International Air Lines</SelectItem>
                  <SelectItem value="ET">ET – Ethiopian Airlines</SelectItem>
                  <SelectItem value="CM">CM – Copa Airlines</SelectItem>
                  <SelectItem value="BR">BR – EVA Air</SelectItem>
                  <SelectItem value="YX">YX – Republic Airways</SelectItem>


                  {/* UA Codeshare Airlines */}
                  <SelectItem value="MX">MX – Breeze Airways</SelectItem>
                  <SelectItem value="HA">HA – Hawaiian Airlines</SelectItem>
                  <SelectItem value="WN">WN – Southwest </SelectItem>
                  <SelectItem value="G3">G3 – Gol Airlines</SelectItem>
                  <SelectItem value="VS">VS – Virgin Atlantic</SelectItem>

                  </SelectContent>

              </Select>
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="flight-number"
                className="text-sm font-medium mb-1"
              >
                Flight
              </Label>
              <div>
                <Input
                  id="flight-number"
                  placeholder="Enter Flight Number"
                  value={flightNumber}
                  onChange={(e) => handleFlightNumberChange(e.target.value)}
                  disabled={isLoading || isSearching}
                  className={`bg-background/90 border-2 ${
                    flightNumberError ? "border-red-500" : "border-primary/50"
                  } shadow-sm w-full focus-visible:border-primary`}
                  maxLength={4}
                />
                {flightNumberError && (
                  <p className="text-xs text-red-500 mt-1">
                    {flightNumberError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-5 flex-col justify-center items-center">
              <div className="pt-4">and </div>
            </div>

            <div className="flex flex-col w-full md:w-auto">
              <Label
                htmlFor="departure-station"
                className="text-sm font-medium mb-1"
              >
                From
              </Label>
              <div>
                <AirportAutocomplete
                  value={departureStation}
                  id="departure-station"
                  onSelect={handleDepartureSelect}
                  className={`bg-background/90 border-2 ${
                    departureStationError
                      ? "border-red-500"
                      : "border-primary/50"
                  } shadow-sm w-full focus-visible:border-primary md:w-[200px]`}
                />
                {departureStationError && (
                  <p className="text-xs text-red-500 mt-1">
                    {departureStationError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full md:w-auto">
              <Label
                htmlFor="arrival-station"
                className="text-sm font-medium mb-1"
              >
                To
              </Label>
              <div>
                <AirportAutocomplete
                  value={arrivalStation}
                  id="arrival-station"
                  onSelect={handleArrivalSelect}
                  className={`bg-background/90 border-2 ${
                    arrivalStationError ? "border-red-500" : "border-primary/50"
                  } shadow-sm w-full focus-visible:border-primary md:w-[200px]`}
                />
                {arrivalStationError && (
                  <p className="text-xs text-red-500 mt-1">
                    {arrivalStationError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full md:w-auto">
              <Label className="text-sm font-medium mb-1">Departure Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-background/90 border-2 border-primary/50 justify-start shadow-sm w-full hover:border-primary md:w-auto"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date: Date | undefined) => {
                      setSelectedDate(date || null);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end mt-auto gap-2">
              <Button
                onClick={applyFilters}
                className="h-10 w-full gradient-border md:w-auto"
                disabled={isSearching || isLoading}
              >
                {isSearching ? (
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
                className="h-10 w-full md:w-auto bg-transparent"
                disabled={isSearching || isLoading}
              >
                Clear Filters
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
          <ViewFlightDatTable
            flights={flights}
            isLoading={isLoading || isSearching}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalFlights}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
