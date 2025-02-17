import type { TransactionStatus } from "@/types/flight"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

interface TransactionHistoryProps {
  transactions: TransactionStatus[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getStatusIcon = (status: TransactionStatus["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
    }
  }

  const getStatusColor = (status: TransactionStatus["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500"
      case "failed":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-yellow-500/20 text-yellow-500"
    }
  }

  if (transactions?.length === 0) return null

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.map((tx) => (
            <div key={tx.hash} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                {getStatusIcon(tx?.status)}
                <div>
                  <p className="text-sm font-medium">
                    {tx.type === "set" ? "Store Flight Data" : "Update Flight Data"}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(tx?.status)}>{tx.status}</Badge>
                <a
                  href={`https://columbus.caminoscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

