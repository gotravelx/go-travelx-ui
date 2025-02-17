"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { FlightContractService } from "@/services/contract"
import type { FlightData } from "@/services/api"
import type { FlightUpdates } from "@/services/contract"
import { storageService, type StoredTransaction } from "@/services/storage"

interface Web3ContextType {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  walletAddress: string
  subscriptionExpiry: Date | null
  transactions: StoredTransaction[]
  flightUpdates: FlightUpdates | null
  connectWallet: () => Promise<void>
  subscribeToService: (months: number, value: string) => Promise<void>
  searchAndStoreFlight: (flightNumber: string) => Promise<FlightData>
  checkSubscription: () => Promise<void>
  disconnectWallet: () => void
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(null)
  const [contractService, setContractService] = useState<FlightContractService | null>(null)
  const [transactions, setTransactions] = useState<StoredTransaction[]>([])
  const [flightUpdates, setFlightUpdates] = useState<FlightUpdates | null>(null)
  const [currentFlightNumber, setCurrentFlightNumber] = useState<string | null>(null)

  // Load transactions from local storage
  useEffect(() => {
    setTransactions(storageService.getTransactions())
  }, [])

  // Connect wallet and initialize contract service
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
      const address = await signer.getAddress()

      const service = new FlightContractService(provider, signer)

      setContractService(service)
      setWalletAddress(address)
      setIsConnected(true)

      await checkSubscription()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = useCallback(() => {
    setIsConnected(false)
    setWalletAddress("")
    setSubscriptionExpiry(null)
    setContractService(null)
    setTransactions([])
    setFlightUpdates(null)
    setCurrentFlightNumber(null)
  }, [])

  const checkSubscription = async () => {
    if (!contractService || !walletAddress) return

    try {
      const expiry = await contractService.checkSubscription(walletAddress)
      setSubscriptionExpiry(expiry)
    } catch (err) {
      console.error("Error checking subscription:", err)
    }
  }

  const subscribeToService = async (months: number, value: string) => {
    if (!contractService) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const status = await contractService.subscribe(months, value)
      setTransactions(storageService.getTransactions())
      await checkSubscription()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const searchAndStoreFlight = async (flightNumber: string): Promise<FlightData> => {
    if (!contractService) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const status = await contractService.storeFlightData(flightNumber)
      setTransactions(storageService.getTransactions())

      const flightData = await contractService.getFlightData(flightNumber)
      setCurrentFlightNumber(flightNumber)

      return flightData
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch flight data")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Setup flight update listener when currentFlightNumber changes
  useEffect(() => {
    if (!contractService || !currentFlightNumber) return

    const cleanup = contractService.setupFlightUpdateListener(currentFlightNumber, (updates) => {
      setFlightUpdates(updates)
      setTransactions(storageService.getTransactions())
    })

    return cleanup
  }, [contractService, currentFlightNumber])

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", disconnectWallet)
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", disconnectWallet)
      }
    }
  }, [disconnectWallet])

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        isLoading,
        error,
        walletAddress,
        subscriptionExpiry,
        transactions,
        flightUpdates,
        connectWallet,
        subscribeToService,
        searchAndStoreFlight,
        checkSubscription,
        disconnectWallet,
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

