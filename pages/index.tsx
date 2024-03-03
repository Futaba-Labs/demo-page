import { useFieldArray, useForm } from 'react-hook-form'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { use, useEffect, useState } from 'react'
import { ConnectButton, useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ChainId, ChainKey, ChainStage, FutabaQueryAPI, getChainKey } from '@futaba-lab/sdk'
import NextLink from 'next/link'
import InputForm from 'components/InputForm'
import {
  checkSufficientBalance,
  convertChainIdToName,
  convertChainNameToId,
  getBalanceSlot,
  getLatestBlockNumber,
  omitText,
  showToast,
} from 'utils/helper'
import { useTransaction } from 'hooks/useTransaction'
import Notice from 'components/Notice'
import { Deployment, QueryRequest } from 'types'
import { BALANCE_QUERY_ABI, DEPLOYMENT } from 'utils'
import { useDeployment } from 'hooks'
import CopySnippet from 'components/CopySnippet'
import type { NextPage } from 'next'
import {
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Link,
} from '@nextui-org/react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import createSupabase from 'utils/supabase'
import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'
import { forEach } from 'lodash'

const Transaction = dynamic(() => import('components/Transaction'))

const chains = ['Sepolia', 'Optimism Sepolia', 'Arbitrum Sepolia']

export interface QueryForm {
  chain: string
  tokenAddress: string
}

const testnetDeployment = DEPLOYMENT[ChainStage.TESTNET] as Partial<Record<ChainKey, Deployment>>

const chainInfo = chains.map((chain) => {
  const chainId = convertChainNameToId(chain)
  const chainKey = getChainKey(chainId as ChainId)
  return {
    chain: chainId?.toString(),
    tokenAddress: testnetDeployment[chainKey]?.testToken,
    decimal: 18,
  }
})

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false),
    [showButton, setShowButton] = useState(false)

  const { register, control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      queries: chainInfo,
    },
  })

  const isDark = false
  const { transactions, fetchTransactionsBySender, subscribeTransactionsBySender } = useTransaction()
  const supabase = createSupabase()
  const addRecentTransaction = useAddRecentTransaction()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'queries',
  })

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const deployment = useDeployment()
  let balanceQuery = '0x'
  if (deployment) {
    balanceQuery = deployment.balance
  }
  const { data, isSuccess, write, isError, error } = useContractWrite({
    address: balanceQuery as `0x${string}`,
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
          return
        }

        const blockHeight = await getLatestBlockNumber(chainId)
        if (!blockHeight) {
          showToast('Failed', 'error', isDark)
          setLoading(false)
          return
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
        return
      }

      try {
        const [sufficient, fee] = await checkSufficientBalance(chain.id as number, queries, address)

        if (!sufficient) {
          showToast('Insufficient balance', 'error', isDark)
          setLoading(false)
          return
        }

        write({ args: [queries, decimals], value: fee.toBigInt() })
        return resolve()
      } catch (error) {
        showToast('Transaction Failed', 'error', isDark)
        setLoading(false)
        return
      }
    })
  }

  useEffect(() => {
    if (supabase && address) {
      fetchTransactionsBySender(address)
      subscribeTransactionsBySender(address)
    }
  }, [supabase])

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
      showToast('Transaction Failed', 'error', isDark)
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
      <div className='mx-auto'>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h1 className='text-4xl font-semibold my-4'>Futaba Testnet 🌱</h1>
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

      <h2 className='text-2xl font-semibold my-4'>Sample data</h2>

      <div className='w-full'>
        <Table aria-label='Sample token data' className='md:w-fit'>
          <TableHeader>
            <TableColumn>Chain</TableColumn>
            <TableColumn>Token Address</TableColumn>
          </TableHeader>
          <TableBody>
            {chains.map((chain, i) => {
              const chainId = convertChainNameToId(chain)
              if (!chainId) return <></>
              const chainKey = getChainKey(chainId as ChainId)
              const imageURL = '/images/chains/' + chainId.toString() + '.svg'
              return (
                <TableRow key={i}>
                  <TableCell>
                    <div className='flex items-center'>
                      <Image
                        src={imageURL}
                        width={25}
                        height={25}
                        alt={chainId.toString()}
                        className='hidden md:block'
                      />
                      <p className='ml-1'>{convertChainIdToName(chainId)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CopySnippet
                      displayedText={omitText(testnetDeployment[chainKey]?.testToken, 10, 10)}
                      copyText={testnetDeployment[chainKey]?.testToken as string}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <form onSubmit={handleSubmit(sendQuery)}>
        {fields.map((field, i) => (
          <div key={i}>
            <div style={{ padding: '16px' }}></div>
            <InputForm
              index={i}
              setChain={() => {}}
              registerToken={register(`queries.${i}.tokenAddress`)}
              registerDecimal={register(`queries.${i}.decimal`)}
              onClick={() => remove(i)}
              defaultSelectKey={field.chain}
            />
          </div>
        ))}
        <div style={{ padding: '16px' }}></div>
        <div className='flex'>
          <Button
            onClick={() => append({ chain: '', tokenAddress: '', decimal: 18 })}
            disabled={fields.length > 2}
            color='success'
            variant='flat'
            className='mr-4'
          >
            Add Query
          </Button>
          {!showButton && <ConnectButton />}
          {showButton && (
            <Button type='submit' isLoading={loading} disabled={fields.length === 0} color='success' variant='flat'>
              {loading ? 'Sending' : 'Send Query'}
            </Button>
          )}
        </div>
      </form>
      <div>
        <div style={{ padding: '24px' }}></div>
        {transactions.length > 0 && (
          <div>
            <h2 className='text-3xl font-semibold mb-4'>Your Transactions</h2>
            <Transaction queryData={transactions} rowsPerPage={5} />
          </div>
        )}
      </div>
    </>
  )
}

export default Home
