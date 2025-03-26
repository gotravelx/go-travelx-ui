import { FlightPhase } from "@/types/flight";
import { useCallback } from "react";

/**
 * Converts UTC time to local time based on timezone
 * @param utcTimeString - UTC time string
 * @param timezone - Timezone to convert to
 * @returns string - Formatted local time
 */
export function convertUTCToLocal(utcTimeString: string, timezone = "America/New_York"): string {
  try {
    const date = new Date(utcTimeString)
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  } catch (error) {
    console.error("Error converting UTC to local time:", error)
    return "Time not available"
  }
}



  export const getStatusBadgeColor = (phase: FlightPhase) => {
    switch (phase) {
      case "ndpt":
        return "bg-blue-500/20 text-blue-500";
      case "out":
        return "bg-yellow-500/20 text-yellow-500";
      case "off":
        return "bg-blue-500/20 text-blue-500";
      case "on":
        return "bg-purple-500/20 text-purple-500";
      case "in":
        return "bg-green-500/20 text-green-500";
      case "cncl":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

 
