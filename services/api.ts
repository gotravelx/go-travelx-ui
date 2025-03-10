/**
 * Unified API service for flight data operations
 * This is the single source of truth for all API interactions
 */

import { format } from "date-fns"

// Types for flight data matching the contract structure
export interface FlightData {
  flightNumber: string  // key  Flight Number :   5300
  departureDate: string // key  exa : 2025-03-06
  carrierCode: string   // key  ex : UA
  operatingAirline:string
  estimatedArrivalUTC: string
  estimatedDepartureUTC: string
  arrivalAirport: string    // ex : LAS
  departureAirport:string   // ex : IAH
  arrivalCity: string
  departureCity: string
  departureGate: string
  arrivalGate: string
  flightStatus: string
  statusCode: string
  equipmentModel: string
  phase: FlightPhase
  departureTerminal?: string
  arrivalTerminal?: string
  actualDepartureUTC: string
  actualArrivalUTC: string
  outTimeUTC?: string
  offTimeUTC?: string
  onTimeUTC?: string
  inTimeUTC?: string
  baggageClaim?: string
  departureDelayMinutes?: number
  arrivalDelayMinutes?: number
  boardingTime?: string
  isCanceled: boolean
  scheduledArrivalUTCDateTime: string,
  scheduledDepartureUTCDateTime: string,

}

export type FlightPhase = "not_departed" | "out" | "off" | "on" | "in"
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

const mockFlightData: FlightData = {
  flightNumber: "2339",
  departureDate: "2025-03-05",
  carrierCode: "UA",
  operatingAirline:"OO-SkyWest Airlines",
  estimatedArrivalUTC: "2025-03-06T04:13:00",
  estimatedDepartureUTC: "2025-03-06T00:27:00",
  actualDepartureUTC: "2025-03-06T00:27:00",
  actualArrivalUTC: "2025-03-06T04:11:00",
  scheduledArrivalUTCDateTime: "2025-03-06T04:03:00",
  scheduledDepartureUTCDateTime: "2025-03-06T00:27:00",
  arrivalAirport: "LAS",
  departureAirport: "IAH",
  arrivalCity: "Las Vegas",
  departureCity: "Houston",
  departureGate: "C12",
  arrivalGate: "B8",
  flightStatus: "Arrived at Gate",
  statusCode: "IN",
  equipmentModel: "Boeing 737",
  phase: "in",
  departureTerminal: "C",
  arrivalTerminal: "Concourse D",
  outTimeUTC: "2025-03-05T18:27:00",
  offTimeUTC: "2025-03-06T00:58:00",
  onTimeUTC: "2025-03-06T04:05:00",
  inTimeUTC: "2025-03-06T04:11:00",
  baggageClaim: "5",
  departureDelayMinutes: 0,
  arrivalDelayMinutes: 8,
  boardingTime: "17:47:00",
  isCanceled: false,
  
};


// API service for flight data
export const flightService = {
  searchFlight: async (
    carrier: string,
    flightNumber: string,
    date: Date
  ): Promise<FlightData> => {
    console.log(
      `Searching flight: ${carrier}${flightNumber} on ${format(date, "yyyy-MM-dd")}`
    );
    return mockFlightData ;
  },

  viewFlightDetails: async (
    carrier: string,
    flightNumber: string,
    date: Date
  ): Promise<FlightData> => {
    console.log(
      `Viewing flight details: ${carrier}${flightNumber} on ${format(date, "yyyy-MM-dd")}`
    );
    return mockFlightData;
  },
};