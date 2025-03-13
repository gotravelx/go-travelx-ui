import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, Clock, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Web3Provider } from "@/contexts/web3-context";
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
import dynamic from "next/dynamic";

// Define the interface for SubscribedFlight
interface SubscribedFlight {
  id: string;
  flightNumber: string;
  carrier: string;
  departureCity: string;
  arrivalCity: string;
  subscriptionDate: Date;
  nextUpdateTime: Date;
}

// Create a client-side only component that uses the web3 context
const UnsubscribeFlightClient = dynamic(
  () => import("@/components/unsubscribe-flight-client"),
  { ssr: false }
);

// Server-side safe component
export default function UnsubscribeFlightPage() {
  return (
    <Web3Provider>
      <UnsubscribeFlightClient />
    </Web3Provider>
  );
}
