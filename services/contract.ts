import { ethers } from "ethers"
import { type FlightData, fetchFlightData } from "./api"
import { storageService } from "./storage"

// Contract configuration
const CONTRACT_ADDRESS = "0xAC39D87b3eD641FA792aE1852051B866E5528Dfa"

// Complete ABI from the contract
const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "flightNumber",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "estimatedArrivalUTC",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "estimatedDepartureUTC",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "arrivalCity",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "departureCity",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "operatingAirline",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "departureGate",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "arrivalGate",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "flightStatus",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "equipmentModel",
        type: "string",
      },
    ],
    name: "FlightDataSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "flightNumber",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "fieldsUpdated",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "newValues",
        type: "string[]",
      },
    ],
    name: "FlightDataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
    ],
    name: "Subscribed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "flightNumbers",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "flights",
    outputs: [
      {
        internalType: "string",
        name: "estimatedArrivalUTC",
        type: "string",
      },
      {
        internalType: "string",
        name: "estimatedDepartureUTC",
        type: "string",
      },
      {
        internalType: "string",
        name: "arrivalCity",
        type: "string",
      },
      {
        internalType: "string",
        name: "departureCity",
        type: "string",
      },
      {
        internalType: "string",
        name: "operatingAirline",
        type: "string",
      },
      {
        internalType: "string",
        name: "flightNumber",
        type: "string",
      },
      {
        internalType: "string",
        name: "departureGate",
        type: "string",
      },
      {
        internalType: "string",
        name: "arrivalGate",
        type: "string",
      },
      {
        internalType: "string",
        name: "flightStatus",
        type: "string",
      },
      {
        internalType: "string",
        name: "equipmentModel",
        type: "string",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "flightNumber",
        type: "string",
      },
    ],
    name: "getFlightData",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "estimatedArrivalUTC",
            type: "string",
          },
          {
            internalType: "string",
            name: "estimatedDepartureUTC",
            type: "string",
          },
          {
            internalType: "string",
            name: "arrivalCity",
            type: "string",
          },
          {
            internalType: "string",
            name: "departureCity",
            type: "string",
          },
          {
            internalType: "string",
            name: "operatingAirline",
            type: "string",
          },
          {
            internalType: "string",
            name: "flightNumber",
            type: "string",
          },
          {
            internalType: "string",
            name: "departureGate",
            type: "string",
          },
          {
            internalType: "string",
            name: "arrivalGate",
            type: "string",
          },
          {
            internalType: "string",
            name: "flightStatus",
            type: "string",
          },
          {
            internalType: "string",
            name: "equipmentModel",
            type: "string",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
        ],
        internalType: "struct FlightStatusOracle.FlightData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "flightNumber",
        type: "string",
      },
      {
        internalType: "string",
        name: "estimatedArrivalUTC",
        type: "string",
      },
      {
        internalType: "string",
        name: "estimatedDepartureUTC",
        type: "string",
      },
      {
        internalType: "string",
        name: "arrivalCity",
        type: "string",
      },
      {
        internalType: "string",
        name: "departureCity",
        type: "string",
      },
      {
        internalType: "string",
        name: "operatingAirline",
        type: "string",
      },
      {
        internalType: "string",
        name: "departureGate",
        type: "string",
      },
      {
        internalType: "string",
        name: "arrivalGate",
        type: "string",
      },
      {
        internalType: "string",
        name: "flightStatus",
        type: "string",
      },
      {
        internalType: "string",
        name: "equipmentModel",
        type: "string",
      },
    ],
    name: "setFlightData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "months",
        type: "uint256",
      },
    ],
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "subscriptions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "flightNumber",
        type: "string",
      },
      {
        internalType: "string",
        name: "estimatedArrivalUTC",
        type: "string",
      },
      {
        internalType: "string",
        name: "estimatedDepartureUTC",
        type: "string",
      },
      {
        internalType: "string",
        name: "arrivalCity",
        type: "string",
      },
      {
        internalType: "string",
        name: "departureCity",
        type: "string",
      },
      {
        internalType: "string",
        name: "operatingAirline",
        type: "string",
      },
      {
        internalType: "string",
        name: "departureGate",
        type: "string",
      },
      {
        internalType: "string",
        name: "arrivalGate",
        type: "string",
      },
      {
        internalType: "string",
        name: "flightStatus",
        type: "string",
      },
      {
        internalType: "string",
        name: "equipmentModel",
        type: "string",
      },
    ],
    name: "updateFlightData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export interface TransactionStatus {
  hash: string
  status: "pending" | "completed" | "failed"
  type: "set" | "update"
  timestamp: number
  flightNumber: string
  updatedFields?: string[]
}

export interface FlightUpdates {
  flightNumber: string
  updates: {
    field: string
    newValue: string
    timestamp: number
  }[]
}

