"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { usePathname, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, HelpCircle, Wallet, Chrome, ExternalLink, Globe, Info } from "lucide-react"
import MetaMaskGuidePage from "@/app/metamask-guide/page"
import { ThemeToggle } from "@/components/theme-switcher"

interface Web3ContextType {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  walletAddress: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isMetaMaskInstalled: boolean
  showMetaMaskInfo: () => void
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

// Local storage keys
const STORAGE_KEY_WALLET_CONNECTED = "walletConnected"
const STORAGE_KEY_WALLET_ADDRESS = "walletAddress"

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [isDetectingWallet, setIsDetectingWallet] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if MetaMask is installed
  useEffect(() => {
    if (!isMounted) return

    const checkMetaMask = () => {
      const hasEthereum = typeof window !== "undefined" && window.ethereum !== undefined
      const isMetaMask = hasEthereum && window.ethereum.isMetaMask
      setIsMetaMaskInstalled(isMetaMask)
    }

    checkMetaMask()
  }, [isMounted])

  // Restore wallet connection from localStorage on mount
  useEffect(() => {
    if (!isMounted) return

    const restoreConnection = async () => {
      if (typeof window === "undefined") return

      setIsDetectingWallet(true) // Start detection loading

      try {
        const savedIsConnected = localStorage.getItem(STORAGE_KEY_WALLET_CONNECTED)
        const savedWalletAddress = localStorage.getItem(STORAGE_KEY_WALLET_ADDRESS)

        if (savedIsConnected === "true" && savedWalletAddress && window.ethereum) {
          // Verify the wallet is still connected by checking accounts
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })

          if (accounts && accounts.length > 0) {
            // Wallet is still connected
            setIsConnected(true)
            setWalletAddress(savedWalletAddress)
          } else {
            // Wallet was disconnected from MetaMask side
            clearConnectionData()
          }
        }
      } catch (err) {
        console.error("Error restoring wallet connection:", err)
        clearConnectionData()
      } finally {
        setIsDetectingWallet(false) // End detection loading
      }
    }

    restoreConnection()
  }, [isMounted])

  // Save connection data to localStorage
  const saveConnectionData = (address: string) => {
    if (typeof window === "undefined") return

    localStorage.setItem(STORAGE_KEY_WALLET_CONNECTED, "true")
    localStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, address)
  }

  // Clear connection data from localStorage
  const clearConnectionData = () => {
    if (typeof window === "undefined") return

    localStorage.removeItem(STORAGE_KEY_WALLET_CONNECTED)
    localStorage.removeItem(STORAGE_KEY_WALLET_ADDRESS)
  }

  // Connect wallet and initialize contract service
  const connectWallet = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        setShowInfoDialog(true)
        throw new Error("MetaMask not installed")
      }

      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setWalletAddress(address)
      setIsConnected(true)

      // Save connection state to localStorage
      saveConnectionData(address)
    } catch (err) {
      if (typeof window !== "undefined" && !window.ethereum) {
        setShowInfoDialog(true)
      }
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = useCallback(() => {
    setIsConnected(false)
    setWalletAddress("")

    // Clear connection data from localStorage
    clearConnectionData()
  }, [])

  const showMetaMaskInfo = () => {
    setShowInfoDialog(true)
  }

  const navigateToGuide = () => {
    setShowInfoDialog(false)
    router.push("/metamask-guide")
  }

  // Listen for account changes
  useEffect(() => {
    if (!isMounted) return

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet from the MetaMask extension
          disconnectWallet()
        } else if (accounts[0] !== walletAddress) {
          // User switched to a different account
          setWalletAddress(accounts[0])
          saveConnectionData(accounts[0])
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [disconnectWallet, walletAddress, isMounted])

  // MetaMask connection UI
  const MetaMaskConnectionUI = () => (
    <>
      <div className="flex justify-center p-4 w-full max-w-5xl relative">
        <div className="absolute right-4 top-4 z-50">
          <ThemeToggle />
        </div>

        {isDetectingWallet ? (
          <Card className="w-[80%] glass-card sm:w-[500px]">
            <CardHeader>
              <CardTitle>Detecting Wallet</CardTitle>
              <CardDescription>Checking for connected wallet...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <div className="border-b-2 border-primary h-12 rounded-full w-12 animate-spin"></div>
              </div>
              <p className="text-center text-muted-foreground text-sm">
                Please wait while we detect your wallet connection
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card max-w-5xl">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Connect your MetaMask wallet to access GoTravelX</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button className="w-full gradient-border" onClick={connectWallet} disabled={isLoading}>
                <Wallet className="h-4 w-4 mr-2" />
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </Button>

              {!isMetaMaskInstalled && (
                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>MetaMask is not installed. Please install it to use GoTravelX.</AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <button
                  onClick={showMetaMaskInfo}
                  className="text-primary text-sm hover:underline inline-flex items-center"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
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
              <DialogTitle>{isMetaMaskInstalled ? "About MetaMask" : "MetaMask Required"}</DialogTitle>
              <DialogDescription>
                {isMetaMaskInstalled
                  ? "MetaMask is a secure wallet for blockchain applications."
                  : "You need to install MetaMask to use GoTravelX."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-muted/50 border p-4 rounded-lg">
                <h3 className="flex font-medium items-center mb-2">
                  <Info className="h-4 w-4 mr-2" />
                  What is MetaMask?
                </h3>
                <p className="text-muted-foreground text-sm">
                  MetaMask is a digital wallet that allows you to interact with blockchain applications. It's secure,
                  easy to use, and gives you control over your digital assets.
                </p>
              </div>

              <div className="bg-muted/50 border p-4 rounded-lg">
                <h3 className="flex font-medium items-center mb-2">
                  <Info className="h-4 w-4 mr-2" />
                  Why do I need it for GoTravelX?
                </h3>
                <p className="text-muted-foreground text-sm">
                  GoTravelX uses blockchain technology to provide secure and transparent flight subscriptions. MetaMask
                  allows you to connect to this system and manage your subscriptions.
                </p>
              </div>

              {!isMetaMaskInstalled && (
                <div className="space-y-3">
                  <h3 className="font-medium">Install MetaMask:</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <a
                      href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex border p-3 rounded-md gap-2 hover:bg-muted items-center transition-colors"
                    >
                      <Chrome className="h-5 text-blue-500 w-5" />
                      <div>
                        <p className="font-medium">Chrome</p>
                        <p className="text-muted-foreground text-xs">Google Chrome</p>
                      </div>
                    </a>

                    <a
                      href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex border p-3 rounded-md gap-2 hover:bg-muted items-center transition-colors"
                    >
                      <ExternalLink className="h-5 text-orange-500 w-5" />
                      <div>
                        <p className="font-medium">Firefox</p>
                        <p className="text-muted-foreground text-xs">Firefox Add-ons</p>
                      </div>
                    </a>

                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex border p-3 rounded-md gap-2 hover:bg-muted items-center transition-colors"
                    >
                      <Globe className="h-5 text-green-500 w-5" />
                      <div>
                        <p className="font-medium">Other</p>
                        <p className="text-muted-foreground text-xs">All Browsers</p>
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
                <Button variant="outline" onClick={() => setShowInfoDialog(false)}>
                  Close
                </Button>

                {isMetaMaskInstalled && <Button onClick={connectWallet}>Connect Now</Button>}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )

  // Only render children when mounted to prevent hydration errors
  if (!isMounted) {
    return null
  }

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
      {isConnected ? children : pathname === "/metamask-guide" ? <MetaMaskGuidePage /> : <MetaMaskConnectionUI />}
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

