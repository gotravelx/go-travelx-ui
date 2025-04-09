import { Web3Provider } from "@/contexts/web3-context"
import type React from "react"

export default function FlifoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Web3Provider>{children}</Web3Provider>
}
