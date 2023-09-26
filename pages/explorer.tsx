import { NextPage } from 'next'
import Transaction from 'components/Transaction'
import { useTransaction } from 'hooks/useTransaction'

const Explorer: NextPage = () => {
  const { allTransactions } = useTransaction()
  return (
    <>
      <div>
        <h2 className='text-3xl font-semibold my-6'>Transactions</h2>
        <Transaction queryData={allTransactions} rowsPerPage={15} />
      </div>
    </>
  )
}

export default Explorer
