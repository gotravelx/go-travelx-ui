import { authServices } from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export interface Carrier {
    carrierCode: string;
    carrierName: string;
    program: string;
    createdAt?: string;
    updatedAt?: string;
}

class CarrierService {
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

    getAllCarriers = async (): Promise<Carrier[]> => {
        try {
            const response = await this.fetchWithRetry(`${this.baseUrl}/carriers/get-all`, {
                method: "GET",
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching carriers:", error);
            throw error;
        }
    };

    createCarrier = async (carrier: Carrier): Promise<void> => {
        try {
            const response = await this.fetchWithRetry(`${this.baseUrl}/carriers/`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(carrier),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
        } catch (error) {
            console.error("Error creating carrier:", error);
            throw error;
        }
    };

    deleteCarrier = async (code: string): Promise<void> => {
        try {
            const response = await this.fetchWithRetry(`${this.baseUrl}/carriers/${code}`, {
                method: "DELETE",
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
        } catch (error) {
            console.error("Error deleting carrier:", error);
            throw error;
        }
    };
}

export const carrierService = new CarrierService(BASE_URL);
