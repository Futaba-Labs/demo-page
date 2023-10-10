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
  Chip,
  Skeleton,
  Spinner,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useTransaction } from 'hooks/useTransaction'
import { QueryData, QueryResult, Transaction } from 'types'
import { Rpc, calculateTimeDifference, convertChainIdToName, getExploerUrl, getProvider, omitText } from 'utils'
import { useGateway, useSupabase } from 'hooks'
import CopySnippet from 'components/CopySnippet'

interface ChipParam {
  text: string
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

const TransactionDetail: NextPage = () => {
  const { fetchTransactionsByQueryId, transactions } = useTransaction()
  const [reqTransaction, setReqTransaction] = useState<Transaction>()
  const [resTransaction, setResTransaction] = useState<Transaction>()
  const [queries, setQueries] = useState<QueryResult[]>([])
  const router = useRouter()
  const { id } = router.query
  const supabase = useSupabase()
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

  if (transactions[0] === undefined || !id) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner size='lg' color='success' />
      </div>
    )
  }

  const q = transactions[0]
  const { text: status, color } = convertStatus(q.status)

  return (
    <>
      <div>
        <h2 className='text-3xl font-semibold my-6'>Transaction</h2>
        <Card className='w-full mb-5'>
          <CardBody>
            <div className='flex justify-between items-center'>
              <p className='text-green-500 font-medium'>
                Query Id {omitText(id as string, 15, 15)} on {convertChainIdToName(q.from)}
              </p>
              <Chip color={color} size='lg'>
                <span className='text-white'>{status}</span>
              </Chip>
            </div>
          </CardBody>
        </Card>
        <div className='flex gap-10'>
          <Card className='w-1/2'>
            <CardBody>
              <p className='font-medium text-xl text-green-500 mb-2'>Request Transaction</p>
              {reqTransaction ? (
                <div className='flex flex-col gap-3'>
                  <div>
                    <p>Transaction hash</p>
                    <CopySnippet
                      displayedText={omitText(reqTransaction.hash, 15, 15)}
                      copyText={reqTransaction.hash}
                      link={getExploerUrl(q.from) + 'tx/' + reqTransaction.hash}
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <p>Block number</p>
                    <p className='text-small'>{reqTransaction.blockNumber}</p>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <p>Age</p>
                    <p className='text-small'>{calculateTimeDifference(new Date(reqTransaction.timestamp * 1000))}</p>
                  </div>
                  <div className=''>
                    <p>Sender</p>
                    <CopySnippet
                      displayedText={omitText(reqTransaction.sender, 15, 15)}
                      copyText={reqTransaction.sender}
                      link={getExploerUrl(q.from) + 'address/' + reqTransaction.sender}
                    />
                  </div>
                </div>
              ) : (
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
                    <p>Age</p>
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
              )}
            </CardBody>
          </Card>
          <Card className='w-1/2'>
            <CardBody>
              <p className='font-medium text-xl text-green-500 mb-2'>Response Transaction</p>
              {resTransaction ? (
                <div className='flex flex-col gap-3'>
                  <div>
                    <p>Transaction hash</p>
                    <CopySnippet
                      displayedText={omitText(resTransaction.hash, 15, 15)}
                      copyText={resTransaction.hash}
                      link={getExploerUrl(q.from) + 'tx/' + resTransaction.hash}
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <p>Block number</p>
                    <p className='text-small'>{resTransaction.blockNumber}</p>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <p>Age</p>
                    <p className='text-small'>{calculateTimeDifference(new Date(resTransaction.timestamp * 1000))}</p>
                  </div>
                  <div className=''>
                    <p>Sender</p>
                    <CopySnippet
                      displayedText={omitText(resTransaction.sender, 15, 15)}
                      copyText={resTransaction.sender}
                      link={getExploerUrl(q.from) + 'address/' + resTransaction.sender}
                    />
                  </div>
                </div>
              ) : (
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
                    <p>Age</p>
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
              )}
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
          <TableBody emptyContent={<Spinner label='Loading...' color='success' />}>
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
