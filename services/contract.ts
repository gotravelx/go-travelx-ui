import { ethers } from "ethers"
import { storageService } from "./storage"
import { FlightData, fetchFlightData } from "./api"
import type { TransactionStatus, FlightUpdates } from "@/types/flight"

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x524D29349a2d7E534eec248990B8e9C606DeB8C9"

// Updated ABI to match new contract
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "flightNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "arrivalCity",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "departureCity",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "operatingAirline",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "arrivalGate",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "departureGate",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "flightStatus",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "equipmentModel",
        "type": "string"
      }
    ],
    "name": "FlightDataSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "flightNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "flight_times",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "status",
        "type": "string"
      }
    ],
    "name": "FlightStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "expiry",
        "type": "uint256"
      }
    ],
    "name": "Subscribed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "ArrivalUTC",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "DepartureUTC",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "estimatedArrivalUTC",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "estimatedDepartureUTC",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "scheduledArrivalUTC",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "scheduledDepartureUTC",
        "type": "string"
      }
    ],
    "name": "UTCTimeSet",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "UtcTimes",
    "outputs": [
      {
        "internalType": "string",
        "name": "ArrivalUTC",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "DepartureUTC",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "estimatedArrivalUTC",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "estimatedDepartureUTC",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "scheduledArrivalUTC",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "scheduledDepartureUTC",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "checkFlightStatus",
    "outputs": [
      {
        "internalType": "string",
        "name": "flightStatusCode",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "flightStatusDescription",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "outUtc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "offUtc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "onUtc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "inUtc",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "flightNumbers",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "flights",
    "outputs": [
      {
        "internalType": "string",
        "name": "flightNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "arrivalCity",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "departureCity",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "operatingAirline",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "arrivalGate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "departureGate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "flightStatus",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "equipmentModel",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "flightNumber",
        "type": "string"
      }
    ],
    "name": "getFlightData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "flightNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "arrivalCity",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "departureCity",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "operatingAirline",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "arrivalGate",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "departureGate",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "flightStatus",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "equipmentModel",
            "type": "string"
          }
        ],
        "internalType": "struct FlightStatusOracle.FlightData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "flightNumber",
        "type": "string"
      }
    ],
    "name": "getFlightStatus",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "flightdata",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "Utctimes",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "status",
        "type": "string[]"
      }
    ],
    "name": "setFlightData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "months",
        "type": "uint256"
      }
    ],
    "name": "subscribe",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "subscriptions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

type FlightPhase = "not_departed" | "out" | "off" | "on" | "in"

