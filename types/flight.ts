export type FlightPhase =
  | "ndpt"
  | "out"
  | "off"
  | "on"
  | "in"
  | "cncl"
  | "return_to_gate"
  | "return_to_airport"
  | "diverted"

// Type for tracking transaction status
// Define transaction types for the application
export type TransactionStatusType = "pending" | "completed" | "failed"
export type TransactionType = "set" | "update"

// Types for flight data matching the contract structure

export interface TransactionStatus {
  hash: string
  status: TransactionStatusType
  type: TransactionType
  timestamp: number
  flightNumber: string
  updatedFields?: string[]
}

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
  statusCode: FlightPhase
  flightStatus: string
  equipmentModel: string
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


// Type for field updates from contract events
export interface FieldUpdate {
  field: string
  newValue: string
  timestamp: number
  eventTime?: string
}

// Type for tracking all updates to a flight
export interface FlightUpdates {
  flightNumber: string
  updates: FieldUpdate[]
}

// Type for flight status event from contract
export interface FlightStatusEvent {
  flightNumber: string
  timestamp: number
  status: string
  eventTime?: string
}

