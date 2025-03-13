"use client";
import {
  AlertCircle,
  Chrome,
  ChromeIcon as Firefox,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MetaMaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isMetaMaskInstalled: boolean;
}

export function MetaMaskPopup({
  isOpen,
  onClose,
  isMetaMaskInstalled,
}: MetaMaskPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            {isMetaMaskInstalled
              ? "MetaMask Not Connected"
              : "MetaMask Not Detected"}
          </DialogTitle>
          <DialogDescription>
            {isMetaMaskInstalled
              ? "Please connect your MetaMask wallet to continue using GoTravelX."
              : "MetaMask is required to use GoTravelX. Please install it to continue."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isMetaMaskInstalled ? (
            <>
              <p className="text-sm text-muted-foreground">
                Install MetaMask using one of the following browser extensions:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      Google Chrome Store
                    </p>
                  </div>
                </a>

                <a
                  href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted transition-colors"
                >
                  <Firefox className="h-5 w-5 text-orange-500" />
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
                  className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted transition-colors sm:col-span-2"
                >
                  <Globe className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Other Browsers</p>
                    <p className="text-xs text-muted-foreground">
                      Visit MetaMask official website
                    </p>
                  </div>
                </a>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/metamask-guide"
                  className="text-sm text-primary hover:underline"
                >
                  View detailed installation guide
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">
                Please unlock your MetaMask extension and connect to this site
                to continue.
              </p>

              <div className="flex justify-center">
                <Button onClick={onClose} className="w-full sm:w-auto">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
