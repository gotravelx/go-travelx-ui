// Local storage service for managing transaction history
export interface StoredTransaction {
  hash: string
  status: "pending" | "completed" | "failed"
  type: "set" | "update"
  timestamp: number
  flightNumber: string
  updatedFields?: string[]
}

const STORAGE_KEY = "flight_transactions"

export const storageService = {
  // Save transaction to local storage
  saveTransaction(transaction: StoredTransaction) {
    const transactions = this.getTransactions()
    transactions.push(transaction)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  },

  // Get all transactions from local storage
  getTransactions(): StoredTransaction[] {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  // Get transactions for a specific flight
  getFlightTransactions(flightNumber: string): StoredTransaction[] {
    return this.getTransactions().filter((tx) => tx.flightNumber === flightNumber)
  },

  // Update transaction status
  updateTransactionStatus(hash: string, status: StoredTransaction["status"]) {
    const transactions = this.getTransactions()
    const index = transactions.findIndex((tx) => tx.hash === hash)
    if (index !== -1) {
      transactions[index].status = status
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    }
  },

  // Clear all transactions
  clearTransactions() {
    localStorage.removeItem(STORAGE_KEY)
  },
}

