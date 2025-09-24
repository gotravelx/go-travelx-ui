import type {
  AirportSearchResponse,
  FlightData,
  FlightSubscriptionRequest,
  SubscriptionDetails,
  GetFlightSubscriptionsApiResponse,
} from "@/types/flight"
import { mapStatusCodeToPhase } from "@/utils/common"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

class FlightService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  searchAirportCodes = async (): Promise<AirportSearchResponse> => {
    try {

      const response = await fetch(`${this.baseUrl}/airport-codes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Airport codes response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Airport codes response:", data)
      return data
    } catch (error) {
      console.error("Error searching airport codes:", error)
      throw error
    }
  }

  searchFlight = async (
    carrierCode: string,
    flightNumber: string,
    departureStation: string,
    arrivalStation: string,
    departureDate: Date,
  ): Promise<FlightData> => {
    try {
      // console.log(
      //   `Fetching flight details for ${carrierCode} ${flightNumber} ${departureStation} to ${arrivalStation} on ${departureDate.toISOString()}`,
      // )

      const response = await fetch(
        `${this.baseUrl}/flights/get-flight-status/${flightNumber}?departureDate=${
          departureDate.toISOString().split("T")[0]
        }&departure=${departureStation}&arrival=${arrivalStation}&includeFullData=false`,
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

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
          plannedDuration: flightInfo.duration?.planned || "",
          actualDuration: flightInfo.duration?.actual || "",
          scheduledDuration: flightInfo.duration?.scheduled || "",
        }

        return transformedData
      } else {
        throw new Error("Invalid API response structure")
      }
    } catch (error) {
      console.error("Error fetching flight details:", error)
      throw error
    }
  }

  subscribeToFlight = async (data: FlightSubscriptionRequest): Promise<any> => {
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

      const response = await fetch(`${this.baseUrl}/subscription/add-flight-subscription`, {
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
  }

  getSubscribedFlights = async (): Promise<FlightData[]> => {
    try {
      const response = await fetch(`${this.baseUrl}/flights/get-all-flights`, {
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
          scheduledDepartureDate: flight.departureDate || flight.times?.scheduledDeparture?.split("T")[0] || "",
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
          departureDelayMinutes: flight.delays?.departureDelayMinutes || 0,
          arrivalDelayMinutes: flight.delays?.arrivalDelayMinutes || 0,
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
          blockchainTxHash: flight.blockchainHashKey || "",
          marketedFlightSegment: flight.marketedFlightSegment || [],
          MarketedFlightSegment: flight.marketedFlightSegment || [],
        }
      })
    } catch (error) {
      console.error("Error fetching subscribed flights:", error)
      return []
    }
  }

  getSubscribedFlightsDetails = async (): Promise<SubscriptionDetails[]> => {
    try {

      const response = await fetch(`${this.baseUrl}/subscription/get-flight-subscriptions`, {
        
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch subscribed flights")
      }

      const data: GetFlightSubscriptionsApiResponse = await response.json()
      console.log("Subscribed flights details API response:", data)

      if (data.success && data.subscriptions) {
        return data.subscriptions.map((apiSub: any) => {
          // Map the flat API response object into the nested SubscriptionDetails structure
          const flightData: FlightData = {
            flightNumber: apiSub.flightNumber,
            scheduledDepartureDate: apiSub.departureDate,
            carrierCode: apiSub.carrierCode,
            operatingAirline: apiSub.airline.name,
            estimatedArrivalUTC: apiSub.times.estimatedArrival,
            estimatedDepartureUTC: apiSub.times.estimatedDeparture,
            arrivalAirport: apiSub.arrivalAirport.code,
            departureAirport: apiSub.departureAirport.code,
            arrivalCity: apiSub.departureAirport.city,
            departureCity: apiSub.arrivalAirport.city,
            departureGate: apiSub.departureAirport.departureGate,
            arrivalGate: apiSub.arrivalAirport.arrivalGate,
            statusCode: mapStatusCodeToPhase(apiSub.status.legStatus || apiSub.status.code),
            flightStatus: apiSub.status.current,
            equipmentModel: apiSub.aircraft.model,
            departureTerminal: apiSub.departureAirport.departureTerminal,
            arrivalTerminal: apiSub.arrivalAirport.arrivalTerminal,
            actualDepartureUTC: apiSub.times.actualDeparture,
            actualArrivalUTC: apiSub.times.actualArrival,
            outTimeUTC: apiSub.times.outTime,
            offTimeUTC: apiSub.times.offTime,
            onTimeUTC: apiSub.times.onTime,
            inTimeUTC: apiSub.times.inTime,
            baggageClaim: apiSub.baggageClaim,
            departureDelayMinutes: apiSub.delays.departureDelayMinutes,
            arrivalDelayMinutes: apiSub.delays.arrivalDelayMinutes,
            boardingTime: apiSub.times.boardTime,
            isCanceled: apiSub.isCanceled,
            scheduledArrivalUTCDateTime: apiSub.times.scheduledArrival,
            scheduledDepartureUTCDateTime: apiSub.times.scheduledDeparture,
            departureState: apiSub.status.departureStatus,
            arrivalState: apiSub.status.arrivalStatus,
            marketedFlightSegment: apiSub.MarketedFlightSegment || [],
            currentFlightStatus: apiSub.status.current,
            isSubscribed: true, // Assuming if it's in this list, it's subscribed
            blockchainTxHash: apiSub.blockchainHashKey,
            MarketedFlightSegment: apiSub.MarketedFlightSegment || [],
            plannedDuration: apiSub.duration.planned,
            actualDuration: apiSub.duration.actual,
            scheduledDuration: apiSub.duration.scheduled, 
          }

          return {
            subscription: {
              _id: apiSub._id || "", // Add _id from apiSub, fallback to empty string if missing
              flightNumber: apiSub.flightNumber,
              departureAirport: apiSub.departureAirport.code, // Just the code
              arrivalAirport: apiSub.arrivalAirport.code, // Just the code
              blockchainTxHash: apiSub.blockchainTxHash,
              flightSubscriptionStatus: apiSub.status.current, // Assuming this maps
              isSubscriptionActive: true, // Assuming active if returned
              subscriptionDate: apiSub.subscriptionDate,
              createdAt: apiSub.subscriptionDate, // Using subscriptionDate as placeholder
              updatedAt: apiSub.subscriptionDate, // Using subscriptionDate as placeholder
            },
            flight: flightData,
          }
        })
      }
      return []
    } catch (error) {
      console.error("Error in getSubscribedFlightsDetails:", error)
      throw error
    }
  }

  unsubscribeFlights = async (flightNumbers: string[],carrierCodes:string[],departureAirports: string[],arrivalAirports:string[]): Promise<boolean> => {
    try {
      console.log(`Unsubscribing from ${flightNumbers.length} flights`)

      const response = await fetch(`${this.baseUrl}/subscription/unsubscribe-flight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightNumbers,
          carrierCodes,
          departureAirports,
          arrivalAirports,
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
  }
}

export const flightService = new FlightService(BASE_URL)
