"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, Clock, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
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

interface SubscribedFlight {
  id: string;
  flightNumber: string;
  carrier: string;
  departureCity: string;
  arrivalCity: string;
  subscriptionDate: Date;
  nextUpdateTime: Date;
}

export default function UnsubscribeFlightClient() {
  const { isLoading } = useWeb3();

  const [subscribedFlights, setSubscribedFlights] = useState<
    SubscribedFlight[]
  >([]);
  const [isUnsubscribing, setIsUnsubscribing] = useState<
    Record<string, boolean>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage, setFlightsPerPage] = useState(5);

  useEffect(() => {
    const mockFlights: SubscribedFlight[] = Array.from(
      { length: 150 },
      (_, i) => ({
        id: (i + 1).toString(),
        flightNumber: `${1001 + i}`,
        carrier: "UA",
        departureCity: "City A",
        arrivalCity: "City B",
        subscriptionDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        nextUpdateTime: new Date(Date.now() + (i + 2) * 60 * 60 * 1000),
      })
    );
    setSubscribedFlights(mockFlights);
  }, []);

  // Reset to first page when rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [flightsPerPage]);

  const handleUnsubscribe = async (flightId: string) => {
    try {
      setIsUnsubscribing((prev) => ({ ...prev, [flightId]: true }));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubscribedFlights((prev) =>
        prev.filter((flight) => flight.id !== flightId)
      );
      toast.success("Successfully unsubscribed from flight");
    } catch (err) {
      setError("Failed to unsubscribe from flight. Please try again.");
      toast.error("Failed to unsubscribe from flight");
    } finally {
      setIsUnsubscribing((prev) => ({ ...prev, [flightId]: false }));
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getTimeRemaining = (date: Date) => {
    const diff = date.getTime() - new Date().getTime();
    if (diff <= 0) return "Due now";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = subscribedFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );
  const totalPages = Math.ceil(subscribedFlights.length / flightsPerPage);

  // Generate pagination items
  const generatePaginationItems = () => {
    return [
      <PaginationItem key="current-page">
        <PaginationLink
          href="#"
          className="border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm"
          isActive={true}
        >
          {currentPage}
        </PaginationLink>
      </PaginationItem>,
    ];
  };

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
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstFlight + 1}-
              {Math.min(indexOfLastFlight, subscribedFlights.length)} of{" "}
              {subscribedFlights.length} flights
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {currentFlights.map((flight) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary"
                          >
                            {flight.carrier}
                          </Badge>
                          <span className="font-semibold">
                            {flight.flightNumber}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Plane className="h-4 w-4 mr-2" />
                          <span>
                            {flight.departureCity} → {flight.arrivalCity}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              Subscribed on:{" "}
                              {formatDate(flight.subscriptionDate)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              Next update:{" "}
                              {getTimeRemaining(flight.nextUpdateTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t md:border-t-0 md:border-l border-border/50 p-4 flex justify-end items-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUnsubscribe(flight.id)}
                          disabled={isUnsubscribing[flight.id] || isLoading}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          {isUnsubscribing[flight.id]
                            ? "Unsubscribing..."
                            : "Unsubscribe"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-end items-center gap-4">
            <Select
              value={flightsPerPage.toString()}
              onValueChange={(value) =>
                setFlightsPerPage(Number.parseInt(value))
              }
            >
              <SelectTrigger className="w-[80px] border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm">
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
                        className="border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm h-9 w-9"
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
                        className="border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm"
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {/* Current page indicator */}
                    {generatePaginationItems()}

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
                        className="border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm"
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
                        className="border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm h-9 w-9"
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
      )}
    </>
  );
}
