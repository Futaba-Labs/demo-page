import { NextPage } from 'next'
import Transaction from 'components/Transaction'
import { useTransaction } from 'hooks/useTransaction'

const Explorer: NextPage = () => {
  const { allTransactions } = useTransaction()
  return (
    <>
      <div>
        Transactions
        <Transaction queryData={allTransactions} rowsPerPage={15} />
      </div>
    </>
  )
}

export default Explorer
