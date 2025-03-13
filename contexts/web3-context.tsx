"use client";

import type React from "react";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { MetaMaskPopup } from "@/components/metamask-popup";

interface Web3ContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  walletAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
  showMetaMaskPopup: boolean;
  closeMetaMaskPopup: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");

  const [currentFlightNumber, setCurrentFlightNumber] = useState<string | null>(
    null
  );

  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [showMetaMaskPopup, setShowMetaMaskPopup] = useState(false);

  useEffect(() => {
    const checkMetaMask = () => {
      const isInstalled =
        typeof window !== "undefined" && window.ethereum !== undefined;
      setIsMetaMaskInstalled(isInstalled);
    };

    checkMetaMask();
  }, []);

  // Connect wallet and initialize contract service
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        setShowMetaMaskPopup(true);
        throw new Error("MetaMask not installed");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setIsConnected(true);
    } catch (err) {
      if (!window.ethereum) {
        setShowMetaMaskPopup(true);
      }
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress("");
    setCurrentFlightNumber(null);
  }, []);

  const closeMetaMaskPopup = () => {
    setShowMetaMaskPopup(false);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", disconnectWallet);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", disconnectWallet);
      }
    };
  }, [disconnectWallet]);

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        isLoading,
        error,
        walletAddress,
        connectWallet,
        disconnectWallet,
        isMetaMaskInstalled,
        showMetaMaskPopup,
        closeMetaMaskPopup,
      }}
    >
      <MetaMaskPopup
        isOpen={showMetaMaskPopup}
        onClose={closeMetaMaskPopup}
        isMetaMaskInstalled={isMetaMaskInstalled}
      />
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
