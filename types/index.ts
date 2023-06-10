export interface QueryData {
  transactionHash: string
  executedHash?: string
  id: string
  status: number
  sender: string
  from: number,
  createdAt: Date
}

export interface QueryRequest {
  dstChainId: number
  height: number
  slot: string
  to: string
}
