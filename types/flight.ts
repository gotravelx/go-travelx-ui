export type FlightPhase =
  | "ndpt"
  | "out"
  | "off"
  | "on"
  | "in"
  | "cncl"
  | "canceled"
  | "return_to_gate"
  | "return_to_airport"
  | "diverted"

export type TransactionStatusType = "pending" | "completed" | "failed"
export type TransactionType = "set" | "update"

export interface SubscriptionDetails {
  subscription: {
    _id: string
    walletAddress: string
    flightNumber: string
    departureAirport: string
    arrivalAirport: string
    blockchainTxHash: string
    flightSubscriptionStatus: string
    isSubscriptionActive: boolean
    subscriptionDate: string
    createdAt: string
    updatedAt: string
  }
  flight: FlightData
}

export interface MarketedFlightSegment {
  MarketingAirlineCode?: string
  FlightNumber?: string
}

export interface AirportInfo {
  code: string
  name: string
  shortName: string
  city: string
  state: string
}

export interface FlightTimes {
  scheduledDeparture: string
  scheduledArrival: string
  estimatedDeparture: string
  estimatedArrival: string
  actualDeparture?: string
  actualArrival?: string
  outTime?: string
  offTime?: string
  onTime?: string
  inTime?: string
  boardTime?: string
}

export interface FlightDelays {
  arrivalDelayMinutes: number
  estimatedDepartureDelayMinutes: number
  estimatedArrivalDelayMinutes: number
}

export interface AircraftInfo {
  model: string
  tailNumber: string
  totalSeats: number
}

export interface FlightStatus {
  current: string
  code: string
  legStatus: string
  departureStatus: string
  arrivalStatus: string
}

export interface AirlineInfo {
  code: string
  name: string
  website: string
  phone: string
}

export interface FlightDuration {
  planned: string
  actual: string
  scheduled: string
}

export interface FlightInfoResponse {
  success: boolean
  flightInfo: {
    flightNumber: string
    departureDate: string
    departureAirport: AirportInfo
    arrivalAirport: AirportInfo
    times: FlightTimes
    delays: FlightDelays
    aircraft: AircraftInfo
    status: FlightStatus
    airline: AirlineInfo
    duration: FlightDuration
    marketedFlightSegment: MarketedFlightSegment[]
    flightType: string
    isInternational: boolean
    isSubscribed: boolean
  }
}

export interface FlightData {
  flightNumber: string // key  Flight Number :   5300
  scheduledDepartureDate: string // key  exa : 2025-03-06
  carrierCode: string // key  ex : UA
  operatingAirline: string
  estimatedArrivalUTC: string
  estimatedDepartureUTC: string
  arrivalAirport: string // ex : LAS
  departureAirport: string // ex : IAH
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
  scheduledArrivalUTCDateTime: string
  scheduledDepartureUTCDateTime: string
  departureState?: string
  arrivalState?: string
  delyedDepartureMinutes?: number
  delayedArrivalMinutes?: number
  marketedFlightSegment?: MarketedFlightSegment[]
  currentFlightStatus?: string
  isSubscribed: boolean
  blockchainTxHash?: string
  MarketedFlightSegment?: MarketedFlightSegment[]
}

export interface TransactionStatus {
  hash: string
  status: TransactionStatusType
  type: TransactionType
  timestamp: number
  flightNumber: string
  updatedFields?: string[]
}

export interface FieldUpdate {
  field: string
  newValue: string
  timestamp: number
  eventTime?: string
}

export interface FlightUpdates {
  flightNumber: string
  updates: FieldUpdate[]
}

export interface FlightStatusEvent {
  flightNumber: string
  timestamp: number
  status: string
  eventTime?: string
}


export interface AirportCode {
  airPortCode: string
  createdAt: string
  updatedAt: string
}

export interface AirportSearchResponse {
  success: boolean
  message: string
  query: {
    original: string
    processed: string
    type: string
    sortBy: string
    order: string
  }
  data: AirportCode[]
  metadata: {
    totalFound: number
    limit: number
    hasMore: boolean
    searchTime: number
  }
  tableName: string
}


export interface AirportCode {
  airPortCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface AirportSearchResponse {
  success: boolean;
  message: string;
  query: {
    original: string;
    processed: string;
    type: string;
    sortBy: string;
    order: string;
  };
  data: AirportCode[];
  metadata: {
    totalFound: number;
    limit: number;
    hasMore: boolean;
    searchTime: number;
  };
  tableName: string;
}

export interface FlightSubscriptionRequest {
  flightNumber: string;
  scheduledDepartureDate: string;
  carrierCode: string;
  departureAirport: string;
  arrivalAirport: string;
}

export interface SubscriptionResponse {
  success: boolean
  walletAddress: string
  subscriptionCount: number
  subscriptions: SubscriptionDetails[]
  message: string
}