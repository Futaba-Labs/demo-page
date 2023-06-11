import { useFieldArray, useForm } from 'react-hook-form'
import { Button, Col, Container, Link, Row, Text, useTheme, Loading } from '@nextui-org/react'
import { BigNumber } from 'ethers'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { GelatoRelay } from '@gelatonetwork/relay-sdk'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import InputForm from 'components/InputForm'
import { getBalanceSlot, getLatestBlockNumber, getTokenDecimals, showToast } from 'utils/helper'
import { DEPLOYMENTS, TESTABI } from 'utils/constants'
import Transaction from 'components/Transaction'
import { useTransaction } from 'hooks/useTransaction'
import { useSupabase } from 'hooks/useSupabaseClient'
import Notice from 'components/Notice'
import { QueryRequest } from 'types'
import type { NextPage } from 'next'

const relay = new GelatoRelay()

export interface QueryForm {
  chain: string
  tokenAddress: string
}

const Home: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, control, setValue } = useForm()
  const { isDark } = useTheme()
  const { transactions, allTransactions, fetchTransactionsBySender } = useTransaction()
  const supabase = useSupabase()
  const addRecentTransaction = useAddRecentTransaction()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'queries',
  })

  const { address, isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const { data, isSuccess, write, isError } = useContractWrite({
    address: DEPLOYMENTS.test[chain?.id.toString() as keyof typeof DEPLOYMENTS.test] as `0x${string}`,
    abi: TESTABI,
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
        const tokenAddress = control._formValues['queries'][i]['tokenAddress']
        if (item.decimals === 0) {
          showToast('Invalid Token', 'error', isDark)
          setLoading(false)
          return
        }
        const blockHeight = await getLatestBlockNumber(item.chainName)

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
          const fee = await relay.getEstimatedFee(
            80001,
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            BigNumber.from('1000000'),
            true,
          )
          write({ args: [queries, decimals], value: fee.mul(120).div(100).toBigInt() })
          return resolve()
        }
      } catch (error) {
        console.log(error)
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
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={48}>
          Futaba Demo Page
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          {"On this page you can experience Futaba's query."}
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          {" Let's try it 🚀"}
        </Text>
        <Text size={18}>Step1: Connect your wallet. You can use Metamask, WalletConnect, or WalletLink.</Text>
        <Text size={18}>
          Step2: Select the chain and token address you want to query. You can add multiple queries.
          <span>
            If you do not have a token, please mint it{' '}
            <Link isExternal href='https://staging.aave.com/faucet/?marketName=proto_goerli_v3' target='_blank'>
              here
            </Link>
          </span>
        </Text>
        <Text size={18}>{'Step3: Click the "Send Query" button to send the query.'}</Text>
        <Text size={18}>{'Step4: You can check the query result on the "Your Transactions".'}</Text>
      </Container>
      <Container>
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
        <Row gap={0}>
          <Col span={2}>
            <Button onClick={() => append({ chain: '', tokenAddress: '' })} flat auto disabled={fields.length > 11}>
              Add Query
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                sendQuery()
              }}
              flat
              auto
              disabled={fields.length === 0 || isDisconnected || loading}
            >
              {loading ? <Loading size='sm' /> : 'Send Query'}
            </Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <div style={{ padding: '24px' }}></div>
        <Text weight={'medium'} size={32}>
          Your Transactions
        </Text>
        <Transaction queryData={transactions} rowsPerPage={5} />
      </Container>
    </>
  )
}

export default Home
