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
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  HelpCircle,
  Wallet,
  Chrome,
  ExternalLink,
  Globe,
  Info,
} from "lucide-react";
import MetaMaskGuidePage from "@/app/metamask-guide/page";
import { ThemeToggle } from "@/components/theme-switcher";

interface Web3ContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  walletAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
  showMetaMaskInfo: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEY_WALLET_CONNECTED = "walletConnected";
const STORAGE_KEY_WALLET_ADDRESS = "walletAddress";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [currentFlightNumber, setCurrentFlightNumber] = useState<string | null>(
    null
  );
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  // Add a new state for wallet detection loading
  const [isDetectingWallet, setIsDetectingWallet] = useState(true);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const hasEthereum =
        typeof window !== "undefined" && window.ethereum !== undefined;
      const isMetaMask = hasEthereum && window.ethereum.isMetaMask;
      setIsMetaMaskInstalled(isMetaMask);
    };

    checkMetaMask();
  }, []);

  // Restore wallet connection from localStorage on mount
  useEffect(() => {
    const restoreConnection = async () => {
      if (typeof window === "undefined") return;

      setIsDetectingWallet(true); // Start detection loading

      try {
        const savedIsConnected = localStorage.getItem(
          STORAGE_KEY_WALLET_CONNECTED
        );
        const savedWalletAddress = localStorage.getItem(
          STORAGE_KEY_WALLET_ADDRESS
        );

        if (
          savedIsConnected === "true" &&
          savedWalletAddress &&
          window.ethereum
        ) {
          // Verify the wallet is still connected by checking accounts
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0) {
            // Wallet is still connected
            setIsConnected(true);
            setWalletAddress(savedWalletAddress);
          } else {
            // Wallet was disconnected from MetaMask side
            clearConnectionData();
          }
        }
      } catch (err) {
        console.error("Error restoring wallet connection:", err);
        clearConnectionData();
      } finally {
        setIsDetectingWallet(false); // End detection loading
      }
    };

    restoreConnection();
  }, []);

  // Save connection data to localStorage
  const saveConnectionData = (address: string) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY_WALLET_CONNECTED, "true");
    localStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, address);
  };

  // Clear connection data from localStorage
  const clearConnectionData = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEY_WALLET_CONNECTED);
    localStorage.removeItem(STORAGE_KEY_WALLET_ADDRESS);
  };

  // Connect wallet and initialize contract service
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        setShowInfoDialog(true);
        throw new Error("MetaMask not installed");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setIsConnected(true);

      // Save connection state to localStorage
      saveConnectionData(address);
    } catch (err) {
      if (typeof window !== "undefined" && !window.ethereum) {
        setShowInfoDialog(true);
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

    // Clear connection data from localStorage
    clearConnectionData();
  }, []);

  const showMetaMaskInfo = () => {
    setShowInfoDialog(true);
  };

  const navigateToGuide = () => {
    setShowInfoDialog(false);
    router.push("/metamask-guide");
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet from the MetaMask extension
          disconnectWallet();
        } else if (accounts[0] !== walletAddress) {
          // User switched to a different account
          setWalletAddress(accounts[0]);
          saveConnectionData(accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [disconnectWallet, walletAddress]);

  // MetaMask connection UI
  const MetaMaskConnectionUI = () => (
    <>
      <div className="flex relative justify-center p-4">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {isDetectingWallet ? (
          <Card className="glass-card max-w-md w-full">
            <CardHeader>
              <CardTitle>Detecting Wallet</CardTitle>
              <CardDescription>
                Checking for connected wallet...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Please wait while we detect your wallet connection
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card max-w-md w-full">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Connect your MetaMask wallet to access GoTravelX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full gradient-border"
                onClick={connectWallet}
                disabled={isLoading}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </Button>

              {!isMetaMaskInstalled && (
                <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    MetaMask is not installed. Please install it to use
                    GoTravelX.
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <button
                  onClick={showMetaMaskInfo}
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <HelpCircle className="mr-1 h-3 w-3" />
                  What is MetaMask and why do I need it?
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MetaMask Info Dialog remains unchanged */}
        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {isMetaMaskInstalled ? "About MetaMask" : "MetaMask Required"}
              </DialogTitle>
              <DialogDescription>
                {isMetaMaskInstalled
                  ? "MetaMask is a secure wallet for blockchain applications."
                  : "You need to install MetaMask to use GoTravelX."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <h3 className="font-medium mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  What is MetaMask?
                </h3>
                <p className="text-sm text-muted-foreground">
                  MetaMask is a digital wallet that allows you to interact with
                  blockchain applications. It's secure, easy to use, and gives
                  you control over your digital assets.
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <h3 className="font-medium mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Why do I need it for GoTravelX?
                </h3>
                <p className="text-sm text-muted-foreground">
                  GoTravelX uses blockchain technology to provide secure and
                  transparent flight subscriptions. MetaMask allows you to
                  connect to this system and manage your subscriptions.
                </p>
              </div>

              {!isMetaMaskInstalled && (
                <div className="space-y-3">
                  <h3 className="font-medium">Install MetaMask:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted transition-colors"
                    >
                      <Chrome className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Chrome</p>
                        <p className="text-xs text-muted-foreground">
                          Google Chrome
                        </p>
                      </div>
                    </a>

                    <a
                      href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Firefox</p>
                        <p className="text-xs text-muted-foreground">
                          Firefox Add-ons
                        </p>
                      </div>
                    </a>

                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted transition-colors"
                    >
                      <Globe className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Other</p>
                        <p className="text-xs text-muted-foreground">
                          All Browsers
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" onClick={navigateToGuide}>
                View detailed installation guide
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowInfoDialog(false)}
                >
                  Close
                </Button>

                {isMetaMaskInstalled && (
                  <Button onClick={connectWallet}>Connect Now</Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

  // Update the provider return to handle the detecting state
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
        showMetaMaskInfo,
      }}
    >
      {isConnected ? (
        children
      ) : pathname === "/metamask-guide" ? (
        <MetaMaskGuidePage />
      ) : (
        <MetaMaskConnectionUI />
      )}
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
