import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Card, CardBody, Chip, Skeleton, Spinner } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useTransaction } from 'hooks/useTransaction'
import { QueryData, QueryResult, Transaction } from 'types'
import { Rpc, convertChainIdToName, getProvider, omitText } from 'utils'
import { useGateway } from 'hooks'
import dynamic from 'next/dynamic'
import createSupabase from 'utils/supabase'
import Image from 'next/image'

const TransactionCard = dynamic(() => import('components/TransactionCard'))
const QueryTable = dynamic(() => import('components/QueryTable'))

interface ChipParam {
  text: string
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

const SkeletonCard = () => {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-2'>
        <p>Transaction hash</p>
        <Skeleton className='w-3/5 rounded-lg'>
          <div className='h-5 w-3/5 rounded-lg bg-default-200'></div>
        </Skeleton>
      </div>

      <div className='flex flex-col gap-2'>
        <p>Block number</p>
        <Skeleton className='w-2/5 rounded-lg'>
          <div className='h-5 w-2/5 rounded-lg bg-default-200'></div>
        </Skeleton>
      </div>

      <div className='flex flex-col gap-2'>
        <p>Timestamp</p>
        <Skeleton className='w-2/5 rounded-lg'>
          <div className='h-5 w-2/5 rounded-lg bg-default-200'></div>
        </Skeleton>
      </div>

      <div className='flex flex-col gap-2'>
        <p>Sender</p>
        <Skeleton className='w-3/5 rounded-lg'>
          <div className='h-5 w-3/5 rounded-lg bg-default-200'></div>
        </Skeleton>
      </div>
    </div>
  )
}

const TransactionDetail: NextPage = () => {
  const { fetchTransactionsByQueryId, transactions, subscribeTransactionsByQueryId } = useTransaction()
  const [reqTransaction, setReqTransaction] = useState<Transaction>()
  const [resTransaction, setResTransaction] = useState<Transaction>()
  const [queries, setQueries] = useState<QueryResult[]>([])
  const router = useRouter()
  const { id } = router.query
  const supabase = createSupabase()
  const gateway = useGateway()

  const convertStatus = (status: number): ChipParam => {
    switch (status) {
      case 0:
        return { text: 'Request Pending...', color: 'secondary' }
      case 1:
        return { text: 'Delivered', color: 'success' }
      case 3:
        return { text: 'Failed', color: 'danger' }
      default:
        return { text: 'Request Pending', color: 'default' }
    }
  }

  const fetchReqTransaction = async (tx: QueryData, rpc: Rpc) => {
    if (!reqTransaction) {
      const reqTx = await rpc.getExplorerTransaction(tx.transactionHash)
      setReqTransaction({
        hash: tx.transactionHash,
        blockNumber: reqTx.blockNumber,
        timestamp: reqTx.timestamp,
        sender: reqTx.sender,
      })
    }
  }

  const fetchResTransaction = async (tx: QueryData, rpc: Rpc) => {
    const decodedPayload = ethers.utils.defaultAbiCoder.decode(
      ['address', 'tuple(uint32, address, uint256, bytes32)[]', 'bytes', 'address'],
      tx.packet,
    )
    const decodedQueries = decodedPayload[1]

    const q: QueryResult[] = []
    for (const dq of decodedQueries) {
      q.push({
        dstChainId: dq[0],
        to: dq[1],
        height: dq[2],
        slot: dq[3],
      })
    }

    const newQueries: QueryResult[] = []

    if (tx.executedHash) {
      const resTx = await rpc.getExplorerTransaction(tx.executedHash)
      setResTransaction({
        hash: tx.executedHash,
        blockNumber: resTx.blockNumber,
        timestamp: resTx.timestamp,
        sender: resTx.sender,
      })
      const results = await rpc.getSaveQueryEvent(gateway as `0x${string}`, id as string)

      for (let i = 0; i < q.length; i++) {
        const query = q[i]
        newQueries.push({ ...query, result: results[i] })
      }
    }
    if (newQueries.length > 0) {
      setQueries(newQueries)
    } else {
      setQueries(q)
    }
  }

  const fetchTransactionByQueryId = async (queryId: string) => {
    await fetchTransactionsByQueryId(queryId)
  }

  useEffect(() => {
    if (id) {
      fetchTransactionByQueryId(id.toString())
      subscribeTransactionsByQueryId(id.toString())
    }
  }, [supabase, id])

  useEffect(() => {
    if (id && transactions.length > 0) {
      const tx = transactions[0]
      const provider = getProvider(tx.from)
      if (provider) {
        const rpc = new Rpc(provider)
        fetchReqTransaction(tx, rpc)
        fetchResTransaction(tx, rpc)
      }
    }
  }, [transactions])

  if (transactions[0] === undefined || !id) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner size='lg' color='success' />
      </div>
    )
  }

  const q = transactions[0]
  const { text: status, color } = convertStatus(q.status)
  const imageURL = '/images/chains/' + q.from.toString() + '.svg'
  const alt = 'chain_' + q.from.toString()

  return (
    <>
      <div>
        <h2 className='text-3xl font-semibold my-6'>Transaction</h2>
        <Card className='w-full mb-5'>
          <CardBody>
            <div className='flex justify-between items-center flex-wrap'>
              <div className='flex flex-col'>
                <div className='flex items-center mb-2'>
                  <Image src={imageURL} width={25} height={25} alt={alt} />
                  <p className='mx-1'>{convertChainIdToName(q.from)}</p>
                </div>
                <p className='font-medium'>Query Id: {id}</p>
              </div>

              <Chip color={color} size='lg'>
                <span className='text-white'>{status}</span>
              </Chip>
            </div>
          </CardBody>
        </Card>
        <div className='flex flex-wrap md:flex-nowrap gap-10'>
          <Card className='w-full'>
            <CardBody>
              <p className='font-medium text-xl text-green-500 mb-2'>Request Transaction</p>
              {reqTransaction ? <TransactionCard transaction={reqTransaction} chainId={q.from} /> : <SkeletonCard />}
            </CardBody>
          </Card>
          <Card className='w-full'>
            <CardBody>
              <p className='font-medium text-xl text-green-500 mb-2'>Response Transaction</p>
              {resTransaction ? <TransactionCard transaction={resTransaction} chainId={q.from} /> : <SkeletonCard />}
            </CardBody>
          </Card>
        </div>
        <h2 className='text-3xl font-semibold my-6'>Query</h2>
        {queries.length > 0 && <QueryTable queries={queries} />}
      </div>
    </>
  )
}

export default TransactionDetail
