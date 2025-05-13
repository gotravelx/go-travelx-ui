import { FlightPhase } from "@/types/flight";

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


  export const mapArrivalStateCodeToText = (code: string): string => {
  const stateMap: Record<string, string> = {
    ERL: "Early",
    DLY: "Delayed",
    CNL: "Cancelled",
    PND: "Pending",
    DVT: "Rerouted",
    XST: "Extra Stop",
    NST: "Cancelled",
    LCK: "Unavailable",
    ONT: "On Time",
  };

  // If we have a mapping, use it
  if (stateMap[code]) {
    return stateMap[code];
  }

  // For other values, return as is
  return code || "";
};


export const getDepartureStateColor = (state: string): string => {
  if (!state) return "bg-gray-200 text-gray-700";
  const stateLower = state.toLowerCase();
  if (stateLower.includes("delayed") || stateLower === "dly")
    return "bg-orange-100 text-orange-800";
  if (stateLower.includes("cancelled") || stateLower === "cnl")
    return "bg-red-100 text-red-800";
  if (stateLower.includes("pending") || stateLower === "pnd")
    return "bg-yellow-100 text-yellow-800";
  if (stateLower.includes("rerouted") || stateLower === "div")
    return "bg-purple-100 text-purple-800";
  if (stateLower.includes("extra stop") || stateLower === "xsp")
    return "bg-blue-100 text-blue-800";
  if (stateLower.includes("cancelled") || stateLower === "nsp")
    return "bg-red-100 text-red-800";
  if (stateLower.includes("unavailable") || stateLower === "lck")
    return "bg-gray-100 text-gray-800";
  if (stateLower.includes("on time") || stateLower === "ont")
    return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

 export const getArrivalStateColor = (state: string): string => {
  if (!state) return "bg-gray-200 text-gray-700";
  const stateLower = state.toLowerCase();
  if (stateLower.includes("early") || stateLower === "erl")
    return "bg-green-100 text-green-800";
  if (stateLower.includes("delayed") || stateLower === "dly")
    return "bg-orange-100 text-orange-800";
  if (stateLower.includes("cancelled") || stateLower === "cnl")
    return "bg-red-100 text-red-800";
  if (stateLower.includes("pending") || stateLower === "pnd")
    return "bg-yellow-100 text-yellow-800";
  if (stateLower.includes("rerouted") || stateLower === "dvt")
    return "bg-purple-100 text-purple-800";
  if (stateLower.includes("extra stop") || stateLower === "xst")
    return "bg-blue-100 text-blue-800";
  if (stateLower.includes("cancelled") || stateLower === "nst")
    return "bg-red-100 text-red-800";
  if (stateLower.includes("unavailable") || stateLower === "lck")
    return "bg-gray-100 text-gray-800";
  if (stateLower.includes("on time") || stateLower === "ont")
    return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

