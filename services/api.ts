
import { FlightDetailsResponse, addFlightSubscriptionApi, viewSubscribedFlight } from "./flight-api"

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


// API service for flight data
export const flightService = {
  searchFlight: async (
    carrierCode: string,
    flightNumber: string,
    departureStation:string,
    departureDate: Date
  ): Promise<FlightData> => {
    try {
      console.log(`Fetching flight details for ${carrierCode} ${flightNumber}  ${departureStation} on ${departureDate.toISOString()}`);

      // Calling the API to fetch flight details
    const flightData = await addFlightSubscriptionApi({
        flightNumber,
        scheduledDepartureDate : departureDate.toISOString().split('T')[0],
        departureStation,
        carrierCode
      });

      return flightData;
    } catch (error) {
      console.error('Error fetching flight details:', error);
      throw error;
    }
  },

  viewFlightDetails: async (
    carrierCode: string,
    flightNumber: string,
    departureDate: Date
  ): Promise<FlightData> => {
    try {
      console.log(`Fetching flight details for ${carrierCode} ${flightNumber} on ${departureDate.toISOString()}`);

      // Calling the API to fetch flight details
    const flightData = await viewSubscribedFlight({
        flightNumber,
        scheduledDepartureDate: departureDate.toISOString().split('T')[0],
        carrierCode
      });

      return flightData;
    } catch (error) {
      console.error('Error fetching flight details:', error);
      throw error;
    }
  }
};