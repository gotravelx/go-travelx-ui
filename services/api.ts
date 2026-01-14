import { LoginResponse, User } from "@/types/auth";
import type {
  AirportSearchResponse,
  FlightData,
  FlightSubscriptionRequest,
  SubscriptionDetails,
  GetFlightSubscriptionsApiResponse,
} from "@/types/flight";
import { mapStatusCodeToPhase } from "@/utils/common";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
class FlightService {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  private getAuthHeaders(): HeadersInit {
    const token = authServices.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    let response = await fetch(url, options);
    if (!response.ok && response.status === 403) {
      try {
        await authServices.refreshToken();
        options.headers = this.getAuthHeaders();
        response = await fetch(url, options);
      } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
      }
    }
    return response;
  }
  searchAirportCodes = async (): Promise<AirportSearchResponse> => {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/airport-codes`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      console.log("Airport codes response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Airport codes response:", data);
      return data;
    } catch (error) {
      console.error("Error searching airport codes:", error);
      throw error;
    }
  };
  searchFlight = async (
    carrier: string,
    flightNumber: string,
    departureStation: string,
    arrivalStation: string,
    departureDate: Date
  ): Promise<FlightData> => {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl
        }/flights/get-flight-status/${flightNumber}?carrier=${carrier}&departureDate=${departureDate.toISOString().split("T")[0]
        }&departure=${departureStation}&arrival=${arrivalStation}&includeFullData=false`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      // Transform the API response to match FlightData interface
      if (data.success && data.flightInfo) {
        const flightInfo = data.flightInfo;
        const transformedData: FlightData = {
          flightNumber: flightInfo.flightNumber,
          scheduledDepartureDate: flightInfo.departureDate,
          carrierCode: flightInfo?.carrierCode || flightInfo?.airline?.code || "UA",
          operatingAirline: flightInfo.airline?.name || "",
          estimatedArrivalUTC: flightInfo.times?.estimatedArrival || "",
          estimatedDepartureUTC: flightInfo.times?.estimatedDeparture || "",
          arrivalAirport: flightInfo.arrivalAirport?.code || "",
          departureAirport: flightInfo.departureAirport?.code || "",
          arrivalCity: flightInfo.arrivalAirport?.city || "",
          departureCity: flightInfo.departureAirport?.city || "",
          departureGate: flightInfo.departureAirport?.departureGate || "",
          arrivalGate: flightInfo.arrivalAirport?.arrivalGate || "",
          statusCode: mapStatusCodeToPhase(
            flightInfo.status?.legStatus || flightInfo.statusCode
          ),
          flightStatus:
            flightInfo.flightStatus || flightInfo.status?.current || "",
          equipmentModel:
            flightInfo.equipmentModel || flightInfo.aircraft?.model || "",
          departureTerminal:
            flightInfo.departureAirport?.departureTerminal || "",
          arrivalTerminal: flightInfo.arrivalAirport?.arrivalTerminal || "",
          actualDepartureUTC: flightInfo.times?.actualDeparture || "",
          actualArrivalUTC: flightInfo.times?.actualArrival || "",
          outTimeUTC: flightInfo.times?.outTime || "",
          offTimeUTC: flightInfo.times?.offTime || "",
          onTimeUTC: flightInfo.times?.onTime || "",
          inTimeUTC: flightInfo.times?.inTime || "",
          baggageClaim: flightInfo.baggageClaim || "",
          departureDelayMinutes: flightInfo.delays?.departureDelayMinutes || 0,
          arrivalDelayMinutes: flightInfo.delays?.arrivalDelayMinutes || 0,
          boardingTime: flightInfo?.times?.boardTime || "",
          isCanceled: flightInfo.isCanceled || false,
          scheduledArrivalUTCDateTime: flightInfo.times?.scheduledArrival || "",
          scheduledDepartureUTCDateTime:
            flightInfo.times?.scheduledDeparture || "",
          departureState: flightInfo.status?.departureStatus || "",
          arrivalState: flightInfo.status?.arrivalStatus || "",
          marketedFlightSegment: flightInfo.marketedFlightSegment || [],
          currentFlightStatus: flightInfo.status?.current || "",
          isSubscribed: flightInfo.isSubscribed || false,
          blockchainTxHash: "",
          MarketedFlightSegment: flightInfo.marketedFlightSegment || [],
          plannedDuration: flightInfo.duration?.planned || "",
          actualDuration: flightInfo.duration?.actual || "",
          scheduledDuration: flightInfo.duration?.scheduled || "",
        };
        return transformedData;
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      console.error("Error fetching flight details:", error);
      throw error;
    }
  };
  subscribeToFlight = async (data: FlightSubscriptionRequest): Promise<any> => {
    try {
      console.log("Subscribing to flight with data:", data);
      const requestBody = {
        flightNumber: data.flightNumber,
        departureDate: data.scheduledDepartureDate,
        carrierCode: data.carrierCode,
        departureAirport: data.departureAirport,
        arrivalAirport: data.arrivalAirport,
      };
      console.log("Request body:", requestBody);
      const response = await this.fetchWithRetry(
        `${this.baseUrl}/subscription/add-flight-subscription`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(requestBody),
        }
      );
      const result = await response.json();

      console.log("Subscription response:", result);
      if (!response.ok) {
        // Extract main error message only
        const errorMessage = result.error || result.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      return result;
    } catch (error) {
      console.error("Error subscribing to flight:", error);
      throw error;
    }
  };
  getSubscribedFlights = async (): Promise<FlightData[]> => {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/flights/get-all-flights`, {
        method: "GET",
        credentials: "include",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Subscribed flights data:", data);
      // Check if the response has the expected structure
      if (!data.success || !data.flights || !Array.isArray(data.flights)) {
        console.error("Invalid API response structure:", data);
        return [];
      }
      // Transform the API response to match our FlightData interface
      // Reverse the array to show the latest subscriptions first
      return [...data.flights].reverse().map((flight: any) => {
        return {
          flightNumber: (flight.flightNumber || "").toString(),
          scheduledDepartureDate:
            flight.departureDate ||
            flight.times?.scheduledDeparture?.split("T")[0] ||
            "",
          carrierCode: flight?.carrierCode || "UA", // Default to UA if not provided
          operatingAirline: flight.airline?.name || "",
          estimatedArrivalUTC: flight.times?.estimatedArrival || "",
          estimatedDepartureUTC: flight.times?.estimatedDeparture || "",
          arrivalAirport: flight.arrivalAirport?.code || "",
          departureAirport: flight.departureAirport?.code || "",
          arrivalCity: flight.arrivalAirport?.city || "",
          departureCity: flight.departureAirport?.city || "",
          departureGate: flight.departureAirport?.departureGate || "",
          arrivalGate: flight.arrivalAirport?.arrivalGate || "",
          statusCode: mapStatusCodeToPhase(flight.status?.legStatus || "NDPT"),
          flightStatus: flight.status?.current || "",
          equipmentModel: flight.aircraft?.model || flight.equipmentModel || "",
          departureTerminal: flight.departureAirport?.departureTerminal || "",
          arrivalTerminal: flight.arrivalAirport?.arrivalTerminal || "",
          actualDepartureUTC: flight.times?.actualDeparture || "",
          actualArrivalUTC: flight.times?.actualArrival || "",
          baggageClaim: flight.baggageClaim || "",
          departureDelayMinutes: flight.delays?.departureDelayMinutes || 0,
          arrivalDelayMinutes: flight.delays?.arrivalDelayMinutes || 0,
          boardingTime: flight.times?.boardTime || "",
          isCanceled: flight.isCanceled || false,
          scheduledArrivalUTCDateTime: flight.times?.scheduledArrival || "",
          scheduledDepartureUTCDateTime: flight.times?.scheduledDeparture || "",
          outTimeUTC: flight.times?.outTime || "",
          offTimeUTC: flight.times?.offTime || "",
          onTimeUTC: flight.times?.onTime || "",
          inTimeUTC: flight.times?.inTime || "",
          departureState: flight.status?.departureStatus || "",
          arrivalState: flight.status?.arrivalStatus || "",
          currentFlightStatus: flight.status?.current || "",
          isSubscribed: true,
          blockchainTxHash: flight.blockchainHashKey || "",
          marketedFlightSegment: flight.marketedFlightSegment || [],
          MarketedFlightSegment: flight.marketedFlightSegment || [],
        };
      });
    } catch (error) {
      console.error("Error fetching subscribed flights:", error);
      return [];
    }
  };
  getSubscribedFlightsDetails = async (): Promise<SubscriptionDetails[]> => {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/subscription/get-flight-subscriptions`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch subscribed flights"
        );
      }
      const data: GetFlightSubscriptionsApiResponse = await response.json();
      console.log("Subscribed flights details API response:", data);
      if (data.success && data.subscriptions) {
        // Reverse the array to show the latest subscriptions first
        return [...data.subscriptions].reverse().map((apiSub: any) => {
          // Map the flat API response object into the nested SubscriptionDetails structure
          const flightData: FlightData = {
            flightNumber: apiSub.flightNumber,
            scheduledDepartureDate: apiSub.departureDate,
            carrierCode: apiSub.carrierCode,
            operatingAirline: apiSub.airline.name,
            estimatedArrivalUTC: apiSub.times.estimatedArrival,
            estimatedDepartureUTC: apiSub.times.estimatedDeparture,
            arrivalAirport: apiSub.arrivalAirport.code,
            departureAirport: apiSub.departureAirport.code,
            arrivalCity: apiSub.departureAirport.city,
            departureCity: apiSub.arrivalAirport.city,
            departureGate: apiSub.departureAirport.departureGate,
            arrivalGate: apiSub.arrivalAirport.arrivalGate,
            statusCode: mapStatusCodeToPhase(
              apiSub.status.legStatus || apiSub.status.code
            ),
            flightStatus: apiSub.status.current,
            equipmentModel: apiSub.aircraft.model,
            departureTerminal: apiSub.departureAirport.departureTerminal,
            arrivalTerminal: apiSub.arrivalAirport.arrivalTerminal,
            actualDepartureUTC: apiSub.times.actualDeparture,
            actualArrivalUTC: apiSub.times.actualArrival,
            outTimeUTC: apiSub.times.outTime,
            offTimeUTC: apiSub.times.offTime,
            onTimeUTC: apiSub.times.onTime,
            inTimeUTC: apiSub.times.inTime,
            baggageClaim: apiSub.baggageClaim,
            departureDelayMinutes: apiSub.delays.departureDelayMinutes,
            arrivalDelayMinutes: apiSub.delays.arrivalDelayMinutes,
            boardingTime: apiSub.times.boardTime,
            isCanceled: apiSub.isCanceled,
            scheduledArrivalUTCDateTime: apiSub.times.scheduledArrival,
            scheduledDepartureUTCDateTime: apiSub.times.scheduledDeparture,
            departureState: apiSub.status.departureStatus,
            arrivalState: apiSub.status.arrivalStatus,
            marketedFlightSegment: apiSub.MarketedFlightSegment || [],
            currentFlightStatus: apiSub.status.current,
            isSubscribed: true, // Assuming if it's in this list, it's subscribed
            blockchainTxHash: apiSub.blockchainHashKey,
            MarketedFlightSegment: apiSub.MarketedFlightSegment || [],
            plannedDuration: apiSub.duration.planned,
            actualDuration: apiSub.duration.actual,
            scheduledDuration: apiSub.duration.scheduled,
          };
          return {
            subscription: {
              _id: apiSub._id || "", // Add _id from apiSub, fallback to empty string if missing
              flightNumber: apiSub.flightNumber,
              departureAirport: apiSub.departureAirport.code, // Just the code
              arrivalAirport: apiSub.arrivalAirport.code, // Just the code
              blockchainTxHash: apiSub.blockchainTxHash,
              flightSubscriptionStatus: apiSub.status.current, // Assuming this maps
              isSubscriptionActive: true, // Assuming active if returned
              subscriptionDate: apiSub.subscriptionDate,
              createdAt: apiSub.subscriptionDate, // Using subscriptionDate as placeholder
              updatedAt: apiSub.subscriptionDate, // Using subscriptionDate as placeholder
            },
            flight: flightData,
          };
        });
      }
      return [];
    } catch (error) {
      console.error("Error in getSubscribedFlightsDetails:", error);
      throw error;
    }
  };
  unsubscribeFlights = async (
    flightNumbers: string[],
    carrierCodes: string[],
    departureAirports: string[],
    arrivalAirports: string[]
  ): Promise<boolean> => {
    try {
      console.log(`Unsubscribing from ${flightNumbers.length} flights`);
      const response = await this.fetchWithRetry(`${this.baseUrl}/subscription/unsubscribe-flight`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          flightNumbers,
          carrierCodes,
          departureAirports,
          arrivalAirports,
        }),
      });
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
  };
}
class AuthService {
  private baseUrl: string;
  private token: string | null = null;
  private user: User | null = null;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    console.log(this.baseUrl);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        this.user = JSON.parse(storedUser);
      }
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken !== "undefined") {
        this.token = storedToken as string;
      }
    }
  }
  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data: { success: boolean; username: string; accessToken: string; refreshToken: string } =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Login failed");
    }

    this.token = data.accessToken;

    if (typeof window !== "undefined") {
      localStorage.setItem("token", this.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    this.user = {
      id: "1",
      username: data.username,
      name: data.username,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(this.user));
    }

    return this.user;
  }

  logout(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  }
  getToken(): string | null {
    return this.token;
  }
  getUser(): User | null {
    return this.user;
  }
  isAuthenticated(): boolean {
    return !!this.user && !!this.token;
  }
  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken as string })
      });
      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }
      const data = await response.json();
      this.token = data.accessToken as string;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", this.token);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }
  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    if (!this.token) throw new Error("Not authenticated");
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}
export const flightService = new FlightService(BASE_URL);
export const authServices = new AuthService(BASE_URL);
