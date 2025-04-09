"use client"

import { useEffect, useState } from "react"
import type { StoredTransaction } from "@/services/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface TransactionTableProps {
  transactions: StoredTransaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [sortedTransactions, setSortedTransactions] = useState<StoredTransaction[]>([])

  useEffect(() => {
    // Sort transactions by timestamp (newest first)
    setSortedTransactions([...transactions].sort((a, b) => b.timestamp - a.timestamp))
  }, [transactions])

  const getStatusIcon = (status: StoredTransaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
    }
  }

  const getStatusColor = (status: StoredTransaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500"
      case "failed":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-yellow-500/20 text-yellow-500"
    }
  }

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash)
    toast.success("Transaction hash copied to clipboard")
  }

  if (transactions.length === 0) return null

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Updated Fields</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((tx) => (
              <TableRow key={tx.hash}>
                <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tx.type === "set" ? "New Flight" : "Update"}</Badge>
                </TableCell>
                <TableCell>{tx.flightNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                    <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyHash(tx.hash)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <a
                      href={`https://columbus.caminoscan.com/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  {tx.updatedFields?.map((field) => (
                    <Badge key={field} variant="outline" className="mr-1">
                      {field}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
