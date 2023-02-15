import type { NextPage } from 'next'
import { useFieldArray, useForm } from 'react-hook-form'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Col, Container, Grid, Row, Spacer, Text } from '@nextui-org/react'
import InputPage from 'components/InputForm'
import { getTokenDecimals } from 'utils/helper'
import { ethers } from 'ethers'
import { DEPLOYMENTS, TESTABI } from 'utils/constants'
import { useNetwork, useContract, useSigner } from 'wagmi'
import { useSupabase } from 'hooks/useSupabaseClient'
import { useEffect, useState } from 'react'
import { Transaction } from 'types'
import Explorer from 'components/Explorer'

export interface QueryForm {
  chain: string
  tokenAddress: string
}

interface QueryParam {
  chainIds: number[]
  tokenAddresses: string[]
  decimals: number[]
}

const Home: NextPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { register, control, setValue, handleSubmit } = useForm()
  const supabase = useSupabase()

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
    let query: QueryParam = { chainIds: [], tokenAddresses: [], decimals: [] }
    const results = []
    for (const f of control._formValues['queries']) {
      results.push(getTokenDecimals(f['chain'], f['tokenAddress']))
    }

    const items = await Promise.all(results)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const tokenAddress = control._formValues['queries'][i]['tokenAddress']
      if (item.decimals === 0) {
        alert('failed')
        break
      }
      query.chainIds.push(item.chainId)
      query.tokenAddresses.push(tokenAddress)
      query.decimals.push(item.decimals)
    }

    console.log(query)

    try {
      if (testQuery && signer) {
        const tx = await testQuery.requestQuery(
          query.chainIds,
          testQuery.address,
          query.tokenAddresses,
          query.decimals,
          { gasLimit: 2000000 },
        )
        if (supabase) {
          const sender = await signer.getAddress()
          const { error } = await supabase
            .from('transactions')
            .insert({ request_transaction_hash: tx.hash, sender, chain_id: chain?.id })
          console.log(error)
          if (!error && chain !== undefined) {
            setTransactions([
              { requestTransactionHash: tx.hash, sender, chainId: chain.id, deliverStatus: 0 },
              ...transactions,
            ])
          }
        }
        await tx.wait()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTransactions = async () => {
    if (supabase && signer) {
      const sender = await signer.getAddress()
      const { data, error } = await supabase
        .from('transactions')
        .select()
        .eq('sender', sender)
        .order('created_at', { ascending: false })
      const transactionData: Transaction[] = []
      if (data) {
        for (const d of data) {
          const transaction: Transaction = {
            requestTransactionHash: d['request_transaction_hash'],
            responseTransactionHash: d['response_transaction_hash'],
            queryId: d['query_id'],
            deliverStatus: d['deliver_status'],
            sender: d['sender'],
            chainId: d['chain_id'],
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
            table: 'transactions',
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
          Enter the chain and token address and a new token will be minted for that total amount.
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          Let's try it 🚀
        </Text>
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
              disabled={fields.length === 0}
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
        <Explorer transactons={transactions} />
      </Container>
    </>
  )
}

export default Home
