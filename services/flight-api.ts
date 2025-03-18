import axios from "axios"
import { toast } from "sonner"
import { FlightData } from "./api"

// Define the interface for the request parameters
interface FlightDetailsRequest {
  flightNumber: number | string
  scheduledDepartureDate: string
  carrierCode: string
}

interface FlightSubscriptionRequest {
  flightNumber: number | string
  scheduledDepartureDate: string
  departureStation: string
  carrierCode: string
}

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

// Define the interface for the response
export interface FlightDetailsResponse {
  message: string
  response: {
    flightNumber: string
    flightDepartureDate: string
    carrierCode: string
    arrivalCity: string
    departureCity: string
    arrivalAirport: string
    departureAirport: string
    operatingAirlineCode: string
    arrivalGate: string
    departureGate: string
    flightStatus: string
    equipmentModel: string
    estimatedDepartureUTC: string
    estimatedArrivalUTC: string
    actualDepartureUTC: string
    actualArrivalUTC: string
    scheduledArrivalUTCDateTime: string
    scheduledDepartureUTCDateTime: string
    statusCode: string
    outTimeUTC: string
    offTimeUTC: string
    onTimeUTC: string
      inTimeUTC: string
  }
}

export const addFlightSubscriptionApi = async (data: FlightSubscriptionRequest): Promise<FlightData> => {
  try {
      const DEV_SERVER = process.env.NEXT_PUBLIC_BASE_URL;
    console.log('DEV_SERVER',DEV_SERVER);
    
    const response = await axios.post(`${DEV_SERVER}/v1/flights/add-flight-subscription`, 
      {
        flightNumber: data.flightNumber,
          departureAirport: data.scheduledDepartureDate,
        scheduledDepartureDate: data.departureStation,
        carrierCode: data.carrierCode,
      },
    )
    toast.success(response.data.message)

     return { ...response.data.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message)
        toast.error(error.response?.data.details || error.response?.data.message)
      throw new Error(error.response?.data?.message || "Failed to fetch flight details")
    }
       toast.error("An error occurred while adding flight subscription")
    throw error
  }
}



// Note: This is not standard REST practice but Axios supports it
export const viewSubscribedFlight = async (data: FlightDetailsRequest): Promise<FlightDetailsResponse> => {
  try {
      const DEV_SERVER = process.env.NEXT_PUBLIC_BASE_URL;
    console.log('DEV_SERVER',DEV_SERVER);
    
    const response = await axios.post(`${DEV_SERVER}/v1/flights/get-flight-details`, 
      {
        flightNumber: data.flightNumber,
        scheduledDepartureDate: data.scheduledDepartureDate,
        carrierCode: data.carrierCode,
      },
    )
    
    toast.info(response.data.message)

    

    return { ...response.data.response};
  
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message)
        toast.error(error.response?.data.details || error.response?.data.message)
      throw new Error(error.response?.data?.message || "Failed to fetch flight details")
    }
      toast.error("An error occurred while fetching flight details")
    throw error
  }
}

