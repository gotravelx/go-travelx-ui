class ContractService {
  private walletAddress = "0x876474671AEe7AC87800A0B99e9e31A625cdF95F"

  async getWalletAddress(): Promise<string> {
    return this.walletAddress
  }
}

export const contractService = new ContractService()
