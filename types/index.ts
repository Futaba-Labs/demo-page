export interface Transaction {
  requestTransactionHash: string
  responseTransactionHash?: string
  queryId?: string
  deliverStatus: number
  sender: string
  chainId: number
}