export class FlightContractService {
  private contract: ethers.Contract
  private provider: ethers.Provider

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }

  // Get flight data from contract
  async getFlightData(flightNumber: string): Promise<FlightData> {
    try {
      // Fetch flight data and status from the contract
      const data = await this.contract.getFlightData(flightNumber);
      const statusData = await this.contract.checkFlightStatus(flightNumber);

      // Determine phase based on status
      const phase = this.getPhaseFromStatus(statusData.flightStatusDescription);
      const statusCode = statusData.flightStatusCode || "NDPT";
      const isCanceled = statusCode === "CNCL";

      // Return the flight data using the correct keys from the contract
      return {
        flightNumber: data.flightNumber,
        estimatedArrivalUTC: data.estimatedArrivalUTC,
        estimatedDepartureUTC: data.estimatedDepartureUTC,
        arrivalCity: data.arrivalCity,
        departureCity: data.departureCity,
        operatingAirline: data.operatingAirline,
        departureGate: data.departureGate,
        arrivalGate: data.arrivalGate,
        flightStatus: data.flightStatus,
        statusCode, // Using the status code that was fetched
        equipmentModel: data.equipmentModel,
        phase, // Phase derived from flight status
        departureTerminal: data.departureTerminal || "TBD", // Handling undefined fields
        arrivalTerminal: data.arrivalTerminal || "TBD",
        actualDepartureUTC: data.actualDepartureUTC,
        actualArrivalUTC: data.actualArrivalUTC,
        outTimeUTC: data.outTimeUTC,
        offTimeUTC: data.offTimeUTC,
        onTimeUTC: data.onTimeUTC,
        inTimeUTC: data.inTimeUTC,
        baggageClaim: data.baggageClaim || "TBD", // Default to "TBD" if not available
        departureDelayMinutes: data.departureDelayMinutes || 0, // Default to 0 if not available
        arrivalDelayMinutes: data.arrivalDelayMinutes || 0, // Default to 0 if not available
        boardingTime: data.boardingTime || "TBD", // Handle missing fields
        isCanceled,
        scheduledArrivalUTCDateTime: data.scheduledArrivalUTCDateTime,
        scheduledDepartureUTCDateTime: data.scheduledDepartureUTCDateTime,
      };
    } catch (error) {
      console.error("Error fetching flight data:", error);
      throw error;
    }
  }



  // Helper method to determine phase from status
  // Helper function to determine the flight phase based on the flight status description
  getPhaseFromStatus(statusDescription: string): FlightPhase {
    switch (statusDescription) {
      case "Departed":
        return "out";
      case "In Flight":
        return "on";
      case "Landed":
        return "in";
      case "Not Departed":
        return "not_departed";
      default:
        return "not_departed"; // Default phase if status is not recognized
    }
  }


  // Setup event listener for flight updates
  setupFlightUpdateListener(flightNumber: string, callback: (updates: FlightUpdates) => void) {
    // Listen for FlightStatusUpdated events
    const statusHandler = (updatedFlightNumber: string, flight_times: string, status: string) => {
      if (updatedFlightNumber === flightNumber) {
        const update = {
          field: "flightStatus",
          newValue: status,
          timestamp: Date.now(),
        }

        callback({
          flightNumber,
          updates: [update],
        })

        // Save update to local storage
        storageService.saveTransaction({
          hash: `status_${Date.now()}`,
          status: "completed",
          type: "update",
          timestamp: Date.now(),
          flightNumber,
          updatedFields: ["flightStatus"],
        })
      }
    }

    // Listen for FlightDataSet events
    const dataHandler = (
      updatedFlightNumber: string,
      arrivalUTC: string,
      departureUTC: string,
      arrivalCity: string,
      departureCity: string,
      operatingAirline: string,
      arrivalGate: string,
      departureGate: string,
      flightStatus: string,
      equipmentModel: string,
    ) => {
      if (updatedFlightNumber === flightNumber) {
        const updates = [
          { field: "arrivalUTC", newValue: arrivalUTC, timestamp: Date.now() },
          { field: "departureUTC", newValue: departureUTC, timestamp: Date.now() },
          { field: "arrivalCity", newValue: arrivalCity, timestamp: Date.now() },
          { field: "departureCity", newValue: departureCity, timestamp: Date.now() },
          { field: "operatingAirline", newValue: operatingAirline, timestamp: Date.now() },
          { field: "arrivalGate", newValue: arrivalGate, timestamp: Date.now() },
          { field: "departureGate", newValue: departureGate, timestamp: Date.now() },
          { field: "flightStatus", newValue: flightStatus, timestamp: Date.now() },
          { field: "equipmentModel", newValue: equipmentModel, timestamp: Date.now() },
        ]

        callback({
          flightNumber,
          updates,
        })

        // Save update to local storage
        storageService.saveTransaction({
          hash: `update_${Date.now()}`,
          status: "completed",
          type: "update",
          timestamp: Date.now(),
          flightNumber,
          updatedFields: Object.keys(updates),
        })
      }
    }

    this.contract.on("FlightStatusUpdated", statusHandler)
    this.contract.on("FlightDataSet", dataHandler)

    return () => {
      this.contract.off("FlightStatusUpdated", statusHandler)
      this.contract.off("FlightDataSet", dataHandler)
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

  // Store flight data
  async storeFlightData(flightNumber: string): Promise<TransactionStatus> {
    try {
      // Fetch real data from API
      const apiData = await fetchFlightData(flightNumber)


      // Separate the data into the three required arrays for the contract
      const flightdata = [
        flightNumber,
        apiData.arrivalCity,
        apiData.departureCity,
        apiData.operatingAirline,
        apiData.arrivalGate || "",
        apiData.departureGate || "",
        apiData.flightStatus || "",
        apiData.equipmentModel || ""
      ];

      const Utctimes = [
        apiData.actualArrivalUTC || "", // ArrivalUTC
        apiData.actualDepartureUTC || "", // DepartureUTC
        apiData.estimatedArrivalUTC || "", // estimatedArrivalUTC
        apiData.estimatedDepartureUTC || "", // estimatedDepartureUTC
        apiData.scheduledArrivalUTCDateTime || "", // scheduledArrivalUTC
        apiData.scheduledDepartureUTCDateTime || "" // scheduledDepartureUTC
      ];

      const status = [
        apiData.statusCode || "NDPT", // statusCode
        apiData.flightStatus || "Not Available", // statusDescription - using flightStatus as fallback
        apiData.outTimeUTC || "",
        apiData.offTimeUTC || "",
        apiData.onTimeUTC || "", // This should be onTimeUTC, not inTimeUTC, based on API structure
        apiData.inTimeUTC || ""
      ];

      // Call the contract's setFlightData method with the three arrays
      const tx = await this.contract.setFlightData(flightdata, Utctimes, status);

      // Wait for the transaction to be mined
      await tx.wait();
      storageService.updateTransactionStatus(tx.hash, "completed");

      return {
        hash: tx.hash,
        status: "completed",
        type: "set",
        timestamp: Date.now(),
        flightNumber,
      };
    } catch (error) {
      console.error("Error storing flight data:", error);
      throw error;
    }
  }


}

