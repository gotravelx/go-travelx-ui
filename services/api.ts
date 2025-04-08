import type {
  FlightData,
  FlightPhase,
  SubscriptionDetails,
} from "@/types/flight";

// Add this constant at the top of the file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("API BASE URL -->", API_BASE_URL);
// Add this interface to the top of the file with other interfaces

// API service for flight data
export const flightService = {
  searchFlight: async (
    carrierCode: string,
    flightNumber: string,
    departureStation: string,
    departureDate: Date
  ): Promise<FlightData> => {
    try {
      console.log(
        `Fetching flight details for ${carrierCode} ${flightNumber} ${departureStation} on ${departureDate.toISOString()}`
      );
      const walletAddress = localStorage.getItem("walletAddress");
      console.log(`Using wallet address: ${walletAddress}`);

      // Use the API to get flight data
      const response = await fetch(
        `${API_BASE_URL}/flights/get-flight-status/${flightNumber}?departureDate=${
          departureDate.toISOString().split("T")[0]
        }&departure=${departureStation}&walletAddress=${walletAddress}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Flight data from API:", data.flightData);
      return data.flightData;
    } catch (error) {
      console.error("Error fetching flight details:", error);
      throw error;
    }
  },

  viewFlightDetails: async (
    carrierCode: string,
    flightNumber: string,
    departureDate: Date,
    walletAddress: string
  ): Promise<FlightData> => {
    try {
      console.log(
        `Fetching flight details for ${carrierCode} ${flightNumber} on ${departureDate.toISOString()}`
      );

      const response = await fetch(
        `${API_BASE_URL}/flights/get-flight-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flightNumber,
            scheduledDepartureDate: departureDate.toISOString().split("T")[0],
            carrierCode,
            walletAddress,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching flight details:", error);
      throw error;
    }
  },

  subscribeToFlight: async (
    flightNumber: string,
    carrierCode: string,
    departureAirport: string,
    departureDate: string,
    walletAddress: string
  ): Promise<string> => {
    try {
      console.log(
        `Subscribing to flight ${carrierCode}${flightNumber} from ${departureAirport} on ${departureDate}`
      );
      console.log(`Using wallet address: ${walletAddress}`);

      // Validate all required parameters
      if (
        !walletAddress ||
        !flightNumber ||
        !carrierCode ||
        !departureAirport ||
        !departureDate
      ) {
        const missingParams = {
          flightNumber: !flightNumber,
          carrierCode: !carrierCode,
          departureAirport: !departureAirport,
          departureDate: !departureDate,
          walletAddress: !walletAddress,
        };
        console.error("Missing required parameters:", missingParams);
        throw new Error(
          `Missing required parameters: ${JSON.stringify(missingParams)}`
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/flights/add-flight-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flightNumber,
            scheduledDepartureDate: departureDate, // Ensure parameter name matches API
            carrierCode, // Added missing parameter
            departureAirport,
            walletAddress,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `API error: ${response.status}`
        );
      }

      return data.subscriptionId || "success";
    } catch (error) {
      console.error("Error subscribing to flight:", error);
      throw error;
    }
  },

  // New method to fetch subscribed flights
  getSubscribedFlights: async (
    walletAddress: string
  ): Promise<FlightData[]> => {
    try {
      if (!walletAddress) {
        console.warn(
          "No wallet address provided for fetching subscribed flights"
        );
        return [];
      }

      console.log(`Fetching subscribed flights for wallet: ${walletAddress}`);

      const response = await fetch(
        `${API_BASE_URL}/flights/all-subscribed-flights/${walletAddress}`,
        {
          method: "GET",
          credentials: "include", // Ensure cookies are sent if needed
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Subscribed flights data:", data);

      // Transform the API response to match our FlightData interface if needed
      return data.map((flight: any) => ({
        flightNumber: flight.flightNumber.toString(),
        scheduledDepartureDate: flight.scheduledDepartureDate,
        carrierCode: flight.carrierCode,
        operatingAirline: flight.operatingAirline,
        estimatedArrivalUTC: flight.estimatedArrivalUTC,
        estimatedDepartureUTC: flight.estimatedDepartureUTC,
        arrivalAirport: flight.arrivalAirport,
        departureAirport: flight.departureAirport,
        arrivalCity: flight.arrivalCity,
        departureCity: flight.departureCity,
        departureGate: flight.departureGate,
        arrivalGate: flight.arrivalGate,
        statusCode: flight.statusCode,
        flightStatus: flight.flightStatus || flight.currentFlightStatus,
        equipmentModel: flight.equipmentModel,
        departureTerminal: flight.departureTerminal,
        arrivalTerminal: flight.arrivalTerminal,
        actualDepartureUTC: flight.actualDepartureUTC,
        actualArrivalUTC: flight.actualArrivalUTC,
        baggageClaim: flight.baggageClaim,
        departureDelayMinutes: flight.departureDelayMinutes,
        arrivalDelayMinutes: flight.arrivalDelayMinutes,
        boardingTime: flight.boardingTime,
        isCanceled: flight.isCanceled,
        scheduledArrivalUTCDateTime: flight.scheduledArrivalUTCDateTime,
        scheduledDepartureUTCDateTime: flight.scheduledDepartureUTCDateTime,
        outTimeUTC: flight.outTimeUTC,
        offTimeUTC: flight.offTimeUTC,
        onTimeUTC: flight.onTimeUTC,
        inTimeUTC: flight.inTimeUTC,
        departureStatus: flight.departureStatus,
        arrivalStatus: flight.arrivalStatus,
        currentFlightStatus: flight.currentFlightStatus,
        isSubscribed: true,
        blockchainTxHash: flight.blockchainTxHash,
        MarketedFlightSegment: flight.MarketedFlightSegment,
      }));
    } catch (error) {
      console.error("Error fetching subscribed flights:", error);
      return [];
    }
  },

  // Add this method to the flightService object
  getSubscribedFlightsDetails: async (
    walletAddress: string
  ): Promise<SubscriptionDetails[]> => {
    try {
      if (!walletAddress) {
        console.warn(
          "No wallet address provided for fetching subscribed flights details"
        );
        return [];
      }

      console.log(
        `Fetching subscribed flights details for wallet: ${walletAddress}`
      );

      const response = await fetch(
        `${API_BASE_URL}/flights/subscribed-flights-details/${walletAddress}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Subscribed flights details:", data);

      if (!data.success || !data.data) {
        console.error("API returned unsuccessful response or no data");
        return [];
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching subscribed flights details:", error);
      return [];
    }
  },

  unsubscribeFlights: async (
    walletAddress: string,
    flightNumbers: string[],
    carrierCodes: string[],
    departureAirports: string[]
  ): Promise<boolean> => {
    try {
      if (!walletAddress) {
        console.warn("No wallet address provided for unsubscribing");
        return false;
      }

      console.log(
        `Unsubscribing from ${flightNumbers.length} flights for wallet: ${walletAddress}`
      );

      const response = await fetch(
        `${API_BASE_URL}/flights/subscriptions/unsubscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress,
            flightNumbers,
            carrierCodes,
            departureAirports,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Unsubscribe response:", data);

      return data.success || false;
    } catch (error) {
      console.error("Error unsubscribing from flights:", error);
      return false;
    }
  },
};
