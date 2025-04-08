"use client";

import React from "react";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Plane,
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FlightStatusView from "@/components/flight-status-view";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { type SubscriptionDetails, flightService } from "@/services/api";
import { useWeb3 } from "@/contexts/web3-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface UnSubscribeDataTableProps {
  subscriptions: SubscriptionDetails[];
  isLoading: boolean;
  selectedSubscriptions: Set<string>;
  onSubscriptionSelect: (subscriptionId: string) => void;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  onUnsubscribe: () => void;
}

export default function UnSubscribeDataTable({
  subscriptions,
  isLoading,
  selectedSubscriptions,
  onSubscriptionSelect,
  selectAll,
  onSelectAll,
  onUnsubscribe,
}: UnSubscribeDataTableProps) {
  const { walletAddress } = useWeb3();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState<string | null>(null);

  // Add state for confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmingSubscription, setConfirmingSubscription] =
    useState<SubscriptionDetails | null>(null);

  const toggleRow = (subscriptionId: string) => {
    setExpandedRow(expandedRow === subscriptionId ? null : subscriptionId);
  };

  const openFlightDetails = (flight: any) => {
    setSelectedFlight(flight);
    setIsDialogOpen(true);
  };

  // Update the handleSingleUnsubscribe function to show confirmation first
  const handleSingleUnsubscribe = async (subscription: SubscriptionDetails) => {
    setConfirmingSubscription(subscription);
    setIsConfirmDialogOpen(true);
  };

  // Add a new function to actually perform the unsubscription after confirmation
  const confirmSingleUnsubscribe = async () => {
    if (!walletAddress || !confirmingSubscription) {
      toast.error("Wallet not connected or no subscription selected");
      return;
    }

    setIsUnsubscribing(confirmingSubscription.subscription._id);

    try {
      // Use the consolidated API method with arrays of length 1
      const success = await flightService.unsubscribeFlights(
        walletAddress,
        [confirmingSubscription.subscription.flightNumber],
        [confirmingSubscription.flight.carrierCode],
        [confirmingSubscription.subscription.departureAirport]
      );

      if (success) {
        toast.success("Successfully unsubscribed from flight");
        // Remove this subscription from the selected set
        onSubscriptionSelect(confirmingSubscription.subscription._id);

        // Refresh the subscription list
        onUnsubscribe();
      } else {
        toast.error("Failed to unsubscribe from flight");
      }
    } catch (error) {
      console.error("Error unsubscribing from flight:", error);
      toast.error("An error occurred while unsubscribing");
    } finally {
      setIsUnsubscribing(null);
      setIsConfirmDialogOpen(false);
      setConfirmingSubscription(null);
    }
  };

  const getStatusBadgeColor = (flight: any) => {
    if (flight.isCanceled) return "bg-red-500/20 text-red-500";
    if ((flight.departureDelayMinutes ?? 0) > 0)
      return "bg-yellow-500/20 text-yellow-500";

    switch (flight.statusCode) {
      case "NDPT":
        return "bg-blue-500/20 text-blue-500";
      case "OUT":
        return "bg-yellow-500/20 text-yellow-500";
      case "OFF":
        return "bg-blue-500/20 text-blue-500";
      case "ON":
        return "bg-purple-500/20 text-purple-500";
      case "IN":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  // Modify the getStatusText function to return uppercase status codes
  const getStatusText = (flight: any) => {
    if (flight.isCanceled) return "CNCL";
    if ((flight.departureDelayMinutes ?? 0) > 0)
      return `DELAYED ${flight.departureDelayMinutes} min`;

    // Use currentFlightStatus if available, otherwise use statusCode
    if (flight.currentFlightStatus) {
      return flight.currentFlightStatus.toUpperCase();
    }

    switch (flight.statusCode) {
      case "NDPT":
        return "NDPT";
      case "OUT":
        return "OUT";
      case "OFF":
        return "OFF";
      case "ON":
        return "ON";
      case "IN":
        return "IN";
      default:
        return "UNKNOWN";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return format(date, "h:mm a");
    } catch (error) {
      return "Invalid time";
    }
  };

  const copyTxHash = async (hash: string) => {
    if (!hash) return;

    await navigator.clipboard.writeText(hash);
    toast.success("Transaction hash copied to clipboard");
  };

  const formatTxHash = (hash: string) => {
    if (!hash) return "N/A";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 items-center">
        <div className="border-b-2 border-primary h-12 rounded-full w-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg w-full overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  aria-label="Select all subscriptions"
                />
              </TableHead>
              <TableHead className="hidden md:table-cell">Tx Hash</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead className="hidden md:table-cell">Sch Dep Dt</TableHead>
              <TableHead>Dep Stn</TableHead>
              <TableHead>Arr Stn</TableHead>
              <TableHead className="hidden md:table-cell">
                Subscribed On
              </TableHead>
              <TableHead>Status</TableHead>

              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <>
                  <TableRow
                    key={subscription.subscription._id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedSubscriptions.has(
                          subscription.subscription._id
                        )}
                        onCheckedChange={() =>
                          onSubscriptionSelect(subscription.subscription._id)
                        }
                        aria-label={`Select subscription ${subscription.subscription._id}`}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {subscription.subscription.blockchainTxHash ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">
                                  {formatTxHash(
                                    subscription.subscription.blockchainTxHash
                                  )}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyTxHash(
                                      subscription.subscription.blockchainTxHash
                                    );
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <a
                                  href={`https://columbus.caminoscan.com/tx/${subscription.subscription.blockchainTxHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Blockchain Transaction Hash</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex gap-2 items-center">
                        <Plane className="h-4 text-primary w-4" />
                        {subscription?.flight?.carrierCode}{" "}
                        {subscription?.flight?.flightNumber}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex gap-2 items-center">
                        <Calendar className="h-4 text-muted-foreground w-4" />
                        {formatDate(
                          subscription?.flight?.scheduledDepartureDate
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <span className="font-medium">
                          {subscription?.flight?.departureAirport}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <span className="font-medium">
                          {subscription?.flight?.arrivalAirport}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex gap-2 items-center">
                        <Clock className="h-4 text-muted-foreground w-4" />
                        {formatDate(
                          subscription?.subscription?.subscriptionDate
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeColor(
                          subscription?.flight
                        )} p-2 px-4 text-md`}
                      >
                        {getStatusText(subscription?.flight)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleSingleUnsubscribe(subscription)}
                          disabled={
                            isUnsubscribing === subscription?.subscription._id
                          }
                        >
                          {isUnsubscribing ===
                          subscription?.subscription._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Unsubscribe"
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 p-0 w-8"
                        onClick={() =>
                          toggleRow(subscription?.subscription._id)
                        }
                      >
                        {expandedRow === subscription.subscription._id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRow === subscription?.subscription?._id && (
                    <TableRow
                      key={`${subscription?.subscription?._id}-expanded`}
                    >
                      <TableCell colSpan={10} className="bg-muted/20 p-0">
                        <div className="p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">
                                Departure
                              </h4>
                              <div className="grid grid-cols-2 text-sm gap-2">
                                <div className="text-muted-foreground">
                                  Airport:
                                </div>
                                <div>
                                  {subscription.flight.departureAirport ||
                                    "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  City:
                                </div>
                                <div>
                                  {subscription.flight.departureCity || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Terminal:
                                </div>
                                <div>
                                  {subscription.flight.departureTerminal ||
                                    "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Gate:
                                </div>
                                <div>
                                  {subscription.flight.departureGate || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Scheduled:
                                </div>
                                <div>
                                  {formatTime(
                                    subscription.flight
                                      .scheduledDepartureUTCDateTime
                                  ) || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Status:
                                </div>
                                <div>
                                  {subscription.flight.departureStatus || "TBD"}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Arrival</h4>
                              <div className="grid grid-cols-2 text-sm gap-2">
                                <div className="text-muted-foreground">
                                  Airport:
                                </div>
                                <div>
                                  {subscription.flight.arrivalAirport || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  City:
                                </div>
                                <div>
                                  {subscription.flight.arrivalCity || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Terminal:
                                </div>
                                <div>
                                  {subscription.flight.arrivalTerminal || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Gate:
                                </div>
                                <div>
                                  {subscription.flight.arrivalGate || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Scheduled:
                                </div>
                                <div>
                                  {formatTime(
                                    subscription.flight
                                      .scheduledArrivalUTCDateTime
                                  ) || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Status:
                                </div>
                                <div>
                                  {subscription.flight.arrivalStatus || "TBD"}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">
                                Subscription Details
                              </h4>
                              <div className="grid grid-cols-2 text-sm gap-2">
                                <div className="text-muted-foreground">
                                  Subscribed On:
                                </div>
                                <div>
                                  {formatDate(
                                    subscription.subscription.subscriptionDate
                                  ) || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Status:
                                </div>
                                <div>
                                  <Badge
                                    variant="outline"
                                    className="bg-green-500/20 text-green-500"
                                  >
                                    {subscription.subscription
                                      .isSubscriptionActive
                                      ? "Active"
                                      : "Inactive"}
                                  </Badge>
                                </div>
                                <div className="text-muted-foreground">
                                  Carrier:
                                </div>
                                <div>
                                  {subscription.flight.operatingAirline ||
                                    "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Aircraft:
                                </div>
                                <div>
                                  {subscription.flight.equipmentModel || "TBD"}
                                </div>
                                <div className="text-muted-foreground">
                                  Flight Status:
                                </div>
                                <div>
                                  <Badge
                                    variant="outline"
                                    className={`${getStatusBadgeColor(
                                      subscription.flight
                                    )}`}
                                  >
                                    {getStatusText(subscription.flight)}
                                  </Badge>
                                </div>
                                {subscription.flight.MarketedFlightSegment &&
                                  subscription.flight.MarketedFlightSegment
                                    .length > 0 && (
                                    <>
                                      <div className="text-muted-foreground col-span-2 mt-2 font-semibold">
                                        Codeshare Details:
                                      </div>
                                      {subscription.flight.MarketedFlightSegment.map(
                                        (segment: any, idx: number) => (
                                          <React.Fragment key={idx}>
                                            <div className="text-muted-foreground pl-2">
                                              Airline:
                                            </div>
                                            <div>
                                              {segment.MarketingAirlineCode ||
                                                "TBD"}{" "}
                                              {segment.FlightNumber || "TBD"}
                                            </div>
                                          </React.Fragment>
                                        )
                                      )}
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button
                              onClick={() =>
                                openFlightDetails(subscription.flight)
                              }
                              className="gradient-border"
                            >
                              View Full Details
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No subscriptions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Flight Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <Plane className="h-5 w-5" />
              Flight {selectedFlight?.carrierCode}{" "}
              {selectedFlight?.flightNumber} Status
            </DialogTitle>
          </DialogHeader>
          {selectedFlight && <FlightStatusView flightData={selectedFlight} />}
        </DialogContent>
      </Dialog>

      {/* Single Flight Unsubscribe Confirmation Dialog */}
      {isConfirmDialogOpen && confirmingSubscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Unsubscription</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to unsubscribe from flight{" "}
              {confirmingSubscription.flight.carrierCode}{" "}
              {confirmingSubscription.flight.flightNumber}?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                  setConfirmingSubscription(null);
                }}
                disabled={
                  isUnsubscribing === confirmingSubscription.subscription._id
                }
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmSingleUnsubscribe}
                disabled={
                  isUnsubscribing === confirmingSubscription.subscription._id
                }
              >
                {isUnsubscribing === confirmingSubscription.subscription._id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unsubscribing...
                  </>
                ) : (
                  "Unsubscribe"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
