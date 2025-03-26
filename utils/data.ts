import { FlightData } from "@/types/flight";

const flights: FlightData[] = [
  {
    flightNumber: "5300",
    departureDate: "2025-03-06",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-06T15:30:00Z",
    estimatedDepartureUTC: "2025-03-06T12:00:00Z",
    arrivalAirport: "LAS",
    departureAirport: "IAH",
    arrivalCity: "Las Vegas",
    departureCity: "Houston",
    departureGate: "C12",
    arrivalGate: "B8",
    flightStatus: "On Time",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-800",
    phase: "ndpt",
    departureTerminal: "C",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "4",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-06T11:30:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-06T15:30:00Z",
    scheduledDepartureUTCDateTime: "2025-03-06T12:00:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "2339",
    departureDate: "2025-03-07",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-07T22:15:00Z",
    estimatedDepartureUTC: "2025-03-07T19:45:00Z",
    arrivalAirport: "ORD",
    departureAirport: "LAS",
    arrivalCity: "Chicago",
    departureCity: "Las Vegas",
    departureGate: "B10",
    arrivalGate: "C22",
    flightStatus: "Delayed",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-900",
    phase: "ndpt",
    departureTerminal: "1",
    arrivalTerminal: "2",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "7",
    departureDelayMinutes: 25,
    arrivalDelayMinutes: 25,
    boardingTime: "2025-03-07T19:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-07T21:50:00Z",
    scheduledDepartureUTCDateTime: "2025-03-07T19:20:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "1422",
    departureDate: "2025-03-08",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-08T14:00:00Z",
    estimatedDepartureUTC: "2025-03-08T12:30:00Z",
    arrivalAirport: "DEN",
    departureAirport: "ORD",
    arrivalCity: "Denver",
    departureCity: "Chicago",
    departureGate: "C15",
    arrivalGate: "A12",
    flightStatus: "Canceled",
    statusCode: "CNCL",
    equipmentModel: "Airbus A320",
    departureTerminal: "2",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-08T12:00:00Z",
    isCanceled: true,
    scheduledArrivalUTCDateTime: "2025-03-08T14:00:00Z",
    scheduledDepartureUTCDateTime: "2025-03-08T12:30:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "7891",
    departureDate: "2025-03-09",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-09T10:15:00Z",
    estimatedDepartureUTC: "2025-03-09T07:45:00Z",
    arrivalAirport: "JFK",
    departureAirport: "DEN",
    arrivalCity: "New York",
    departureCity: "Denver",
    departureGate: "A18",
    arrivalGate: "D5",
    flightStatus: "Arrived At Gate",
    statusCode: "IN",
    equipmentModel: "Boeing 787-9",
    departureTerminal: "1",
    arrivalTerminal: "4",
    actualDepartureUTC: "2025-03-09T07:50:00Z",
    actualArrivalUTC: "2025-03-09T10:10:00Z",
    baggageClaim: "12",
    departureDelayMinutes: 5,
    arrivalDelayMinutes: -5,
    boardingTime: "2025-03-09T07:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-09T10:15:00Z",
    scheduledDepartureUTCDateTime: "2025-03-09T07:45:00Z",
    outTimeUTC: "2025-03-09T07:40:00Z",
    offTimeUTC: "2025-03-09T07:50:00Z",
    onTimeUTC: "2025-03-09T10:05:00Z",
    inTimeUTC: "2025-03-09T10:10:00Z",
  },
  {
    flightNumber: "5301",
    departureDate: "2025-03-06",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-06T15:30:00Z",
    estimatedDepartureUTC: "2025-03-06T12:00:00Z",
    arrivalAirport: "LAS",
    departureAirport: "IAH",
    arrivalCity: "Las Vegas",
    departureCity: "Houston",
    departureGate: "C12",
    arrivalGate: "B8",
    flightStatus: "On Time",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-800",
    departureTerminal: "C",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "4",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-06T11:30:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-06T15:30:00Z",
    scheduledDepartureUTCDateTime: "2025-03-06T12:00:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "2340",
    departureDate: "2025-03-07",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-07T22:15:00Z",
    estimatedDepartureUTC: "2025-03-07T19:45:00Z",
    arrivalAirport: "ORD",
    departureAirport: "LAS",
    arrivalCity: "Chicago",
    departureCity: "Las Vegas",
    departureGate: "B10",
    arrivalGate: "C22",
    flightStatus: "Delayed",
    statusCode: "NDPT",
    equipmentModel: "Boeing 737-900",
    departureTerminal: "1",
    arrivalTerminal: "2",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "7",
    departureDelayMinutes: 25,
    arrivalDelayMinutes: 25,
    boardingTime: "2025-03-07T19:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-07T21:50:00Z",
    scheduledDepartureUTCDateTime: "2025-03-07T19:20:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "1423",
    departureDate: "2025-03-08",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-08T14:00:00Z",
    estimatedDepartureUTC: "2025-03-08T12:30:00Z",
    arrivalAirport: "DEN",
    departureAirport: "ORD",
    arrivalCity: "Denver",
    departureCity: "Chicago",
    departureGate: "C15",
    arrivalGate: "A12",
    flightStatus: "Canceled",
    statusCode: "CNCL",
    equipmentModel: "Airbus A320",
    departureTerminal: "2",
    arrivalTerminal: "1",
    actualDepartureUTC: "",
    actualArrivalUTC: "",
    baggageClaim: "",
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    boardingTime: "2025-03-08T12:00:00Z",
    isCanceled: true,
    scheduledArrivalUTCDateTime: "2025-03-08T14:00:00Z",
    scheduledDepartureUTCDateTime: "2025-03-08T12:30:00Z",
    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",
  },
  {
    flightNumber: "7892",
    departureDate: "2025-03-09",
    carrierCode: "UA",
    operatingAirline: "United Airlines",
    estimatedArrivalUTC: "2025-03-09T10:15:00Z",
    estimatedDepartureUTC: "2025-03-09T07:45:00Z",
    arrivalAirport: "JFK",
    departureAirport: "DEN",
    arrivalCity: "New York",
    departureCity: "Denver",
    departureGate: "A18",
    arrivalGate: "D5",
    flightStatus: "Arrived At Gate",
    statusCode: "IN",
    equipmentModel: "Boeing 787-9",
    departureTerminal: "1",
    arrivalTerminal: "4",
    actualDepartureUTC: "2025-03-09T07:50:00Z",
    actualArrivalUTC: "2025-03-09T10:10:00Z",
    baggageClaim: "12",
    departureDelayMinutes: 5,
    arrivalDelayMinutes: -5,
    boardingTime: "2025-03-09T07:15:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-03-09T10:15:00Z",
    scheduledDepartureUTCDateTime: "2025-03-09T07:45:00Z",
    outTimeUTC: "2025-03-09T07:40:00Z",
    offTimeUTC: "2025-03-09T07:50:00Z",
    onTimeUTC: "2025-03-09T10:05:00Z",
    inTimeUTC: "2025-03-09T10:10:00Z",
  },
];

export default flights;

