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
  walletAddress: string;
}

export default function UnsubscribeFlightClient() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDetails[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    SubscriptionDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<
    Set<string>
  >(new Set()); // Stores flightNumber
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
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [isConfirmBulkDialogOpen, setIsConfirmBulkDialogOpen] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSubscriptions =
        await flightService.getSubscribedFlightsDetails();
      setSubscriptions(fetchedSubscriptions);
      setFilteredSubscriptions(fetchedSubscriptions);
      // Clear selected subscriptions if they are no longer in the fetched list
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
      setSelectAll(false); // Reset select all
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

  const handleSubscriptionSelect = (flightNumber: string) => {
    // Takes flightNumber
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

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedSubscriptions(() => {
      if (checked) {
        return new Set(
          subscriptions.map((sub) => sub.subscription.flightNumber)
        );
      } else {
        return new Set();
      }
    });
  };

  const handleBulkUnsubscribe = async () => {
    if (selectedSubscriptions.size === 0) {
      toast.info("Please select flights to unsubscribe.");
      return;
    }

    setIsConfirmBulkDialogOpen(true);
  };

  const confirmBulkUnsubscribe = useCallback(async () => {
    setIsUnsubscribing(true);
    try {
      const flightNumbersToUnsubscribe: string[] = [];
      const carrierCodes: string[] = [];
      const departureAirportsToUnsubscribe: string[] = [];
      const arrivalAirportsToUnsubscribe: string[] = [];

      selectedSubscriptions.forEach((selectedFlightNumber) => {
        const subscription = subscriptions.find(
          (sub) => sub.subscription.flightNumber === selectedFlightNumber
        );
        if (subscription) {
          flightNumbersToUnsubscribe.push(
            subscription.subscription.flightNumber
          );
          departureAirportsToUnsubscribe.push(
            subscription.subscription.departureAirport
          );
        }
      });

      const success = await flightService.unsubscribeFlights(
        flightNumbersToUnsubscribe,
        carrierCodes,
        departureAirportsToUnsubscribe,
        arrivalAirportsToUnsubscribe
      );

      if (success) {
        toast.success(
          `Successfully unsubscribed from ${selectedSubscriptions.size} flight(s).`
        );
        setSelectedSubscriptions(new Set());
        setSelectAll(false);
        fetchSubscriptions(); // Refresh the list
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

  // Handlers for filter changes
  const handleCarrierChange = useCallback((value: string) => {
    setCarrier(value);
  }, []);

  // Handle flight number validation
  const handleFlightNumberChange = useCallback((value: string) => {
    // Only allow numeric input and limit to 4 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setFlightNumber(numericValue);

    // Validate
    if (numericValue && numericValue.length !== 4) {
      setFlightNumberError("Flight number must be 4 digits");
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

  // Add a reset filters function
  const resetFilters = useCallback(() => {
    setFlightNumber("");
    setCarrier("");
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

  // Apply filters to subscriptions
  const applyFilters = useCallback(() => {
    setIsSearching(true);
    setSearchError("");

    // Validate inputs
    let hasError = false;

    if (flightNumber && flightNumber.length !== 4) {
      setFlightNumberError("Flight number must be 4 digits");
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
      let filtered = [...subscriptions];

      // Filter by flight number if provided
      if (flightNumber) {
        filtered = filtered.filter((item) =>
          item.subscription.flightNumber.toString().includes(flightNumber)
        );
      }

      // Filter by carrier if provided
      if (carrier) {
        filtered = filtered.filter(
          (item) => item.flight.carrierCode === carrier
        );
      }

      // Filter by departure station if provided
      if (departureStation) {
        filtered = filtered.filter(
          (item) => item.flight.departureAirport === departureStation
        );
      }

      // Filter by arrival station if provided
      if (arrivalStation) {
        filtered = filtered.filter(
          (item) => item.flight.arrivalAirport === arrivalStation
        );
      }

      // Filter by date if selected
      if (selectedDate) {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        filtered = filtered.filter(
          (item) => item.flight.scheduledDepartureDate === dateString
        );
      }

      setFilteredSubscriptions(filtered);
      setCurrentPage(1); // Reset to first page after filtering

      if (
        filtered.length === 0 &&
        (flightNumber ||
          carrier ||
          departureStation ||
          arrivalStation ||
          selectedDate)
      ) {
        toast.info("No subscriptions match your search criteria");
      }
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

  // Reset to first page when rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Calculate pagination
  const indexOfLastSubscription = currentPage * itemsPerPage;
  const indexOfFirstSubscription = indexOfLastSubscription - itemsPerPage;
  const currentSubscriptions = filteredSubscriptions.slice(
    indexOfFirstSubscription,
    indexOfLastSubscription
  );
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  // Filter for active subscriptions to display
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
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UA">UA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="flight-number"
                    className="text-sm font-medium mb-1"
                  >
                    Flight
                  </label>
                  <div>
                    <Input
                      id="flight-number"
                      placeholder="Enter Flight Number"
                      value={flightNumber}
                      onChange={(e) => handleFlightNumberChange(e.target.value)}
                      disabled={isLoading || isSearching}
                      className={`bg-background/90 border-2 ${
                        flightNumberError
                          ? "border-red-500"
                          : "border-primary/50"
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

                {/* Departure Station */}
                <div className="flex flex-col w-full md:w-auto">
                  <label
                    htmlFor="departure-station"
                    className="text-sm font-medium mb-1"
                  >
                    From
                  </label>
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

                {/* Arrival Station */}
                <div className="flex flex-col w-full md:w-auto">
                  <label
                    htmlFor="arrival-station"
                    className="text-sm font-medium mb-1"
                  >
                    To
                  </label>
                  <div>
                    <AirportAutocomplete
                      value={arrivalStation}
                      id="arrival-station"
                      onSelect={handleArrivalSelect}
                      className={`bg-background/90 border-2 ${
                        arrivalStationError
                          ? "border-red-500"
                          : "border-primary/50"
                      } shadow-sm w-full focus-visible:border-primary md:w-[200px]`}
                    />
                    {arrivalStationError && (
                      <p className="text-xs text-red-500 mt-1">
                        {arrivalStationError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col w-full md:w-auto">
                  <label className="text-sm font-medium mb-1">
                    Departure Date
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
                          : "Select Date"}
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

                {/* Search Button Group */}
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
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading subscriptions...</span>
                </div>
              ) : activeSubscriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any active flight subscriptions yet.
                  <br />
                  Go to the "Add Flight Subscription" tab to subscribe to
                  flights.
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

          {/* pagination start */}
          {activeSubscriptions.length > 0 && (
            <CardFooter>
              {/* Pagination controls */}
              <div className="flex justify-between w-full items-center">
                <div className="text-muted-foreground text-sm">
                  Showing{" "}
                  {activeSubscriptions.length === 0
                    ? 0
                    : indexOfFirstSubscription + 1}
                  -
                  {Math.min(
                    indexOfLastSubscription,
                    activeSubscriptions.length
                  )}{" "}
                  of {activeSubscriptions.length} subscriptions
                </div>

                <div className="flex justify-end gap-4 items-center">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) =>
                      setItemsPerPage(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-[80px] focus:border-primary">
                      <SelectValue placeholder="5" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
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
                              onClick={() => setCurrentPage(1)}
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
                                if (currentPage > 1) {
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  );
                                }
                              }}
                              className="bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
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
                                if (currentPage < totalPages) {
                                  setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                  );
                                }
                              }}
                              className="bg-background/90 border-2 border-primary/50 shadow-sm focus:border-primary"
                            />
                          </PaginationItem>

                          {/* Last page button */}
                          <PaginationItem>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(totalPages)}
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
          )}
          {/* pagination end */}
        </Card>
      </div>

      {/* Bulk Unsubscribe Confirmation Dialog */}
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
          <DialogFooter className="flex flex-row justify-end gap-2">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
