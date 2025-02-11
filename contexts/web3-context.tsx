"use client";

import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

// Contract configuration
const flightContractAddress = "0xE9b4A9a470c69b376B1644658587F5d501CCeFeb";
const flightContractAbi = [
  {
    inputs: [{ internalType: "string", name: "flightNumber", type: "string" }],
    name: "getFlightData",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "bool", name: "", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "months", type: "uint256" }],
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

interface FlightData {
  flightNumber: string;
  estimatedArrivalUTC: string;
  estimatedDepartureUTC: string;
  arrivalCity: string;
  departureCity: string;
  operatingAirline: string;
  departureGate: string;
  arrivalGate: string;
  flightStatus: string;
  equipmentModel: string;
  exists: boolean;
}

type Web3ContextType = {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  subscribeToService: (months: number, value: string) => Promise<void>;
  searchFlight: (flightNumber: string) => Promise<FlightData>;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const flightContract = new ethers.Contract(
        flightContractAddress,
        flightContractAbi,
        signer
      );

      setContract(flightContract);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToService = async (months: number, value: string) => {
    if (!contract) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.subscribe(months, {
        value: ethers.parseEther(value),
      });
      await tx.wait();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchFlight = async (flightNumber: string): Promise<FlightData> => {
    if (!contract) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contract.getFlightData(flightNumber);

      return {
        flightNumber: result[5],
        estimatedDepartureUTC: result[1],
        estimatedArrivalUTC: result[0],
        departureCity: result[2],
        arrivalCity: result[3], 
        operatingAirline: result[4],
        departureGate: result[6],
        arrivalGate: result[7],
        flightStatus: result[8],
        equipmentModel: result[9],
        exists: result[10],
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch flight data"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}