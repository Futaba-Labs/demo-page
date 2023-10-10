import { ethers } from 'ethers'
import { GATEWAY_ABI } from './constants'

export class Rpc {
  private provider: ethers.providers.JsonRpcProvider

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this.provider = provider
  }

  getExplorerTransaction = async (txHash: string) => {
    try {
      const transaction = await this.provider.getTransaction(txHash)
      if (!transaction.blockHash) throw new Error('Invalid transaction hash')
      const block = await this.provider.getBlock(transaction.blockHash)

      return {
        sender: transaction.from,
        blockNumber: block.number,
        timestamp: block.timestamp,
      }
    } catch (error) {
      throw new Error('Invalid block hash')
    }
  }

  getSaveQueryEvent = async (gateway: string, queryId: string): Promise<[]> => {
    const contract = new ethers.Contract(gateway, GATEWAY_ABI, this.provider)

    const filter = contract.filters.ReceiveQuery(queryId, null, null, null, null)
    try {
      const event = await contract.queryFilter(filter)
      if (event.length === 0 || !event[0].args) return []
      return event[0].args.results
    } catch (error) {
      return []
    }
  }
}
