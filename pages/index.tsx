import { useFieldArray, useForm } from 'react-hook-form'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ChainStage, FutabaQueryAPI } from '@futaba-lab/sdk'
import { Button, Divider, Link } from '@nextui-org/react'
import InputForm from 'components/InputForm'
import { getBalanceSlot, getLatestBlockNumber, getTokenDecimals, showToast } from 'utils/helper'
import Transaction from 'components/Transaction'
import { useTransaction } from 'hooks/useTransaction'
import { useSupabase } from 'hooks/useSupabaseClient'
import Notice from 'components/Notice'
import { QueryRequest } from 'types'
import { BALANCE_QUERY_ABI } from 'utils'
import { useDeployment } from 'hooks'
import type { NextPage } from 'next'

export interface QueryForm {
  chain: string
  tokenAddress: string
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const { register, control, setValue } = useForm()
  const isDark = false
  const { transactions, allTransactions, fetchTransactionsBySender } = useTransaction()
  const supabase = useSupabase()
  const addRecentTransaction = useAddRecentTransaction()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'queries',
  })

  const { address, isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const deployment = useDeployment()

  const { data, isSuccess, write, isError } = useContractWrite({
    address: deployment.balance as `0x${string}`,
    abi: BALANCE_QUERY_ABI,
    functionName: 'sendQuery',
  })

  const sendQuery = async () => {
    if (!isConnected) return
    setLoading(true)
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      const queries: QueryRequest[] = []
      const decimals: number[] = []
      const results = []
      for (const f of control._formValues['queries']) {
        results.push(getTokenDecimals(f['chain'], f['tokenAddress']))
      }

      const items = await Promise.all(results)
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (!item) {
          showToast('Failed', 'error', isDark)
          setLoading(false)
          return
        }
        const tokenAddress = control._formValues['queries'][i]['tokenAddress']
        if (item.decimals === 0) {
          showToast('Invalid Token', 'error', isDark)
          setLoading(false)
          return
        }
        const blockHeight = await getLatestBlockNumber(item.chainName)
        if (!blockHeight) {
          showToast('Failed', 'error', isDark)
          setLoading(false)
          return
        }
        queries.push({
          dstChainId: item.chainId,
          height: blockHeight,
          slot: getBalanceSlot(address!),
          to: tokenAddress,
        })
        decimals.push(item.decimals)
      }

      try {
        if (isConnected) {
          const queryAPI = new FutabaQueryAPI(ChainStage.TESTNET, chain?.id as number)
          const fee = await queryAPI.estimateFee(queries)
          write({ args: [queries, decimals], value: fee.toBigInt() })
          return resolve()
        }
      } catch (error) {
        showToast('Transaction Failed', 'error', isDark)
        setLoading(false)
        return reject(error)
      }
    })
  }

  const fetchTxns = async () => {
    if (address) {
      fetchTransactionsBySender(address)
    }
  }

  useEffect(() => {
    fetchTxns()
  }, [supabase, allTransactions])

  useEffect(() => {
    if (data) {
      addRecentTransaction({
        hash: data.hash,
        description: 'Query Sent',
        confirmations: 5,
      })

      if (!isSuccess) {
        showToast('Transaction Failed', 'error', isDark)
      }
    }
    setLoading(false)
  }, [data])

  useEffect(() => {
    if (isError) {
      setLoading(false)
    }
  }, [isError])

  return (
    <>
      <div className='mx-auto'>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h1 className='text-4xl font-semibold my-4'>Futaba Demo 🌱</h1>
        <p className='text-2xl font-medium mb-3'>{"On this page you can experience Futaba's query. Let's try it 🚀"}</p>
        <Divider className='my-4' />
        <h2 className='text-3xl font-semibold mb-4'>Balance query</h2>
        <p className='text-lg font-normal mb-1'>
          Step1: Connect your wallet. You can use Metamask, WalletConnect and so on.
        </p>

        <p className='text-lg font-normal'>
          Step2: Select the chain and token address (only general erc20) you want to query. You can add multiple
          queries.
        </p>
        <p className='text-lg font-normal mb-1'>
          If you do not have a token, please mint it{' '}
          <Link
            href='https://staging.aave.com/faucet/?marketName=proto_goerli_v3'
            isExternal
            showAnchorIcon
            className='text-lg font-normal mb-1'
          >
            here
          </Link>
          {'.'}
        </p>
        <p className='text-lg font-normal mb-1'>{'Step3: Click the "Send Query" button to send the query.'}</p>
        <p className='text-lg font-normal mb-1'>
          {'Step4: You can check the query result on the "Your Transactions".'}
        </p>
      </div>
      <div>
        {fields.map((field, i) => (
          <div key={i}>
            <div style={{ padding: '16px' }}></div>
            <InputForm
              label='Token Address'
              index={i}
              setChain={setValue}
              registerToken={register(`queries.${i}.tokenAddress`)}
              onClick={() => remove(i)}
            />
          </div>
        ))}
        <div style={{ padding: '16px' }}></div>
        <div className='flex'>
          <Button
            onClick={() => append({ chain: '', tokenAddress: '' })}
            disabled={fields.length > 11}
            color='success'
            variant='flat'
            className='mr-4'
          >
            Add Query
          </Button>
          <Button
            onClick={() => {
              sendQuery()
            }}
            isLoading={loading}
            disabled={fields.length === 0 || isDisconnected}
            color='success'
            variant='flat'
          >
            {loading ? 'Sending' : 'Send Query'}
          </Button>
        </div>
      </div>
      <div>
        <div style={{ padding: '24px' }}></div>
        <h2 className='text-3xl font-semibold mb-4'>Your Transactions</h2>
        <Transaction queryData={transactions} rowsPerPage={5} />
      </div>
    </>
  )
}

export default Home
