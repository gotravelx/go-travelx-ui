"use client"

import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface WalletInfoProps {
  address: string
}

export function WalletInfo({ address }: WalletInfoProps) {
  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    toast.success("Address copied to clipboard")
  }

  const formatAddress = (addr: string) => {
    return `${addr?.slice(0, 6)}...${addr?.slice(-4)}`
  }

  const formatTimeRemaining = (expiryDate: Date) => {
    const now = new Date()
    const diff = expiryDate.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${days}d ${hours}h remaining`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CardContent className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">{formatAddress(address)}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </TooltipTrigger>
        <TooltipContent>
          <p>Wallet Address</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
