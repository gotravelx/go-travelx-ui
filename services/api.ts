import type {
  AirportSearchResponse,
  FlightData,
  FlightSubscriptionRequest,
  SubscriptionDetails,
} from "@/types/flight"
import { contractService } from "./contract-service"
import { mapStatusCodeToPhase } from "@/utils/common"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
const WALLET_ADDRESS = contractService.getWalletAddress()

export const flightService = {
  searchAirportCodes: async (
  ): Promise<AirportSearchResponse> => {
    try {
      

      const response = await fetch(`${BASE_URL}/v1/airport-codes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("Error searching airport codes:", error)
      throw error
    }
  },

  searchFlight: async (
    carrierCode: string,
    flightNumber: string,
    departureStation: string,
    arrivalStation: string,
    departureDate: Date,
  ): Promise<FlightData> => {
    try {
      console.log(
        `Fetching flight details for ${carrierCode} ${flightNumber} ${departureStation} to ${arrivalStation} on ${departureDate.toISOString()}`,
      )

      const response = await fetch(
        `${BASE_URL}/v1/flights/get-flight-status/${flightNumber}?departureDate=${
          departureDate.toISOString().split("T")[0]
        }&departure=${departureStation}&arrival=${arrivalStation}&includeFullData=false`,
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Flight data from API:", data)

      // Transform the API response to match FlightData interface
      if (data.success && data.flightInfo) {
        const flightInfo = data.flightInfo

        const transformedData: FlightData = {
          flightNumber: flightInfo.flightNumber,
          scheduledDepartureDate: flightInfo.departureDate,
          carrierCode: flightInfo.airline?.code || carrierCode,
          operatingAirline: flightInfo.airline?.name || "",
          estimatedArrivalUTC: flightInfo.times?.estimatedArrival || "",
          estimatedDepartureUTC: flightInfo.times?.estimatedDeparture || "",
          arrivalAirport: flightInfo.arrivalAirport?.code || "",
          departureAirport: flightInfo.departureAirport?.code || "",
          arrivalCity: flightInfo.arrivalAirport?.city || "",
          departureCity: flightInfo.departureAirport?.city || "",
          departureGate: flightInfo.departureAirport?.departureGate || "",
          arrivalGate: flightInfo.arrivalAirport?.arrivalGate || "",
          statusCode: mapStatusCodeToPhase(flightInfo.status?.legStatus || flightInfo.statusCode),
          flightStatus: flightInfo.flightStatus || flightInfo.status?.current || "",
          equipmentModel: flightInfo.equipmentModel || flightInfo.aircraft?.model || "",
          departureTerminal: flightInfo.departureAirport?.departureTerminal || "",
          arrivalTerminal: flightInfo.arrivalAirport?.arrivalTerminal || "",
          actualDepartureUTC: flightInfo.times?.actualDeparture || "",
          actualArrivalUTC: flightInfo.times?.actualArrival || "",
          outTimeUTC: flightInfo.times?.outTime || "",
          offTimeUTC: flightInfo.times?.offTime || "",
          onTimeUTC: flightInfo.times?.onTime || "",
          inTimeUTC: flightInfo.times?.inTime || "",
          baggageClaim: flightInfo.baggageClaim || "",
          departureDelayMinutes: flightInfo.delays?.departureDelayMinutes || 0,
          arrivalDelayMinutes: flightInfo.delays?.arrivalDelayMinutes || 0,
          boardingTime: flightInfo?.times?.boardTime || "",
          isCanceled: flightInfo.isCanceled || false,
          scheduledArrivalUTCDateTime: flightInfo.times?.scheduledArrival || "",
          scheduledDepartureUTCDateTime: flightInfo.times?.scheduledDeparture || "",
          departureState: flightInfo.status?.departureStatus || "",
          arrivalState: flightInfo.status?.arrivalStatus || "",
          marketedFlightSegment: flightInfo.marketedFlightSegment || [],
          currentFlightStatus: flightInfo.status?.current || "",
          isSubscribed: flightInfo.isSubscribed || false,
          blockchainTxHash: "",
          MarketedFlightSegment: flightInfo.marketedFlightSegment || [],
        }

        return transformedData
      } else {
        throw new Error("Invalid API response structure")
      }
    } catch (error) {
      console.error("Error fetching flight details:", error)
      throw error
    }
  },

  viewFlightDetails: async (carrierCode: string, flightNumber: string, departureDate: Date): Promise<FlightData> => {
    try {
      console.log(`Fetching flight details for ${carrierCode} ${flightNumber} on ${departureDate.toISOString()}`)

      const response = await fetch(`${BASE_URL}/flights/get-flight-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightNumber,
          scheduledDepartureDate: departureDate.toISOString().split("T")[0],
          carrierCode,
          walletAddress: WALLET_ADDRESS,
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

  subscribeToFlight: async (data: FlightSubscriptionRequest): Promise<any> => {
    try {
      console.log("Subscribing to flight with data:", data)

      const requestBody = {
        flightNumber: data.flightNumber,
        departureDate: data.scheduledDepartureDate,
        carrierCode: data.carrierCode,
        departureAirport: data.departureAirport,
        arrivalAirport: data.arrivalAirport,
      }

      console.log("Request body:", requestBody)

      const response = await fetch(`${BASE_URL}/v1/subscription/add-flight-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log("Subscription response:", result)

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error("Error subscribing to flight:", error)
      throw error
    }
  },

  getSubscribedFlights: async (): Promise<FlightData[]> => {
    try {
      const response = await fetch(`${BASE_URL}/flights/get-all-flights`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Subscribed flights data:", data)

      // Check if the response has the expected structure
      if (!data.success || !data.flights || !Array.isArray(data.flights)) {
        console.error("Invalid API response structure:", data)
        return []
      }

      // Transform the API response to match our FlightData interface
      return data.flights.map((flight: any) => {
        return {
          flightNumber: (flight.flightNumber || "").toString(),
          scheduledDepartureDate: flight.times?.scheduledDeparture ? flight.times.scheduledDeparture.split("T")[0] : "",
          carrierCode: flight.airline?.code || "UA", // Default to UA if not provided
          operatingAirline: flight.airline?.name || "",
          estimatedArrivalUTC: flight.times?.estimatedArrival || "",
          estimatedDepartureUTC: flight.times?.estimatedDeparture || "",
          arrivalAirport: flight.arrivalAirport?.code || "",
          departureAirport: flight.departureAirport?.code || "",
          arrivalCity: flight.arrivalAirport?.city || "",
          departureCity: flight.departureAirport?.city || "",
          departureGate: flight.departureAirport?.departureGate || "",
          arrivalGate: flight.arrivalAirport?.arrivalGate || "",
          statusCode: mapStatusCodeToPhase(flight.status?.legStatus || "NDPT"),
          flightStatus: flight.status?.current || "",
          equipmentModel: flight.aircraft?.model || flight.equipmentModel || "",
          departureTerminal: flight.departureAirport?.departureTerminal || "",
          arrivalTerminal: flight.arrivalAirport?.arrivalTerminal || "",
          actualDepartureUTC: flight.times?.actualDeparture || "",
          actualArrivalUTC: flight.times?.actualArrival || "",
          baggageClaim: flight.baggageClaim || "",
          departureDelayMinutes: flight.delays?.estimatedDepartureDelayMinutes || 0,
          arrivalDelayMinutes: flight.delays?.estimatedArrivalDelayMinutes || 0,
          boardingTime: flight.times?.boardTime || "",
          isCanceled: flight.isCanceled || false,
          scheduledArrivalUTCDateTime: flight.times?.scheduledArrival || "",
          scheduledDepartureUTCDateTime: flight.times?.scheduledDeparture || "",
          outTimeUTC: flight.times?.outTime || "",
          offTimeUTC: flight.times?.offTime || "",
          onTimeUTC: flight.times?.onTime || "",
          inTimeUTC: flight.times?.inTime || "",
          departureState: flight.status?.departureStatus || "",
          arrivalState: flight.status?.arrivalStatus || "",
          currentFlightStatus: flight.status?.current || "",
          isSubscribed: true,
          blockchainTxHash: flight.blockchainTxHash || "",
          marketedFlightSegment: flight.marketedFlightSegment || [],
          MarketedFlightSegment: flight.marketedFlightSegment || [],
        }
      })
    } catch (error) {
      console.error("Error fetching subscribed flights:", error)
      return []
    }
  },

  getSubscribedFlightsDetails: async (): Promise<SubscriptionDetails[]> => {
    try {
      console.log(`Fetching subscribed flights details for wallet: ${WALLET_ADDRESS}`)

      const response = await fetch(`${BASE_URL}/flights/subscribed-flights-details/${WALLET_ADDRESS}`)

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

      const response = await fetch(`${BASE_URL}/flights/subscriptions/unsubscribe`, {
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
