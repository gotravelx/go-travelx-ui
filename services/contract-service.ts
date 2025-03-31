import { ethers } from "ethers"
import { toast } from "sonner"
import { flightContractABI, FLIGHT_CONTRACT_ADDRESS } from "@/utils/abi"
import type { FlightData } from "@/types/flight"
import { storageService, type StoredTransaction } from "./storage"

// Define the interface for the contract response
interface ContractFlightData {
  flightNumber: string
  scheduledDepartureDate: string
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
}

interface ContractUtcTime {
  actualArrivalUTC: string
  actualDepartureUTC: string
  estimatedArrivalUTC: string
  estimatedDepartureUTC: string
  scheduledArrivalUTC: string
  scheduledDepartureUTC: string
  arrivalDelayMinutes: string
  departureDelayMinutes: string
  baggageClaim: string
  MarketingAirlineCode: string
}

interface ContractStatus {
  flightStatusCode: string
  flightStatusDescription: string
  outUtc: string
  offUtc: string
  onUtc: string
  inUtc: string
}

// Service for interacting with the flight contract
export const contractService = {
  // Get contract instance
  getContract: async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not installed")
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      return new ethers.Contract(FLIGHT_CONTRACT_ADDRESS, flightContractABI, signer)
    } catch (error) {
      console.error("Error getting contract:", error)
      throw error
    }
  },

  // Subscribe to a flight
  subscribeToFlight: async (flightNumber: string, carrierCode: string, departureAirport: string): Promise<string> => {
    try {
      const contract = await contractService.getContract()

      // Record transaction start
      const timestamp = Date.now()

      // Call the contract method
      const tx = await contract.addFlightSubscription(
        flightNumber,
        carrierCode,
        departureAirport,
        { value: ethers.parseEther("0.001") }, // Small amount of ETH for the transaction
      )

      // Save pending transaction
      const pendingTx: StoredTransaction = {
        hash: tx.hash,
        status: "pending",
        type: "set",
        timestamp,
        flightNumber: "subscription",
        updatedFields: ["subscription"],
      }
      storageService.saveTransaction(pendingTx)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Update transaction status
      storageService.updateTransactionStatus(tx.hash, "completed")

      toast.success(`Successfully subscribed to flight ${carrierCode} ${flightNumber}`)
      return tx.hash
    } catch (error) {
      console.error("Error subscribing to flight:", error)
      toast.error("Failed to subscribe to flight. Please try again.")
      throw error
    }
  },

  // Unsubscribe from flights
  unsubscribeFromFlights: async (
    flightNumbers: string[],
    carrierCodes: string[],
    departureAirports: string[],
  ): Promise<string> => {
    try {
      const contract = await contractService.getContract()

      // Record transaction start
      const timestamp = Date.now()

      // Call the contract method
      const tx = await contract.removeFlightSubscription(flightNumbers, carrierCodes, departureAirports)

      // Save pending transaction
      const pendingTx: StoredTransaction = {
        hash: tx.hash,
        status: "pending",
        type: "update",
        timestamp,
        flightNumber: "subscription",
        updatedFields: ["unsubscription"],
      }
      storageService.saveTransaction(pendingTx)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Update transaction status
      storageService.updateTransactionStatus(tx.hash, "completed")

      toast.success(`Successfully unsubscribed from ${flightNumbers.length} flight(s)`)
      return tx.hash
    } catch (error) {
      console.error("Error unsubscribing from flights:", error)
      toast.error("Failed to unsubscribe from flights. Please try again.")
      throw error
    }
  },

  // Get flight details from the contract
  getFlightDetails: async (
    flightNumber: string,
    scheduledDepartureDate: string,
    carrierCode: string,
  ): Promise<FlightData> => {
    try {
      const contract = await contractService.getContract()

      // Call the contract method
      const result = await contract.getFlightDetails(flightNumber, scheduledDepartureDate, carrierCode)

      // Extract data from the result
      const flightData: ContractFlightData = result[0]
      const utcTime: ContractUtcTime = result[1]
      const status: ContractStatus = result[2]

      // Convert to application FlightData format
      return {
        flightNumber: flightData.flightNumber,
        departureDate: flightData.scheduledDepartureDate,
        carrierCode: flightData.carrierCode,
        operatingAirline: flightData.operatingAirlineCode,
        estimatedArrivalUTC: utcTime.estimatedArrivalUTC,
        estimatedDepartureUTC: utcTime.estimatedDepartureUTC,
        arrivalAirport: flightData.arrivalAirport,
        departureAirport: flightData.departureAirport,
        arrivalCity: flightData.arrivalCity,
        departureCity: flightData.departureCity,
        departureGate: flightData.departureGate,
        arrivalGate: flightData.arrivalGate,
        flightStatus: flightData.flightStatus,
        statusCode: status.flightStatusCode as any,
        equipmentModel: flightData.equipmentModel,
        departureTerminal: "",
        arrivalTerminal: "",
        actualDepartureUTC: utcTime.actualDepartureUTC,
        actualArrivalUTC: utcTime.actualArrivalUTC,
        baggageClaim: utcTime.baggageClaim,
        departureDelayMinutes: Number.parseInt(utcTime.departureDelayMinutes) || 0,
        arrivalDelayMinutes: Number.parseInt(utcTime.arrivalDelayMinutes) || 0,
        boardingTime: "",
        isCanceled: status.flightStatusCode === "CNCL",
        scheduledArrivalUTCDateTime: utcTime.scheduledArrivalUTC,
        scheduledDepartureUTCDateTime: utcTime.scheduledDepartureUTC,
        outTimeUTC: status.outUtc,
        offTimeUTC: status.offUtc,
        onTimeUTC: status.onUtc,
        inTimeUTC: status.inUtc,
      }
    } catch (error) {
      console.error("Error getting flight details:", error)
      toast.error("Failed to retrieve flight details from blockchain")
      throw error
    }
  },

  // Check if a flight is subscribed by the current user
  isFlightSubscribed: async (
    userAddress: string,
    flightNumber: string,
    carrierCode: string,
    departureAirport: string,
  ): Promise<boolean> => {
    try {
      const contract = await contractService.getContract()

      // Call the contract method
      const isSubscribed = await contract.isFlightSubscribed(userAddress, flightNumber, carrierCode, departureAirport)

      return isSubscribed
    } catch (error) {
      console.error("Error checking flight subscription:", error)
      return false
    }
  },

  // Get all subscribed flights for a user
  // Note: This is a mock implementation since the contract doesn't provide this functionality directly
  getSubscribedFlights: async (userAddress: string): Promise<FlightData[]> => {
    // In a real implementation, you would query events from the contract
    // For now, we'll return mock data
    return Promise.resolve([]) // Return empty array for now
  },
}

