/**
 * Unified API service for flight data operations
 * This is the single source of truth for all API interactions
 */

// Types for flight data matching the contract structure
export interface FlightData {
  flightNumber: string
  estimatedArrivalUTC: string
  estimatedDepartureUTC: string
  arrivalCity: string
  departureCity: string
  operatingAirline: string
  departureGate: string
  arrivalGate: string
  flightStatus: string
  equipmentModel: string
}

// Interface for raw API response
interface UnitedApiResponse {
  Flight: {
    FlightNumber: string
  }
  FlightLegs: Array<{
    OperationalFlightSegments: Array<{
      EstimatedArrivalUTCTime: string
      EstimatedDepartureUTCTime: string
      ArrivalGate: string
      DepartureGate: string
      DepartureAirport: {
        Address: {
          City: string
        }
      }
      ArrivalAirport: {
        Address: {
          City: string
        }
      }
      Equipment: {
        Model: {
          Description: string
        }
      }
      OperatingAirline: {
        IATACode: string
      }
      FlightStatuses: Array<{
        StatusType: string
        Description: string
      }>
    }>
  }>
}

/**
 * Fetches flight data from United Airlines API
 * @param flightNumber - The flight number to fetch data for
 * @returns Promise<FlightData> - Transformed flight data matching our contract structure
 */
export async function fetchFlightData(flightNumber: string): Promise<FlightData> {
  try {
    // Make API request
    const response = await fetch(
      `https://rte.qa.asx.aws.ual.com/rte/flifo-dashboard/v1/flifo/getFlightStatus?fltNbr=${flightNumber}`,
      {
        headers: {
          accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch flight data: ${response.statusText}`)
    }

    const data: UnitedApiResponse = await response.json()

    // Get the first flight segment
    const segment = data.FlightLegs[0]?.OperationalFlightSegments[0]
    if (!segment) {
      throw new Error("No flight segment found")
    }

    // Get flight status
    const flightStatus =
      segment.FlightStatuses.find((status) => status.StatusType === "FlightStatus")?.Description || "Unknown"

    // Transform API response to match our contract structure
    return {
      flightNumber: data.Flight.FlightNumber,
      estimatedArrivalUTC: segment.EstimatedArrivalUTCTime,
      estimatedDepartureUTC: segment.EstimatedDepartureUTCTime,
      arrivalCity: segment.ArrivalAirport.Address.City,
      departureCity: segment.DepartureAirport.Address.City,
      operatingAirline: segment.OperatingAirline.IATACode,
      departureGate: segment.DepartureGate || "TBD",
      arrivalGate: segment.ArrivalGate || "TBD",
      flightStatus,
      equipmentModel: segment.Equipment.Model.Description,
    }
  } catch (error) {
    console.error("Error fetching flight data:", error)
    throw error
  }
}

