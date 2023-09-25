import { useFieldArray, useForm } from 'react-hook-form'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ChainStage, FutabaQueryAPI } from '@futaba-lab/sdk'
import { Button, Link } from '@nextui-org/react'
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

  const { data, isSuccess, write } = useContractWrite({
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

  return (
    <>
      <div className='mx-auto'>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        Futaba Demo Page
        {"On this page you can experience Futaba's query."}
        {" Let's try it 🚀"}
        Step1: Connect your wallet. You can use Metamask, WalletConnect, or WalletLink. Step2: Select the chain and
        token address (only general erc20) you want to query. You can add multiple queries.
        <span>
          If you do not have a token, please mint it{' '}
          <Link href='https://staging.aave.com/faucet/?marketName=proto_goerli_v3' target='_blank'>
            here
          </Link>
        </span>{' '}
        {'Step3: Click the "Send Query" button to send the query.'}
        {'Step4: You can check the query result on the "Your Transactions".'}
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
        <div>
          <div>
            <Button onClick={() => append({ chain: '', tokenAddress: '' })} disabled={fields.length > 11}>
              Add Query
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                sendQuery()
              }}
              disabled={fields.length === 0 || isDisconnected || loading}
            >
              {loading ? <div /> : 'Send Query'}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div style={{ padding: '24px' }}></div>
        Your Transactions
        <Transaction queryData={transactions} rowsPerPage={5} />
      </div>
    </>
  )
}

export default Home
