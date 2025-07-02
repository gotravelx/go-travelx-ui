import type { AirportSearchResponse, FlightData, FlightSubscriptionRequest, SubscriptionDetails, SubscriptionResponse } from "@/types/flight";
import { contractService } from "./contract-service";
import { mapStatusCodeToPhase } from "@/utils/common";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const WALLET_ADDRESS = contractService.getWalletAddress();

export const flightService = {
  // New airport search function
  searchAirportCodes: async (
    query: string,
    limit = 10,
    sortBy = "code",
    order = "asc",
    searchType = "begins_with",
  ): Promise<AirportSearchResponse> => {
    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
        sortBy,
        order,
        searchType,
      })

      const response = await fetch(`${BASE_URL}/v1/airport-codes/search/airport-codes?${params}`, {
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
    departureDate: Date,
  ): Promise<FlightData> => {
    try {
      console.log(
        `Fetching flight details for ${carrierCode} ${flightNumber} ${departureStation} on ${departureDate.toISOString()}`,
      )

      console.log(`Using wallet address: ${WALLET_ADDRESS}`)

      const response = await fetch(
        `${BASE_URL}/flights/get-flight-status/${flightNumber}?departureDate=${
          departureDate.toISOString().split("T")[0]
        }&departure=${departureStation}&walletAddress=${WALLET_ADDRESS}&includeFullData=false`,
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Flight data from API:", data)

      // Transform the new API response to match FlightData interface
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
          departureGate: flightInfo.departureGate || "",
          arrivalGate: flightInfo.arrivalGate || "",
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
    console.log("Subscribing to flight with data:", data)

    const response = await fetch(`${BASE_URL}/v1/flights/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    console.log("Subscription response:", result)

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`)
    }

    return result
  },

  getSubscribedFlights: async (): Promise<FlightData[]> => {
    try {
      console.log(`Fetching subscribed flights for wallet: ${WALLET_ADDRESS}`)

      const response = await fetch(`${BASE_URL}/subscription/get-flight-subscriptions`, {
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

      // Transform the API response to match our FlightData interface
      return data.map((flight: any) => {
        // Handle both old format and new format
        const flightInfo = flight.flightInfo || flight

        return {
          flightNumber: (flightInfo.flightNumber || flight.flightNumber || "").toString(),
          scheduledDepartureDate: flightInfo.departureDate || flight.scheduledDepartureDate || "",
          carrierCode: flightInfo.airline?.code || flight.carrierCode || "",
          operatingAirline: flightInfo.airline?.name || flight.operatingAirline || "",
          estimatedArrivalUTC: flightInfo.times?.estimatedArrival || flight.estimatedArrivalUTC || "",
          estimatedDepartureUTC: flightInfo.times?.estimatedDeparture || flight.estimatedDepartureUTC || "",
          arrivalAirport: flightInfo.arrivalAirport?.code || flight.arrivalAirport || "",
          departureAirport: flightInfo.departureAirport?.code || flight.departureAirport || "",
          arrivalCity: flightInfo.arrivalAirport?.city || flight.arrivalCity || "",
          departureCity: flightInfo.departureAirport?.city || flight.departureCity || "",
          departureGate: flightInfo.departureGate || flight.departureGate || "",
          arrivalGate: flightInfo.arrivalGate || flight.arrivalGate || "",
          statusCode: mapStatusCodeToPhase(flightInfo.status?.legStatus || flightInfo.statusCode || flight.statusCode),
          flightStatus:
            flightInfo.flightStatus ||
            flightInfo.status?.current ||
            flight.flightStatus ||
            flight.currentFlightStatus ||
            "",
          equipmentModel: flightInfo.equipmentModel || flightInfo.aircraft?.model || flight.equipmentModel || "",
          departureTerminal: flightInfo.departureTerminal || flight.departureTerminal || "",
          arrivalTerminal: flightInfo.arrivalTerminal || flight.arrivalTerminal || "",
          actualDepartureUTC: flightInfo.times?.actualDeparture || flight.actualDepartureUTC || "",
          actualArrivalUTC: flightInfo.times?.actualArrival || flight.actualArrivalUTC || "",
          baggageClaim: flightInfo.baggageClaim || flight.baggageClaim || "",
          departureDelayMinutes: flightInfo.delays?.estimatedDepartureDelayMinutes || flight.departureDelayMinutes || 0,
          arrivalDelayMinutes: flightInfo.delays?.arrivalDelayMinutes || flight.arrivalDelayMinutes || 0,
          boardingTime: flightInfo.times?.boardTime || flight.boardingTime || "",
          isCanceled: flightInfo.isCanceled || flight.isCanceled || false,
          scheduledArrivalUTCDateTime: flightInfo.times?.scheduledArrival || flight.scheduledArrivalUTCDateTime || "",
          scheduledDepartureUTCDateTime:
            flightInfo.times?.scheduledDeparture || flight.scheduledDepartureUTCDateTime || "",
          outTimeUTC: flightInfo.times?.outTime || flight.outTimeUTC || "",
          offTimeUTC: flightInfo.times?.offTime || flight.offTimeUTC || "",
          onTimeUTC: flightInfo.times?.onTime || flight.onTimeUTC || "",
          inTimeUTC: flightInfo.times?.inTime || flight.inTimeUTC || "",
          departureState: flightInfo.departureAirport?.state || flight.departureState || "",
          arrivalState: flightInfo.arrivalAirport?.state || flight.arrivalState || "",
          currentFlightStatus: flightInfo.status?.current || flight.currentFlightStatus || "",
          isSubscribed: true,
          blockchainTxHash: flight.blockchainTxHash || "",
          marketedFlightSegment: flightInfo.marketedFlightSegment || flight.marketedFlightSegment || [],
          MarketedFlightSegment: flightInfo.marketedFlightSegment || flight.MarketedFlightSegment || [],
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
  // New function to get all flight subscriptions
  getFlightSubscriptions: async (): Promise<SubscriptionResponse> => {
    try {
      console.log(`Fetching all flight subscriptions for wallet: ${WALLET_ADDRESS}`)

      const response = await fetch(`${BASE_URL}/v1/subscription/get-flight-subscriptions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: SubscriptionResponse = await response.json()
      console.log("All flight subscriptions:", data)
      return data
    } catch (error) {
      console.error("Error fetching all flight subscriptions:", error)
      throw error
    }
  },
}


