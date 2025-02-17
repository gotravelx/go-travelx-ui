// Types for flight data structure matching the smart contract
export interface FlightData {
  estimatedArrivalUTC: string
  estimatedDepartureUTC: string
  arrivalCity: string
  departureCity: string
  operatingAirline: string
  flightNumber: string
  departureGate: string
  arrivalGate: string
  flightStatus: string
  equipmentModel: string
  exists: boolean
}

// Type for tracking transaction status
export interface TransactionStatus {
  hash: string
  status: "pending" | "completed" | "failed"
  type: "set" | "update"
  timestamp: number
}

// Type for field updates from contract events
export interface FieldUpdate {
  field: string
  newValue: string
  timestamp: number
}

// Type for tracking all updates to a flight
export interface FlightUpdates {
  flightNumber: string
  updates: FieldUpdate[]
}

