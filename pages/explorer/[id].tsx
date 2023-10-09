import { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  Card,
  CardBody,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useTransaction } from 'hooks/useTransaction'
import { QueryData, QueryResult, Transaction } from 'types'
import { Rpc, convertChainIdToName, getExploerUrl, getProvider, omitText } from 'utils'
import { useGateway, useSupabase } from 'hooks'
import CopySnippet from 'components/CopySnippet'

const TransactionDetail: NextPage = () => {
  const { fetchTransactionsByQueryId, transactions } = useTransaction()
  const [reqTransaction, setReqTransaction] = useState<Transaction>()
  const [resTransaction, setResTransaction] = useState<Transaction>()
  const [queries, setQueries] = useState<QueryResult[]>([])
  const router = useRouter()
  const { id } = router.query
  const supabase = useSupabase()
  const gateway = useGateway()

  const fetchReqTransaction = async (tx: QueryData, rpc: Rpc) => {
    const reqTx = await rpc.getExplorerTransaction(tx.transactionHash)
    setReqTransaction({
      hash: tx.transactionHash,
      blockNumber: reqTx.blockNumber,
      timestamp: reqTx.timestamp,
      sender: reqTx.sender,
    })

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
    setQueries(q)
  }

  const fetchResTransaction = async (tx: QueryData, rpc: Rpc) => {
    if (tx.executedHash) {
      const resTx = await rpc.getExplorerTransaction(tx.executedHash)
      setResTransaction({
        hash: tx.executedHash,
        blockNumber: resTx.blockNumber,
        timestamp: resTx.timestamp,
        sender: resTx.sender,
      })
      const results = await rpc.getSaveQueryEvent(gateway as `0x${string}`, id as string)

      const newQueries: QueryResult[] = []
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i]
        newQueries.push({ ...query, result: results[i] })
      }
      setQueries(newQueries)
    }
  }

  const fetchTransactionByQueryId = async (queryId: string) => {
    await fetchTransactionsByQueryId(queryId)
  }

  useEffect(() => {
    if (id) {
      fetchTransactionByQueryId(id.toString())
    }
  }, [supabase, id])

  useEffect(() => {
    if (id && transactions.length > 0) {
      const tx = transactions[0]
      const provider = getProvider(tx.from)
      if (provider) {
        const rpc = new Rpc(provider)
        fetchReqTransaction(tx, rpc)
      }
    }
  }, [transactions])

  useEffect(() => {
    if (id && transactions.length > 0 && queries.length > 0) {
      const tx = transactions[0]
      const provider = getProvider(tx.from)
      if (provider) {
        const rpc = new Rpc(provider)
        fetchResTransaction(tx, rpc)
      }
    }
  }, [queries])

  return (
    <>
      <div>
        <h2 className='text-3xl font-semibold my-6'>Transaction</h2>
        <Card className='w-full mb-5'>
          <CardBody>
            <div className='flex justify-between'>
              <p className='font-semibold'>Query Id: {id}</p>
              <div className='flex'>
                <p>Status</p>
                <p className='ml-2'>Delivered</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className='flex gap-10'>
          <Card className='w-1/2'>
            <CardBody>
              <p>Request Transaction</p>
              <div className='flex flex-col'>
                <div>
                  <p className='text-lg font-normal'>Transaction hash</p>
                  <p>{reqTransaction?.hash}</p>
                </div>
                <div className=''>
                  <p>Block number</p>
                  <p>{reqTransaction?.blockNumber}</p>
                </div>
                <div className=''>
                  <p>Age</p>
                  <p>{reqTransaction?.timestamp}</p>
                </div>
                <div className=''>
                  <p>Sender</p>
                  <p>{reqTransaction?.sender}</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className='w-1/2'>
            <CardBody>
              <p>Response Transaction</p>
              <div className='flex flex-col'>
                <div className=''>
                  <p>Transaction hash</p>
                  <p>0x0</p>
                </div>
                <div className=''>
                  <p>Block number</p>
                  <p>100</p>
                </div>
                <div className=''>
                  <p>Age</p>
                  <p>10 mins ago</p>
                </div>
                <div className=''>
                  <p>Sender</p>
                  <p>0x0</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <h2 className='text-3xl font-semibold my-6'>Query</h2>
        <Table aria-label='Example static collection table' className='mb-10'>
          <TableHeader>
            <TableColumn>Chain</TableColumn>
            <TableColumn>Contract</TableColumn>
            <TableColumn>Height</TableColumn>
            <TableColumn>Slot</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No queries to display.'}>
            {queries.map((query, index) => {
              const imageURL = '/images/chains/' + query.dstChainId.toString() + '.svg'
              const alt = 'chain_' + query.dstChainId.toString()
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className='flex items-center'>
                      <Image src={imageURL} width={25} height={25} alt={alt} />
                      <p className='ml-1'>{convertChainIdToName(query.dstChainId)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CopySnippet
                      displayedText={omitText(query.to, 5, 5)}
                      copyText={query.to}
                      link={getExploerUrl(query.dstChainId) + 'address/' + query.to}
                    />
                  </TableCell>
                  <TableCell>{query.height.toString()}</TableCell>
                  <TableCell>
                    <CopySnippet displayedText={omitText(query.slot, 5, 5)} copyText={query.slot} />
                  </TableCell>
                  <TableCell>{query.result}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default TransactionDetail
