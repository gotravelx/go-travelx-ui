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

// Interface for raw API response
interface UnitedApiResponse {
  Flight: {
    FlightNumber: string
    FlightOriginationDate: string
  }
  FlightLegs: Array<{
    OperationalFlightSegments: Array<{
      EstimatedArrivalTime: string
      EstimatedDepartureTime: string
      ActualDepartureTime?: string
      ActualArrivalTime?: string
      OutTime?: string
      OffTime?: string
      InTime?: string
      EstimatedArrivalUTCTime: string
      EstimatedDepartureUTCTime: string
      ActualDepartureUTCTime?: string
      ActualArrivalUTCTime?: string
      OutUTCTime?: string
      OffUTCTime?: string
      InUTCTime?: string
      DepartureGate: string
      ArrivalGate: string
      ArrivalBagClaimUnit?: string
      DepartureTerminal: string
      ArrivalTermimal: string
      DepartureDelayMinutes?: string
      ArrivalDelayMinutes?: string
      BoardTime?: string
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
        Code: string
      }>
      Characteristic: Array<{
        Code: string
        Value: string
      }>
    }>
    ScheduledFlightSegments: Array<{
      ArrivalUTCDateTime: string,
      DepartureUTCDateTime: string,
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
    const scheduledSegment = data.FlightLegs[0]?.ScheduledFlightSegments[0]
    if (!segment) {
      throw new Error("No flight segment found")
    }

    console.log("scheduledSegment?.ArrivalUTCDateTime---->", scheduledSegment);
    console.log("scheduledSegment?.ArrivalUTCDateTime---->", scheduledSegment?.ArrivalUTCDateTime);
    console.log("scheduledSegment?.ArrivalUTCDateTime ---->", scheduledSegment?.DepartureUTCDateTime);



    // Get flight status
    const legStatus = segment.FlightStatuses.find((status) => status.StatusType === "LegStatus")
    const flightStatus = legStatus?.Description || "Unknown"
    const statusCode = legStatus?.Code || "Unknown"

    // Check if flight is canceled
    const isCanceled = statusCode === "CNCL"

    // Get flight phase indicators
    const flightIndicators = segment.Characteristic.reduce(
      (acc, char) => {
        if (["FltOutInd", "FltOffInd", "FltOnInd", "FltInInd", "FltCnclInd"].includes(char.Code)) {
          acc[char.Code] = char.Value === "1"
        }
        return acc
      },
      {} as Record<string, boolean>,
    )

    // Determine flight phase
    let phase: FlightPhase = "not_departed"
    if (flightIndicators.FltInInd) phase = "in"
    else if (flightIndicators.FltOnInd) phase = "on"
    else if (flightIndicators.FltOffInd) phase = "off"
    else if (flightIndicators.FltOutInd) phase = "out"

    // Transform API response to match our contract structure
    return {
      flightNumber: data.Flight.FlightNumber,
      estimatedArrivalUTC: segment.EstimatedArrivalUTCTime,
      estimatedDepartureUTC: segment.EstimatedDepartureUTCTime,
      actualDepartureUTC: segment.ActualDepartureUTCTime || "", // Fallback to scheduled departure if not found
      actualArrivalUTC: segment.ActualArrivalUTCTime || "",
      outTimeUTC: segment.OutUTCTime,
      offTimeUTC: segment.OffUTCTime,
      onTimeUTC: segment.InUTCTime,
      inTimeUTC: segment.InUTCTime,
      arrivalCity: segment.ArrivalAirport.Address.City,
      departureCity: segment.DepartureAirport.Address.City,
      operatingAirline: segment.OperatingAirline.IATACode,
      departureGate: segment.DepartureGate || "TBD",
      arrivalGate: segment.ArrivalGate || "TBD",
      departureTerminal: segment.DepartureTerminal || "TBD",
      arrivalTerminal: segment.ArrivalTermimal || "TBD",
      flightStatus,
      statusCode,
      equipmentModel: segment.Equipment.Model.Description,
      phase,
      baggageClaim: segment.ArrivalBagClaimUnit?.trim() || "TBD",
      departureDelayMinutes: segment.DepartureDelayMinutes ? Number.parseInt(segment.DepartureDelayMinutes) : 0,
      arrivalDelayMinutes: segment.ArrivalDelayMinutes ? Number.parseInt(segment.ArrivalDelayMinutes) : 0,
      boardingTime: segment.BoardTime,
      isCanceled,
      scheduledArrivalUTCDateTime: scheduledSegment?.ArrivalUTCDateTime,
      scheduledDepartureUTCDateTime: scheduledSegment?.DepartureUTCDateTime,
    }
  } catch (error) {
    console.error("Error fetching flight data:", error)
    throw error
  }
}

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

