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

export interface Voter {
  hasVoted: boolean
  vote: boolean
  weight: number
}

export interface ProposalData {
  id: number
  creator: string
  status: number
  yesVotes: number
  noVotes: number
  title: string
  description: string
  voters: string[]
  expirationTime: number
  height: number
  voterInfo: Voter[]
}

export type Deployment = {
  balance: string
  custom: string
  voting: string
}
