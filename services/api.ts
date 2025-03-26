
import { FlightData } from "@/types/flight"
import {  addFlightSubscriptionApi, viewSubscribedFlight } from "./flight-api"

// API service for flight data
export const flightService = {
  searchFlight: async (
    carrierCode: string,
    flightNumber: string,
    departureStation:string,
    departureDate: Date
  ): Promise<FlightData> => {
    try {
      console.log(`Fetching flight details for ${carrierCode} ${flightNumber}  ${departureStation} on ${departureDate.toISOString()}`);

      // Calling the API to fetch flight details
    const flightData = await addFlightSubscriptionApi({
        flightNumber,
        scheduledDepartureDate : departureDate.toISOString().split('T')[0],
        departureStation,
        carrierCode
      });
      console.log("subtribe flight data ------>",flightData);
      
      return flightData;
    } catch (error) {
      console.error('Error fetching flight details:', error);
      throw error;
    }
  },

  viewFlightDetails: async (
    carrierCode: string,
    flightNumber: string,
    departureDate: Date
  ): Promise<FlightData> => {
    try {
      console.log(`Fetching flight details for ${carrierCode} ${flightNumber} on ${departureDate.toISOString()}`);

      // Calling the API to fetch flight details
    const flightData = await viewSubscribedFlight({
        flightNumber,
        scheduledDepartureDate: departureDate.toISOString().split('T')[0],
        carrierCode
      });

      return flightData;
    } catch (error) {
      console.error('Error fetching flight details:', error);
      throw error;
    }
  }
};