export class FlightContractService {
  private contract: ethers.Contract
  private provider: ethers.Provider

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }

  // Check if flight exists in contract
  private async checkFlightExists(flightNumber: string): Promise<boolean> {
    try {
      const flightData = await this.contract.flights(flightNumber)
      return flightData.exists
    } catch (error) {
      return false
    }
  }

  // Store or update flight data
  async storeFlightData(flightNumber: string): Promise<TransactionStatus> {
    try {
      const flightData = await fetchFlightData(flightNumber)
      const exists = await this.checkFlightExists(flightNumber)

      let tx
      const timestamp = Date.now()

      if (!exists) {
        // Store new flight data using setFlightData
        tx = await this.contract.setFlightData(
          flightNumber,
          flightData.estimatedArrivalUTC,
          flightData.estimatedDepartureUTC,
          flightData.arrivalCity,
          flightData.departureCity,
          flightData.operatingAirline,
          flightData.departureGate,
          flightData.arrivalGate,
          flightData.flightStatus,
          flightData.equipmentModel,
        )

        const status: TransactionStatus = {
          hash: tx.hash,
          status: "pending",
          type: "set",
          timestamp,
          flightNumber,
        }

        // Save to local storage
        storageService.saveTransaction({
          ...status,
          updatedFields: ["all"],
        })

        await tx.wait()
        storageService.updateTransactionStatus(tx.hash, "completed")
        status.status = "completed"

        return status
      } else {
        // Update existing flight data using updateFlightData
        tx = await this.contract.updateFlightData(
          flightNumber,
          flightData.estimatedArrivalUTC,
          flightData.estimatedDepartureUTC,
          flightData.arrivalCity,
          flightData.departureCity,
          flightData.operatingAirline,
          flightData.departureGate,
          flightData.arrivalGate,
          flightData.flightStatus,
          flightData.equipmentModel,
        )

        const status: TransactionStatus = {
          hash: tx.hash,
          status: "pending",
          type: "update",
          timestamp,
          flightNumber,
        }

        // Save to local storage
        storageService.saveTransaction(status)

        await tx.wait()
        storageService.updateTransactionStatus(tx.hash, "completed")
        status.status = "completed"

        return status
      }
    } catch (error) {
      console.error("Error storing flight data:", error)
      throw error
    }
  }

  // Get flight data from contract
  async getFlightData(flightNumber: string): Promise<FlightData & { exists: boolean }> {
    try {
      const data = await this.contract.getFlightData(flightNumber)
      return {
        estimatedArrivalUTC: data[0],
        estimatedDepartureUTC: data[1],
        arrivalCity: data[2],
        departureCity: data[3],
        operatingAirline: data[4],
        flightNumber: data[5],
        departureGate: data[6],
        arrivalGate: data[7],
        flightStatus: data[8],
        equipmentModel: data[9],
        exists: data[10],
      }
    } catch (error) {
      console.error("Error fetching flight data:", error)
      throw error
    }
  }

  // Setup event listener for flight updates
  setupFlightUpdateListener(flightNumber: string, callback: (updates: FlightUpdates) => void) {
    const handler = (updatedFlightNumber: string, fieldsUpdated: string[], newValues: string[]) => {
      if (updatedFlightNumber === flightNumber) {
        const updates = fieldsUpdated.map((field, index) => ({
          field,
          newValue: newValues[index],
          timestamp: Date.now(),
        }))

        // Save update to local storage
        storageService.saveTransaction({
          hash: "update_" + Date.now(),
          status: "completed",
          type: "update",
          timestamp: Date.now(),
          flightNumber,
          updatedFields: fieldsUpdated,
        })

        callback({
          flightNumber,
          updates,
        })
      }
    }

    // Listen for FlightDataUpdated events
    this.contract.on("FlightDataUpdated", handler)

    return () => {
      this.contract.off("FlightDataUpdated", handler)
    }
  }

  // Subscribe to service
  async subscribe(months: number, value: string): Promise<TransactionStatus> {
    try {
      const tx = await this.contract.subscribe(months, {
        value: ethers.parseEther(value),
      })

      const status: TransactionStatus = {
        hash: tx.hash,
        status: "pending",
        type: "set",
        timestamp: Date.now(),
        flightNumber: "subscription",
      }

      storageService.saveTransaction(status)

      await tx.wait()
      storageService.updateTransactionStatus(tx.hash, "completed")
      status.status = "completed"

      return status
    } catch (error) {
      console.error("Error subscribing:", error)
      throw error
    }
  }

  // Check subscription status
  async checkSubscription(address: string): Promise<Date | null> {
    try {
      const expiryTimestamp = await this.contract.subscriptions(address)
      return new Date(Number(expiryTimestamp) * 1000)
    } catch (error) {
      console.error("Error checking subscription:", error)
      throw error
    }
  }
}

