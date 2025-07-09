import { ExtendedFlightPhase } from "@/components/flight-status-view"
import { FlightPhase } from "@/types/flight"

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
      return "bg-blue-500/20 text-blue-500"
    case "out":
      return "bg-yellow-500/20 text-yellow-500"
    case "off":
      return "bg-blue-500/20 text-blue-500"
    case "on":
      return "bg-purple-500/20 text-purple-500"
    case "in":
      return "bg-green-500/20 text-green-500"
    case "cncl":
      return "bg-red-500/20 text-red-500"
    default:
      return "bg-muted/20 text-muted-foreground"
  }
}

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
    OT: "On Time",
  }

  // If we have a mapping, use it
  if (stateMap[code]) {
    return stateMap[code]
  }

  // For other values, return as is
  return code || ""
}

export function convertTo12Hour(time24: string | undefined) {
  if (!time24) return "TBD"
  const [hours, minutes, seconds] = time24.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hours12 = hours % 12 || 12 // Convert 0 to 12 for midnight
  return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`
}

export const getDepartureStateColor = (state: string): string => {
  if (!state) return "bg-gray-200 text-gray-700"
  const stateLower = state.toLowerCase()
  if (stateLower.includes("delayed") || stateLower === "dly") return "bg-orange-100 text-orange-800"
  if (stateLower.includes("cancelled") || stateLower === "cnl") return "bg-red-100 text-red-800"
  if (stateLower.includes("pending") || stateLower === "pnd") return "bg-yellow-100 text-yellow-800"
  if (stateLower.includes("rerouted") || stateLower === "div")
    return "bg-purple-100 text-purple-800"
  if (stateLower.includes("extra stop") || stateLower === "xsp") return "bg-blue-100 text-blue-800"
  if (stateLower.includes("cancelled") || stateLower === "nsp") return "bg-red-100 text-red-800"
  if (stateLower.includes("unavailable") || stateLower === "lck") return "bg-gray-100 text-gray-800"
  if (stateLower.includes("on time") || stateLower === "ont") return "bg-green-100 text-green-800"
  return "bg-gray-100 text-gray-800"
}

export const getArrivalStateColor = (state: string): string => {
  if (!state) return "bg-gray-200 text-gray-700"
  const stateLower = state.toLowerCase()
  if (stateLower.includes("early") || stateLower === "erl") return "bg-green-100 text-green-800"
  if (stateLower.includes("delayed") || stateLower === "dly") return "bg-orange-100 text-orange-800"
  if (stateLower.includes("cancelled") || stateLower === "cnl") return "bg-red-100 text-red-800"
  if (stateLower.includes("pending") || stateLower === "pnd") return "bg-yellow-100 text-yellow-800"
  if (stateLower.includes("rerouted") || stateLower === "dvt")
    return "bg-purple-100 text-purple-800"
  if (stateLower.includes("extra stop") || stateLower === "xst") return "bg-blue-100 text-blue-800"
  if (stateLower.includes("cancelled") || stateLower === "nst") return "bg-red-100 text-red-800"
  if (stateLower.includes("unavailable") || stateLower === "lck") return "bg-gray-100 text-gray-800"
  if (stateLower.includes("on time") || stateLower === "ont") return "bg-green-100 text-green-800"
  return "bg-gray-100 text-gray-800"
}

export function mapStatusCodeToPhase(legStatus: string): ExtendedFlightPhase {
  switch (legStatus) {
    case "NDPT":
    case "Scheduled":
      return "ndpt"
    case "OUT":
    case "Departed":
      return "out"
    case "OFF":
    case "InFlight":
      return "off"
    case "ON":
    case "Landing":
      return "on"
    case "IN":
    case "Arrived":
      return "in"
    case "CNCL":
    case "Cancelled":
      return "cncl"
    default:
      return "ndpt"
  }
}

export const getStatusDisplay = (statusCode: string, isArrival = false) => {
  const code = statusCode?.toUpperCase()

  if (isArrival) {
    // Arrival status mapping
    switch (code) {
      case "ERL":
        return { text: "Early", color: "bg-blue-500/20 text-blue-500" }
      case "DLY":
        return { text: "Delayed", color: "bg-amber-500/20 text-amber-500" }
      case "CNL":
        return { text: "Cancelled", color: "bg-red-500/20 text-red-500" }
      case "PND":
        return { text: "Pending", color: "bg-yellow-500/20 text-yellow-500" }
      case "DVT":
        return { text: "Rerouted", color: "bg-purple-500/20 text-purple-500" }
      case "XST":
        return { text: "Extra Stop", color: "bg-orange-500/20 text-orange-500" }
      case "NST":
        return { text: "Cancelled", color: "bg-red-500/20 text-red-500" }
      case "LCK":
        return { text: "Unavailable", color: "bg-gray-500/20 text-gray-500" }
      case "ONT":
      default:
        return { text: "On Time", color: "bg-green-500/20 text-green-500" }
    }
  } else {
    // Departure status mapping
    switch (code) {
      case "DLY":
        return { text: "Delayed", color: "bg-amber-500/20 text-amber-500" }
      case "CNL":
        return { text: "Cancelled", color: "bg-red-500/20 text-red-500" }
      case "PND":
        return { text: "Pending", color: "bg-yellow-500/20 text-yellow-500" }
      case "DIV":
        return { text: "Rerouted", color: "bg-purple-500/20 text-purple-500" }
      case "XSP":
        return { text: "Extra Stop", color: "bg-orange-500/20 text-orange-500" }
      case "NSP":
        return { text: "Cancelled", color: "bg-red-500/20 text-red-500" }
      case "LCK":
        return { text: "Unavailable", color: "bg-gray-500/20 text-gray-500" }
      case "ONT":
      default:
        return { text: "On Time", color: "bg-green-500/20 text-green-500" }
    }
  }
}
