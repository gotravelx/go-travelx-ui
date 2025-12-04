"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CalendarIcon, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { flightService } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { SubscriptionDetails } from "@/types/flight";
import { AirportAutocomplete } from "./ui/airportAutocomplete";

interface UnsubscribeFlightClientProps {
  walletAddress?: string;
}

export default function UnsubscribeFlightClient({
  walletAddress,
}: UnsubscribeFlightClientProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDetails[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    SubscriptionDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<
    Set<string>
  >(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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
  const [isConfirmBulkDialogOpen, setIsConfirmBulkDialogOpen] = useState(false);

  // 🟢 Fetch Subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSubscriptions =
        await flightService.getSubscribedFlightsDetails();
      setSubscriptions(fetchedSubscriptions);
      setFilteredSubscriptions(fetchedSubscriptions);
      setSelectedSubscriptions((prev) => {
        const newSet = new Set<string>();
        const currentFlightNumbers = new Set(
          fetchedSubscriptions.map((sub) => sub.subscription.flightNumber)
        );
        prev.forEach((fn) => {
          if (currentFlightNumbers.has(fn)) {
            newSet.add(fn);
          }
        });
        return newSet;
      });
      setSelectAll(false);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      toast.error("Failed to load subscriptions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // 🟢 Handle individual selection
  const handleSubscriptionSelect = (flightNumber: string) => {
    setSelectedSubscriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(flightNumber)) {
        newSet.delete(flightNumber);
      } else {
        newSet.add(flightNumber);
      }
      return newSet;
    });
  };

  // 🟢 Select All
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedSubscriptions(
        new Set(subscriptions.map((sub) => sub.subscription.flightNumber))
      );
    } else {
      setSelectedSubscriptions(new Set());
    }
  };

  // 🟢 Confirm Bulk Unsubscribe
  const confirmBulkUnsubscribe = useCallback(async () => {
    setIsUnsubscribing(true);
    try {
      const flightNumbers: string[] = [];
      const carrierCodes: string[] = [];
      const departureAirports: string[] = [];
      const arrivalAirports: string[] = [];
      selectedSubscriptions.forEach((selectedFlightNumber) => {
        const sub = subscriptions.find(
          (s) => s.subscription.flightNumber === selectedFlightNumber
        );
        if (sub) {
          flightNumbers.push(sub.subscription.flightNumber);
          carrierCodes.push(sub.flight.carrierCode || "");
          departureAirports.push(sub.flight.departureAirport || "");
          arrivalAirports.push(sub.flight.arrivalAirport || "");
        }
      });
      if (flightNumbers.length === 0) {
        toast.info("No flights selected for unsubscription.");
        setIsConfirmBulkDialogOpen(false);
        return;
      }
      const success = await flightService.unsubscribeFlights(
        flightNumbers,
        carrierCodes,
        departureAirports,
        arrivalAirports
      );
      if (success) {
        toast.success(
          `Successfully unsubscribed from ${flightNumbers.length} flight(s).`
        );
        setSelectedSubscriptions(new Set());
        setSelectAll(false);
        fetchSubscriptions();
      } else {
        toast.error("Failed to unsubscribe from selected flights.");
      }
    } catch (error) {
      console.error("Error during bulk unsubscribe:", error);
      toast.error("An error occurred during bulk unsubscription.");
    } finally {
      setIsUnsubscribing(false);
      setIsConfirmBulkDialogOpen(false);
    }
  }, [selectedSubscriptions, subscriptions, fetchSubscriptions]);

  const handleBulkUnsubscribe = () => {
    if (selectedSubscriptions.size === 0) {
      toast.info("Please select at least one flight to unsubscribe.");
      return;
    }
    setIsConfirmBulkDialogOpen(true);
  };

  // 🟢 Filter Handlers
  const handleCarrierChange = useCallback(
    (value: string) => setCarrier(value),
    []
  );

  const handleFlightNumberChange = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setFlightNumber(numericValue);
    setFlightNumberError(
      numericValue && numericValue.length !== 4
        ? "Flight number must be 4 digits"
        : ""
    );
  }, []);

  const handleDepartureSelect = (airport: string) => {
    setDepartureStation(airport || "");
    setDepartureStationError(
      airport.length !== 3 ? "Station code must be 3 characters" : ""
    );
  };

  const handleArrivalSelect = (airport: string) => {
    setArrivalStation(airport || "");
    setArrivalStationError(
      airport.length !== 3 ? "Station code must be 3 characters" : ""
    );
  };

  const resetFilters = useCallback(() => {
    setFlightNumber("");
    setCarrier("UA");
    setDepartureStation("");
    setArrivalStation("");
    setSelectedDate(null);
    setFilteredSubscriptions(subscriptions);
    setSearchError("");
    setSelectedSubscriptions(new Set());
    setSelectAll(false);
    setFlightNumberError("");
    setDepartureStationError("");
    setArrivalStationError("");
  }, [subscriptions]);

  const applyFilters = useCallback(() => {
    setIsSearching(true);
    try {
      let filtered = [...subscriptions];
      if (flightNumber)
        filtered = filtered.filter((item) =>
          item.subscription.flightNumber.includes(flightNumber)
        );
      if (carrier)
        filtered = filtered.filter(
          (item) => item.flight.carrierCode === carrier
        );
      if (departureStation)
        filtered = filtered.filter(
          (item) => item.flight.departureAirport === departureStation
        );
      if (arrivalStation)
        filtered = filtered.filter(
          (item) => item.flight.arrivalAirport === arrivalStation
        );
      if (selectedDate) {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        filtered = filtered.filter(
          (item) => item.flight.scheduledDepartureDate === dateString
        );
      }
      setFilteredSubscriptions(filtered);
      if (filtered.length === 0)
        toast.info("No subscriptions match your search criteria");
    } catch (error) {
      console.error("Error applying filters:", error);
      setSearchError("Error applying filters");
    } finally {
      setIsSearching(false);
    }
  }, [
    subscriptions,
    flightNumber,
    carrier,
    departureStation,
    arrivalStation,
    selectedDate,
  ]);

  // Pagination
  useEffect(() => setCurrentPage(1), [itemsPerPage]);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSubscriptions = filteredSubscriptions.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.subscription.isSubscriptionActive
  );

  return (
    <>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            {/* 🔍 Search Filters */}
            <div className="w-full mx-auto space-y-4">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Carrier */}
                <div>
                  <label className="text-sm font-medium">Carrier</label>
                  <Select value={carrier} onValueChange={handleCarrierChange}>
                    <SelectTrigger className="w-[120px] border-primary/50">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="md:w-[300px]">
                      {/* United Airlines */}
                      <SelectItem value="UA">UA – United Airlines</SelectItem>

                      {/* Star Alliance Partners */}
                      <SelectItem value="AC">AC – Air Canada</SelectItem>
                      <SelectItem value="LX">
                        LX – Swiss International Air Lines
                      </SelectItem>
                      <SelectItem value="NH">
                        NH – ANA (All Nippon Airways)
                      </SelectItem>
                      <SelectItem value="LH">LH – Lufthansa</SelectItem>
                      <SelectItem value="OS">OS – Austrian Airlines</SelectItem>
                      <SelectItem value="CA">CA – Air China</SelectItem>
                      <SelectItem value="OU">OU – Croatia Airlines</SelectItem>
                      <SelectItem value="ET">
                        ET – Ethiopian Airlines
                      </SelectItem>
                      <SelectItem value="CM">CM – Copa Airlines</SelectItem>
                      <SelectItem value="NZ">NZ – Air New Zealand</SelectItem>
                      <SelectItem value="CL">
                        CL – Lufthansa CityLine
                      </SelectItem>

                      {/* UA Codeshare / Partner Airlines */}
                      <SelectItem value="VA">
                        VA – Virgin Australia Airlines
                      </SelectItem>
                      <SelectItem value="OO">
                        OO – SkyWest dba United Express
                      </SelectItem>
                      <SelectItem value="YV">YV – Mesa Airlines</SelectItem>
                      <SelectItem value="YX">YX – Republic Airways</SelectItem>
                      <SelectItem value="EW">EW – Eurowings</SelectItem>
                      <SelectItem value="QK">QK – Jazz Aviation</SelectItem>
                      <SelectItem value="HA">HA – Hawaiian Airlines</SelectItem>
                      <SelectItem value="G7">
                        G7 – GOL Airlines (Brazil)
                      </SelectItem>
                      <SelectItem value="AD">
                        AD – Azul Brazilian Airlines
                      </SelectItem>
                      <SelectItem value="C5">C5 – Chalair Aviation</SelectItem>
                      <SelectItem value="FZ">FZ – FlyDubai</SelectItem>
                      <SelectItem value="EK">EK – Emirates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Flight Number */}
                <div>
                  <label className="text-sm font-medium">Flight</label>
                  <Input
                    placeholder="Enter Flight Number"
                    value={flightNumber}
                    onChange={(e) => handleFlightNumberChange(e.target.value)}
                    maxLength={4}
                    className={`border-2 ${
                      flightNumberError ? "border-red-500" : "border-primary/50"
                    }`}
                  />
                  {flightNumberError && (
                    <p className="text-xs text-red-500">{flightNumberError}</p>
                  )}
                </div>
                {/* Departure */}
                <div>
                  <label className="text-sm font-medium">From</label>
                  <AirportAutocomplete
                    value={departureStation}
                    onSelect={handleDepartureSelect}
                    className={`border-2 ${
                      departureStationError
                        ? "border-red-500"
                        : "border-primary/50"
                    }`}
                  />
                </div>
                {/* Arrival */}
                <div>
                  <label className="text-sm font-medium">To</label>
                  <AirportAutocomplete
                    value={arrivalStation}
                    onSelect={handleArrivalSelect}
                    className={`border-2 ${
                      arrivalStationError
                        ? "border-red-500"
                        : "border-primary/50"
                    }`}
                  />
                </div>
                {/* Date */}
                <div className="flex flex-col w-full md:w-auto">
                  <label className="text-sm font-medium">Departure Date</label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="border-primary/50">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "PPP")
                          : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => {
                          setSelectedDate(date || null);
                          setIsCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Search & Reset */}
                <div className="flex gap-2">
                  <Button onClick={applyFilters} disabled={isSearching}>
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                  <Button onClick={resetFilters} variant="outline">
                    Clear
                  </Button>
                </div>
                {/* 🟥 Bulk Unsubscribe Button */}
                <div className="flex justify-end mt-4">
                  <Button
                    variant="destructive"
                    onClick={handleBulkUnsubscribe}
                    disabled={
                      selectedSubscriptions.size === 0 || isUnsubscribing
                    }
                  >
                    {isUnsubscribing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                        Unsubscribing...
                      </>
                    ) : (
                      `Unsubscribe Selected (${selectedSubscriptions.size})`
                    )}
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading subscriptions...</span>
                </div>
              ) : activeSubscriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any active flight subscriptions.
                </div>
              ) : (
                <UnSubscribeDataTable
                  subscriptions={currentSubscriptions}
                  isLoading={isLoading || isSearching}
                  selectedSubscriptions={selectedSubscriptions}
                  onSubscriptionSelect={handleSubscriptionSelect}
                  selectAll={selectAll}
                  onSelectAll={handleSelectAll}
                  onUnsubscribe={fetchSubscriptions}
                />
              )}
            </div>
          </CardContent>
          {/* 🟢 Pagination */}
          {activeSubscriptions.length > 0 && (
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirst + 1}-
                {Math.min(indexOfLast, filteredSubscriptions.length)} of{" "}
                {filteredSubscriptions.length}
              </div>
              <div className="flex gap-2 items-center">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(parseInt(value))}
                >
                  <SelectTrigger className="w-[80px] border-primary/50">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage((p) => p - 1);
                        }}
                        className="border-primary/50"
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink className="border-primary/50">
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage((p) => p + 1);
                        }}
                        className="border-primary/50"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
      {/* 🟢 Bulk Unsubscribe Confirmation Dialog */}
      <Dialog
        open={isConfirmBulkDialogOpen}
        onOpenChange={setIsConfirmBulkDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Bulk Unsubscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to unsubscribe from{" "}
              {selectedSubscriptions.size} selected flights?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmBulkDialogOpen(false)}
              disabled={isUnsubscribing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkUnsubscribe}
              disabled={isUnsubscribing}
            >
              {isUnsubscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Unsubscribing...
                </>
              ) : (
                "Confirm Unsubscribe"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
