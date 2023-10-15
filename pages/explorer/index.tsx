import { NextPage } from 'next'
import { useTransaction } from 'hooks/useTransaction'
import { useEffect } from 'react'
import { Spinner } from '@nextui-org/react'
import dynamic from 'next/dynamic'
import createSupabase from 'utils/supabase'

const Transaction = dynamic(() => import('components/Transaction'))

const Explorer: NextPage = () => {
  const { allTransactions, fetchAllTransactions } = useTransaction()
  const supabase = createSupabase()

  useEffect(() => {
    fetchAllTransactions()
  }, [supabase])

  return (
    <>
      {allTransactions.length > 0 ? (
        <div>
          <h2 className='text-3xl font-semibold my-6'>Transactions</h2>
          <Transaction queryData={allTransactions} rowsPerPage={15} />
        </div>
      ) : (
        <div className='flex justify-center items-center h-screen'>
          <Spinner size='lg' color='success' />
        </div>
      )}
    </>
  )
}

export default Explorer
