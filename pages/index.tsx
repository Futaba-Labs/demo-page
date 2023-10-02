import { useFieldArray, useForm } from 'react-hook-form'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ChainStage, FutabaQueryAPI } from '@futaba-lab/sdk'
import { Button, Divider, Link } from '@nextui-org/react'
import NextLink from 'next/link'
import InputForm from 'components/InputForm'
import { getBalanceSlot, getLatestBlockNumber, getTokenDecimal, showToast } from 'utils/helper'
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
  const { register, control, setValue, watch } = useForm()

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
    setLoading(true)
    if (!isConnected || !chain || !address) {
      showToast('Failed', 'error', isDark)
      setLoading(false)
      return
    }

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      const queries: QueryRequest[] = []
      const decimals: number[] = []

      for (const value of control._formValues['queries']) {
        const chainId = parseInt(value['chain'])
        const tokenAddress = value['tokenAddress']
        const decimal = value['decimal']
        if (tokenAddress == '' || decimal.toString() == '') {
          showToast('Invalid token', 'error', isDark)
          setLoading(false)
          return reject('Invalid token')
        }

        const blockHeight = await getLatestBlockNumber(chainId)
        if (!blockHeight) {
          showToast('Failed', 'error', isDark)
          setLoading(false)
          return reject("Can't get block height")
        }

        const slot = getBalanceSlot(address)

        queries.push({
          dstChainId: chainId,
          height: blockHeight,
          slot: slot,
          to: tokenAddress,
        })

        decimals.push(parseInt(decimal))
      }

      if (queries.length == 0) {
        showToast('No queries', 'error', isDark)
        setLoading(false)
        return reject('No queries')
      }

      try {
        const queryAPI = new FutabaQueryAPI(ChainStage.TESTNET, chain?.id as number)
        const fee = await queryAPI.estimateFee(queries)
        console.log('Queries: ', queries)
        write({ args: [queries, decimals], value: fee.toBigInt() })
        return resolve()
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

  useEffect(() => {
    watch(async (value, { name, type }) => {
      if (!name) return
      if (type === 'change' && name.includes('queries')) {
        const result = name.match(/\d+/)
        if (result) {
          const index = result[0]
          let decimal = 18
          const d = await getTokenDecimal(
            parseInt(value['queries'][index]['chain']),
            value['queries'][index]['tokenAddress'],
          )
          if (!d) return
          decimal = d
          setValue(`queries.${index}.decimal`, decimal)
        }
      }
    })
  }, [watch])

  useEffect(() => {
    append({ chain: '', tokenAddress: '', decimal: 0 })
    return () => {
      remove(0)
    }
  }, [])

  return (
    <>
      <div className='mx-auto'>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h1 className='text-4xl font-semibold my-4'>Futaba Demo 🌱</h1>
        <p className='text-2xl font-medium mb-3'>{"On this page you can experience Futaba's query. Let's try it 🚀"}</p>
        <p>
          {'You can find detailed usage instructions in '}
          <Link
            href='https://futaba.gitbook.io/docs/guide/futaba-demo'
            isExternal
            showAnchorIcon
            color='primary'
            className='mb-1'
          >
            Guide
          </Link>
        </p>
        <Divider className='my-4' />
        <h2 className='text-3xl font-semibold mb-4'>Balance query</h2>
        <p className='text-lg font-normal mb-1'>
          Step1: Connect your wallet. You can use Metamask, WalletConnect and so on.
        </p>

        <p className='text-lg font-normal'>
          Step2: Select the chain and token address you want to query. But the only tokens that can be queried are those
          received from{' '}
          <Link href='/faucet' className='text-lg font-normal mb-1' as={NextLink}>
            Faucet
          </Link>
          {'. If you wish to query any ERC20 token, use '}
          <Link href='/custom' className='text-lg font-normal mb-1' as={NextLink}>
            Custom query
          </Link>
          {'.'}
        </p>
        <p className='text-lg font-normal mb-1'>{'Step3: Click the "Send Query" button to send the query.'}</p>
        <p className='text-lg font-normal mb-1'>
          {'Step4: You can check the query result on the "Your Transactions".'}
        </p>
        <p className='text-lg font-normal mb-1'>
          Step5: Checking the Explorer from the response transaction, you can see that new tokens have been minted for
          the total of the queries.
        </p>
      </div>
      <div>
        {fields.map((field, i) => (
          <div key={i}>
            <div style={{ padding: '16px' }}></div>
            <InputForm
              index={i}
              setChain={setValue}
              registerToken={register(`queries.${i}.tokenAddress`)}
              registerDecimal={register(`queries.${i}.decimal`)}
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
