import type { FlightData, SubscriptionDetails } from "@/types/flight"
import { getBaseUrl } from "@/utils/base_url"

// Add this constant at the top of the file
const API_BASE_URL = getBaseUrl()

// Hardcoded wallet address as requested
const WALLET_ADDRESS = "0x876474671AEe7AC87800A0B99e9e31A625cdF95F"

console.log("API BASE URL -->", API_BASE_URL)
// Add this interface to the top of the file with other interfaces

// API service for flight data
export const flightService = {
  searchFlight: async (
    carrierCode: string,
    flightNumber: string,
    departureStation: string,
    departureDate: Date,
  ): Promise<FlightData> => {
    try {
      console.log(
        `Fetching flight details for ${carrierCode} ${flightNumber} ${departureStation} on ${departureDate.toISOString()}`,
      )

      // Use hardcoded wallet address instead of getting from localStorage
      console.log(`Using wallet address: ${WALLET_ADDRESS}`)

      // Use the API to get flight data
      const response = await fetch(
        `${API_BASE_URL}/flights/get-flight-status/${flightNumber}?departureDate=${
          departureDate.toISOString().split("T")[0]
        }&departure=${departureStation}&walletAddress=${WALLET_ADDRESS}`,
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Flight data from API:", data.flightData)
      return data.flightData
    } catch (error) {
      console.error("Error fetching flight details:", error)
      throw error
    }
  },

  viewFlightDetails: async (
    carrierCode: string,
    flightNumber: string,
    departureDate: Date,
  ): Promise<FlightData> => {
    try {
      console.log(`Fetching flight details for ${carrierCode} ${flightNumber} on ${departureDate.toISOString()}`)

      const response = await fetch(`${API_BASE_URL}/flights/get-flight-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightNumber,
          scheduledDepartureDate: departureDate.toISOString().split("T")[0],
          carrierCode,
          walletAddress: WALLET_ADDRESS, // Use hardcoded wallet address
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error fetching flight details:", error)
      throw error
    }
  },

  subscribeToFlight: async (
    flightNumber: string,
    carrierCode: string,
    departureAirport: string,
    departureDate: string,
  ): Promise<string> => {
    try {
      console.log(`Subscribing to flight ${carrierCode}${flightNumber} from ${departureAirport} on ${departureDate}`)
      console.log(`Using wallet address: ${WALLET_ADDRESS}`)

      // No need to validate walletAddress since we're using hardcoded one
      if (!flightNumber || !carrierCode || !departureAirport || !departureDate) {
        const missingParams = {
          flightNumber: !flightNumber,
          carrierCode: !carrierCode,
          departureAirport: !departureAirport,
          departureDate: !departureDate,
        }
        console.error("Missing required parameters:", missingParams)
        throw new Error(`Missing required parameters: ${JSON.stringify(missingParams)}`)
      }

      const response = await fetch(`${API_BASE_URL}/flights/add-flight-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightNumber,
          scheduledDepartureDate: departureDate, // Ensure parameter name matches API
          carrierCode, // Added missing parameter
          departureAirport,
          walletAddress: WALLET_ADDRESS, // Use hardcoded wallet address
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `API error: ${response.status}`)
      }

      return data.subscriptionId || "success"
    } catch (error) {
      console.error("Error subscribing to flight:", error)
      throw error
    }
  },

  // New method to fetch subscribed flights
  getSubscribedFlights: async ( ): Promise<FlightData[]> => {
    try {
      console.log(`Fetching subscribed flights for wallet: ${WALLET_ADDRESS}`)

      const response = await fetch(`${API_BASE_URL}/flights/all-subscribed-flights/${WALLET_ADDRESS}`, {
        method: "GET",
        credentials: "include", // Ensure cookies are sent if needed
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Subscribed flights data:", data)

      // Transform the API response to match our FlightData interface if needed
      return data.map((flight: any) => ({
        flightNumber: flight.flightNumber.toString(),
        scheduledDepartureDate: flight.scheduledDepartureDate,
        carrierCode: flight.carrierCode,
        operatingAirline: flight.operatingAirline,
        estimatedArrivalUTC: flight.estimatedArrivalUTC,
        estimatedDepartureUTC: flight.estimatedDepartureUTC,
        arrivalAirport: flight.arrivalAirport,
        departureAirport: flight.departureAirport,
        arrivalCity: flight.arrivalCity,
        departureCity: flight.departureCity,
        departureGate: flight.departureGate,
        arrivalGate: flight.arrivalGate,
        statusCode: flight.statusCode,
        flightStatus: flight.flightStatus || flight.currentFlightStatus,
        equipmentModel: flight.equipmentModel,
        departureTerminal: flight.departureTerminal,
        arrivalTerminal: flight.arrivalTerminal,
        actualDepartureUTC: flight.actualDepartureUTC,
        actualArrivalUTC: flight.actualArrivalUTC,
        baggageClaim: flight.baggageClaim,
        departureDelayMinutes: flight.departureDelayMinutes,
        arrivalDelayMinutes: flight.arrivalDelayMinutes,
        boardingTime: flight.boardingTime,
        isCanceled: flight.isCanceled,
        scheduledArrivalUTCDateTime: flight.scheduledArrivalUTCDateTime,
        scheduledDepartureUTCDateTime: flight.scheduledDepartureUTCDateTime,
        outTimeUTC: flight.outTimeUTC,
        offTimeUTC: flight.offTimeUTC,
        onTimeUTC: flight.onTimeUTC,
        inTimeUTC: flight.inTimeUTC,
        departureState: flight.departureState,
        arrivalState: flight.arrivalState,
        currentFlightStatus: flight.currentFlightStatus,
        isSubscribed: true,
        blockchainTxHash: flight.blockchainTxHash,
        MarketedFlightSegment: flight.MarketedFlightSegment,
      }))
    } catch (error) {
      console.error("Error fetching subscribed flights:", error)
      return []
    }
  },

  // Add this method to the flightService object
  getSubscribedFlightsDetails: async ( ): Promise<SubscriptionDetails[]> => {
    try {
      console.log(`Fetching subscribed flights details for wallet: ${WALLET_ADDRESS}`)

      const response = await fetch(`${API_BASE_URL}/flights/subscribed-flights-details/${WALLET_ADDRESS}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Subscribed flights details:", data)

      if (!data.success || !data.data) {
        console.error("API returned unsuccessful response or no data")
        return []
      }

      return data.data
    } catch (error) {
      console.error("Error fetching subscribed flights details:", error)
      return []
    }
  },

  unsubscribeFlights: async (
    flightNumbers: string[],
    carrierCodes: string[],
    departureAirports: string[],
  ): Promise<boolean> => {
    try {
      console.log(`Unsubscribing from ${flightNumbers.length} flights for wallet: ${WALLET_ADDRESS}`)

      const response = await fetch(`${API_BASE_URL}/flights/subscriptions/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: WALLET_ADDRESS,
          flightNumbers,
          carrierCodes,
          departureAirports,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Unsubscribe response:", data)

      return data.success || false
    } catch (error) {
      console.error("Error unsubscribing from flights:", error)
      return false
    }
  },
}

export type { FlightData } from "@/types/flight"
export type { SubscriptionDetails } from "@/types/flight"
