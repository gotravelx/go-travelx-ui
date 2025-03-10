

export type FlightPhase =
  | "not_departed"
  | "out"
  | "off"
  | "on"
  | "in"
  | "canceled"
  | "return_to_gate"
  | "return_to_airport"
  | "diverted"

// Type for tracking transaction status
// Define transaction types for the application
export type TransactionStatusType = "pending" | "completed" | "failed"
export type TransactionType = "set" | "update"

export interface TransactionStatus {
  hash: string
  status: TransactionStatusType
  type: TransactionType
  timestamp: number
  flightNumber: string
  updatedFields?: string[]
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

