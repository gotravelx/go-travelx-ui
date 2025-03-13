"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/web3-context";
import { showCustomToast } from "@/components/custom-toast";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function WalletConnectCard() {
  const {
    connectWallet,
    isConnected,
    isLoading,
    error,
    isMetaMaskInstalled,
    showMetaMaskPopup,
    closeMetaMaskPopup,
  } = useWeb3();

  useEffect(() => {
    if (error) {
      showCustomToast({
        title: "Connection Error",
        description: error,
        type: "error",
      });
    }
  }, [error]);

  const handleConnectClick = async () => {
    if (!isMetaMaskInstalled) {
      // This will trigger the popup through the context
      await connectWallet();
    } else {
      await connectWallet();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect your wallet to access flight subscription services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            By connecting your wallet, you'll be able to subscribe to flight
            status updates and manage your subscriptions.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Button
          onClick={handleConnectClick}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Connecting..." : "Connect MetaMask"}
        </Button>

        <Link
          href="/metamask-guide"
          className="flex items-center text-sm text-primary hover:underline"
        >
          <HelpCircle className="mr-1 h-4 w-4" />
          Don't have MetaMask? Click here for help
        </Link>
      </CardFooter>
    </Card>
  );
}
