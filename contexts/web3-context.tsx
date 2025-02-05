"use client"

import { createContext, useContext, useState } from "react"
import { ethers } from "ethers"

// Contract configuration
const flightSubscriptionAddress = "0x617Cc2481DDb5c3f22Bdefad3C62b6AC33Fdf9c8"
const flightSubscriptionAbi = [
  {
    inputs: [{ internalType: "address", name: "flightSearchAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "string", name: "flightNumber", type: "string" }],
    name: "searchFlight",
    outputs: [
      {
        components: [
          { internalType: "string", name: "FlightNumber", type: "string" },
          { internalType: "string", name: "FlightOriginationDate", type: "string" },
          { internalType: "string", name: "ArrivalUTCDateTime", type: "string" },
          { internalType: "string", name: "DepartureUTCDateTime", type: "string" },
          { internalType: "string", name: "partner", type: "string" },
          { internalType: "string", name: "Fleet", type: "string" },
          { internalType: "string", name: "ArrivalGate", type: "string" },
          { internalType: "string", name: "FlightType", type: "string" },
          { internalType: "string", name: "ArrivalTermimal", type: "string" },
          { internalType: "string", name: "EstimatedArrivalUTCTime", type: "string" },
          { internalType: "string", name: "EstimatedDepartureUTCTime", type: "string" },
          { internalType: "string", name: "DepartureAirport", type: "string" },
          { internalType: "string", name: "ArrivalAirport", type: "string" },
        ],
        internalType: "struct FlightSearch.Flight",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "months", type: "uint256" }],
    name: "subscribe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

type Web3ContextType = {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  connectWallet: () => Promise<void>
  subscribeToService: (months: number) => Promise<void>
  searchFlight: (flightNumber: string) => Promise<any>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  const connectWallet = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed")
      }

      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const flightContract = new ethers.Contract(flightSubscriptionAddress, flightSubscriptionAbi, signer)

      setContract(flightContract)
      setIsConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToService = async (months: number) => {
    if (!contract) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const tx = await contract.subscribe(months)
      await tx.wait()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const searchFlight = async (flightNumber: string) => {
    if (!contract) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const flight = await contract.searchFlight(flightNumber)
      return {
        FlightNumber: flight[0],
        FlightOriginationDate: flight[1],
        ArrivalUTCDateTime: flight[2],
        DepartureUTCDateTime: flight[3],
        partner: flight[4],
        Fleet: flight[5],
        ArrivalGate: flight[6],
        FlightType: flight[7],
        ArrivalTermimal: flight[8],
        EstimatedArrivalUTCTime: flight[9],
        EstimatedDepartureUTCTime: flight[10],
        DepartureAirport: flight[11],
        ArrivalAirport: flight[12],
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch flight data")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        isLoading,
        error,
        connectWallet,
        subscribeToService,
        searchFlight,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

