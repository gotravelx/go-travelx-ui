"use client"

import { useState } from "react"
import type { StoredTransaction } from "@/services/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2, XCircle, Clock, History, Wallet } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

interface TransactionHistoryProps {
  transactions: StoredTransaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [activeTab, setActiveTab] = useState<"flights" | "subscriptions">("flights")

  const sortedTransactions = [...transactions]
    .filter((tx) => (activeTab === "flights" ? tx.flightNumber !== "subscription" : tx.flightNumber === "subscription"))
    .sort((a, b) => b.timestamp - a.timestamp)

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex)

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

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), "MM/dd/yyyy HH:mm:ss")
  }

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash)
    toast.success("Transaction hash copied to clipboard")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "flights" | "subscriptions")
    setCurrentPage(1) // Reset to first page when switching tabs
  }

  if (transactions.length === 0) return null

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flights" onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="flights" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Flight History
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Subscription History
              </TabsTrigger>
            </TabsList>

            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 rows per page</SelectItem>
                <SelectItem value="10">10 rows per page</SelectItem>
                <SelectItem value="20">20 rows per page</SelectItem>
                <SelectItem value="50">50 rows per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="flights" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Flight Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Updated Fields</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((tx) => (
                      <TableRow key={tx.hash} className="group hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">{formatTime(tx.timestamp)}</TableCell>
                        <TableCell>{tx.flightNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tx.type === "set" ? "New Flight" : "Update"}</Badge>
                        </TableCell>
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
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((tx) => (
                      <TableRow key={tx.hash} className="group hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">{formatTime(tx.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Subscription</Badge>
                        </TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, sortedTransactions.length)} of{" "}
                {sortedTransactions.length} entries
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

