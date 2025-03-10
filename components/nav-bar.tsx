"use client";
import { useEffect, useState } from "react";
import { Plane, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WalletInfo } from "./wallet-info";
import { useWeb3 } from "@/contexts/web3-context";

interface NavBarProps {
  lastInteractionTime?: number;
  onRefresh?: () => void;
  contractCallCount: number;
}

export function NavBar({
  lastInteractionTime,
  onRefresh,
  contractCallCount,
}: NavBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUTCTime, setCurrentUTCTime] = useState<string>("");
  const { walletAddress } = useWeb3();

  const getOffset = (tz: string) => {
    const offsetObject = Intl.DateTimeFormat("ia", {
      timeZoneName: "shortOffset",
      timeZone: tz,
    })
      .formatToParts()
      .find((i) => i.type === "timeZoneName");

    if (offsetObject && offsetObject.value) {
      const offsetValue = offsetObject.value;
      if (!offsetValue.includes(":")) {
        return offsetValue.replace(/GMT([+-]\d+)/, "GMT$1:00").slice(3);
      }
      return offsetValue.slice(3);
    }
    return "+00:00"; // Default to UTC if offset cannot be determined
  };

  const formatDateTime = (timestamp: number | undefined) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds} UTC`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentUTCTime(formatDateTime(now.getTime()));
    };

    updateTime(); // Initial update
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []); // Removed formatDateTime from dependencies

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <Plane className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              GoTravelX
            </span>
          </motion.div>

          {/* UTC Time and Contract Interaction Stats */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">
                      {formatDateTime(lastInteractionTime)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last contract interaction (UTC)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="relative"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    <span className="sr-only">Refresh data</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh flight data</p>
                </TooltipContent>
                <WalletInfo address={walletAddress} />
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
