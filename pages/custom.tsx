import { NextPage } from 'next'
import { useFieldArray, useForm } from 'react-hook-form'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { ConnectButton, useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ChainStage, FutabaQueryAPI } from '@futaba-lab/sdk'
import { Button, Link } from '@nextui-org/react'
import CustomInputForm from 'components/CustomInputForm'
import Notice from 'components/Notice'
import { QueryRequest } from 'types'
import { checkSufficientBalance, showToast } from 'utils/helper'
import { useTransaction } from 'hooks/useTransaction'
import { CUSTOM_QUERY_ABI } from 'utils'
import { useDeployment } from 'hooks'

import dynamic from 'next/dynamic'
import createSupabase from 'utils/supabase'

const Transaction = dynamic(() => import('components/Transaction'))

const FORM_NAME = 'custom_queries'

const Custom: NextPage = () => {
  const [loading, setLoading] = useState(false),
    [showButton, setShowButton] = useState(false)
  const { register, control, setValue, handleSubmit } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: FORM_NAME,
  })

  const { chain } = useNetwork()

  const addRecentTransaction = useAddRecentTransaction()
  const deployment = useDeployment()

  let custom = '0x'
  if (deployment) {
    custom = deployment.custom
  }

  const { data, isSuccess, write, isError } = useContractWrite({
    address: custom as `0x${string}`,
    abi: CUSTOM_QUERY_ABI,
    functionName: 'query',
  })

  const { address, isConnected } = useAccount()

  const supabase = createSupabase()

  const { transactions, fetchTransactionsBySender, subscribeTransactionsBySender } = useTransaction()

  const sendQuery = async () => {
    const queries: QueryRequest[] = []
    setLoading(true)

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      control._formValues[FORM_NAME].forEach((query: any) => {
        const dstChainId = query.chain
        if (!dstChainId) {
          showToast('error', 'Invalid chain')
          reject()
          setLoading(false)
          return
        }
        if (query.height < 0) {
          showToast('error', 'Invalid height')
          setLoading(false)
          reject()
          return
        }
        queries.push({
          dstChainId,
          to: query.contractAddress,
          height: query.height,
          slot: query.slot,
        })
      })

      if (queries.length === 0) {
        showToast('error', 'No queries')
        setLoading(false)
        reject()
        return
      }

      try {
        if (isConnected && chain && address) {
          const [sufficient, fee] = await checkSufficientBalance(chain.id as number, queries, address)

          if (!sufficient) {
            showToast('Insufficient balance', 'error', false)
            setLoading(false)
            return
          }

          write({ args: [queries], value: fee.mul(120).div(100).toBigInt() })
          return resolve()
        }
      } catch (error) {
        showToast('error', 'Invalid query')
        setLoading(false)
        reject()
        return
      }
    })
  }

  useEffect(() => {
    if (data) {
      addRecentTransaction({
        hash: data.hash,
        description: 'Query Sent',
        confirmations: 5,
      })

      if (!isSuccess) {
        showToast('Transaction Failed', 'error', false)
      }
    }
    setLoading(false)
  }, [data])

  useEffect(() => {
    if (supabase && address) {
      fetchTransactionsBySender(address)
      subscribeTransactionsBySender(address)
    }
  }, [supabase])

  useEffect(() => {
    append({ chain: '', contractAddress: '', height: '', slot: '' })
    return () => {
      remove(0)
    }
  }, [])

  useEffect(() => {
    if (isError) {
      showToast('Transaction Failed', 'error', false)
      setLoading(false)
    }
  }, [isError])

  useEffect(() => {
    if (isConnected && chain && chain.id === 80001) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [isConnected, chain])

  return (
    <>
      <div>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h2 className='text-3xl font-semibold mb-4'>Custom query</h2>
        <p className='text-lg font-normal mb-1'>
          {'Here you can specify any contract address, block height, and storage slot to run query.'}
        </p>
        <p className='text-lg font-normal mb-1'>
          {'Click '}
          <span>
            <Link
              href='https://docs.axiom.xyz/docs/developer-resources/on-chain-data/finding-storage-slots'
              isExternal
              showAnchorIcon
              color='primary'
              className='text-lg font-normal mb-1'
            >
              here
            </Link>
          </span>
          {' for information on how to calculate storage slots.'}
        </p>
        <p className='text-lg font-normal mb-1'>
          {'Sample data can be found in '}
          <span>
            <Link
              href='https://futaba.gitbook.io/docs/guide/futaba-demo/custom-query'
              isExternal
              showAnchorIcon
              color='primary'
              className='text-lg font-normal mb-1'
            >
              Guide
            </Link>
          </span>
          {'.'}
        </p>

        <form onSubmit={handleSubmit(sendQuery)}>
          {fields.map((field, i) => (
            <div key={i}>
              <div style={{ padding: '20px' }}></div>
              <CustomInputForm
                formName={FORM_NAME}
                index={i}
                setChain={setValue}
                registerAddress={register(`${FORM_NAME}.${i}.contractAddress`)}
                registerHeight={register(`${FORM_NAME}.${i}.height`)}
                registerSlot={register(`${FORM_NAME}.${i}.slot`)}
                onClick={() => remove(i)}
              />
            </div>
          ))}
          <div style={{ padding: '16px' }}></div>
          <div className='flex'>
            <Button
              onClick={() => append({ chain: '', contractAddress: '', height: '', slot: '' })}
              disabled={fields.length > 4}
              color='success'
              variant='flat'
              className='mr-4'
            >
              Add Query
            </Button>
            {showButton ? (
              <Button type='submit' isLoading={loading} disabled={fields.length === 0} color='success' variant='flat'>
                {loading ? 'Sending' : 'Send Query'}
              </Button>
            ) : (
              <ConnectButton />
            )}
          </div>
        </form>
      </div>
      {transactions.length > 0 && (
        <div>
          <div style={{ padding: '24px' }}></div>
          <h2 className='text-3xl font-semibold mb-4'>Your Transactions</h2>
          <Transaction queryData={transactions} rowsPerPage={5} />
        </div>
      )}
    </>
  )
}

export default Custom
