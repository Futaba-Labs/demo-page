import type { NextPage } from 'next'
import { useFieldArray, useForm } from 'react-hook-form'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Col, Container, Grid, Link, Row, Spacer, Text, useTheme } from '@nextui-org/react'
import InputPage from 'components/InputForm'
import { getBalanceSlot, getLatestBlockNumber, getTokenDecimals, showToast } from 'utils/helper'
import { BigNumber, ethers } from 'ethers'
import { DEPLOYMENTS, TESTABI } from 'utils/constants'
import { useNetwork, useContract, useSigner } from 'wagmi'
import { useSupabase } from 'hooks/useSupabaseClient'
import { useEffect, useState } from 'react'
import { QueryData } from 'types'
import Explorer from 'components/Explorer'
import { GelatoRelay } from '@gelatonetwork/relay-sdk'

const relay = new GelatoRelay()

export interface QueryForm {
  chain: string
  tokenAddress: string
}

interface QueryParam {
  chainIds: number[]
  tokenAddresses: string[]
  decimals: number[]
}

interface QueryRequest {
  dstChainId: number
  height: number
  slot: string
  to: string
}

const Home: NextPage = () => {
  const [transactions, setTransactions] = useState<QueryData[]>([])
  const { register, control, setValue, handleSubmit } = useForm()
  const supabase = useSupabase()
  const { isDark, type } = useTheme()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'queries',
  })

  const { data: signer } = useSigner()

  const { chain, chains } = useNetwork()

  const testQuery = useContract({
    address: DEPLOYMENTS.test[chain?.id.toString() as keyof typeof DEPLOYMENTS.test],
    abi: TESTABI,
    signerOrProvider: signer,
  })

  const sendQuery = async () => {
    let queries: QueryRequest[] = []
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
        break
      }
      const blockHeight = await getLatestBlockNumber(item.chainName)
      queries.push({
        dstChainId: item.chainId,
        height: blockHeight,
        slot: getBalanceSlot(tokenAddress),
        to: tokenAddress,
      })
      decimals.push(item.decimals)
    }

    try {
      if (testQuery && signer) {
        const fee = await relay.getEstimatedFee(
          80001,
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          BigNumber.from('1000000'),
          true,
        )
        console.log(queries)
        const tx = await testQuery.sendQuery(queries, decimals, { gasLimit: 1000000, value: fee.mul(120).div(100) })
        await tx.wait()
        showToast('Query Sent', 'success', isDark)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTransactions = async () => {
    if (supabase && signer) {
      const sender = await signer.getAddress()
      const { data, error } = await supabase
        .from('QueryData')
        .select()
        .eq('sender', sender)
        .order('createdAt', { ascending: false })
      console.log(error)
      const transactionData: QueryData[] = []
      if (data) {
        for (const d of data) {
          const transaction: QueryData = {
            transactionHash: d['transactionHash'],
            executedHash: d['executedHash'],
            id: d['id'],
            status: d['status'],
            sender: d['sender'],
            from: d['from'],
          }
          transactionData.push(transaction)
        }
        setTransactions(transactionData)
        console.log(transactionData)
      }
    }
  }

  const handleUpdate = (payload: any) => {
    fetchTransactions()
  }

  const subscribeTransactions = async () => {
    // TODO it does not work
    if (supabase && signer) {
      console.log('subscribe')
      const sender = await signer.getAddress()
      const channel = supabase
        .channel('table-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE', // "INSERT" | "UPDATE" | "DELETE" のように特定イベントだけの購読も可能
            schema: 'public',
            table: 'QueryData',
            filter: `sender=eq.${sender}`,
          },
          handleUpdate,
        )
        .subscribe()
    }
  }

  useEffect(() => {
    fetchTransactions()
    subscribeTransactions()
  }, [signer])

  return (
    <>
      <Container>
        <Text weight={'medium'} size={48}>
          Futaba Demo Page
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          On this page you can experience Futaba's query.
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          Let's try it 🚀
        </Text>
        <Text css={{ padding: '1px' }}>
          Step1: Connect your wallet. You can use Metamask, WalletConnect, or WalletLink.
        </Text>
        <Text css={{ padding: '1px' }}>
          Step2: Select the chain and token address you want to query. You can add multiple queries. (Do not enter a
          token with a balance of 0)
          <br />
          <span>
            If you do not have a token, please mint it{' '}
            <Link
              isExternal
              color='success'
              href='https://staging.aave.com/faucet/?marketName=proto_goerli_v3'
              target='_blank'
            >
              here
            </Link>
          </span>
        </Text>
        <Text css={{ padding: '1px' }}>Step3: Click the "Send Query" button to send the query.</Text>
        <Text css={{ padding: '1px' }}>Step4: You can check the query result on the "Transactions".</Text>
      </Container>
      <Container>
        {fields.map((field, i) => (
          <div key={i}>
            <div style={{ padding: '16px' }}></div>
            <InputPage
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
            <Button onClick={() => append({ chain: '', tokenAddress: '' })} flat auto color={'success'}>
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
              color={'success'}
              disabled={fields.length === 0 || signer == undefined}
            >
              Send Query
            </Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <div style={{ padding: '24px' }}></div>
        <Text weight={'medium'} size={32}>
          Transactions
        </Text>
        <Explorer queryData={transactions} />
      </Container>
    </>
  )
}

export default Home
