import { Chip } from '@nextui-org/react'
import { NextPage } from 'next/types'
import { Transaction } from 'types'
import { omitText, getExploerUrl, calculateTimeDifference } from 'utils'
import CopySnippet from './CopySnippet'

type Props = {
  transaction: Transaction
  chainId: number
}

const TransactionCard: NextPage<Props> = ({ transaction, chainId }) => {
  return (
    <div className='flex flex-col gap-3'>
      <div>
        <p>Transaction hash</p>
        <CopySnippet
          displayedText={omitText(transaction.hash, 15, 15)}
          copyText={transaction.hash}
          link={getExploerUrl(chainId) + 'tx/' + transaction.hash}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <p>Block number</p>
        <p className='text-small'>{transaction.blockNumber}</p>
      </div>
      <div className='flex flex-col gap-2'>
        <p>Age</p>
        <p className='text-small'>{calculateTimeDifference(new Date(transaction.timestamp * 1000))}</p>
      </div>
      <div className=''>
        <p>Sender</p>
        <CopySnippet
          displayedText={omitText(transaction.sender, 15, 15)}
          copyText={transaction.sender}
          link={getExploerUrl(chainId) + 'address/' + transaction.sender}
        />
      </div>
    </div>
  )
}

export default TransactionCard
