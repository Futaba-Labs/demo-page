import { Button, Col, Container, Link, Loading, Row, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import { useFieldArray, useForm } from 'react-hook-form'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { GelatoRelay } from '@gelatonetwork/relay-sdk'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ChainStage, FutabaQueryAPI } from '@futaba-lab/sdk'
import CustomInputForm from 'components/CustomInputForm'
import Notice from 'components/Notice'
import { QueryRequest } from 'types'
import { convertChainNameToId, showToast } from 'utils/helper'
import Transaction from 'components/Transaction'
import { useTransaction } from 'hooks/useTransaction'
import { useSupabase } from 'hooks/useSupabaseClient'
import { CUSTOM_QUERY_ABI, getDeployment } from 'utils'

const relay = new GelatoRelay()
const FORM_NAME = 'custom_queries'

const Custom: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const { register, control, setValue } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: FORM_NAME,
  })

  const { chain } = useNetwork()

  const addRecentTransaction = useAddRecentTransaction()
  const deployment = getDeployment(ChainStage.TESTNET, chain?.id as number)

  const { data, isSuccess, write } = useContractWrite({
    address: deployment.custom as `0x${string}`,
    abi: CUSTOM_QUERY_ABI,
    functionName: 'query',
  })

  const { address, isConnected, isDisconnected } = useAccount()

  const supabase = useSupabase()

  const { transactions, allTransactions, fetchTransactionsBySender } = useTransaction()

  const sendQuery = async () => {
    const queries: QueryRequest[] = []
    setLoading(true)

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      control._formValues[FORM_NAME].forEach((query: any) => {
        const dstChainId = convertChainNameToId(query.chain)
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
        if (isConnected) {
          const queryAPI = new FutabaQueryAPI(ChainStage.TESTNET, chain?.id as number)
          const fee = await queryAPI.estimateFee(queries)
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

  const fetchTxns = async () => {
    if (address) {
      fetchTransactionsBySender(address)
    }
  }

  useEffect(() => {
    fetchTxns()
  }, [supabase, allTransactions])

  return (
    <>
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={36}>
          Custom Query
        </Text>
        <Text size={18}>
          {'Here you can specify any contract address, block height, and storage slot to run query.'}
        </Text>
        <Text size={18}>
          {'Click '}
          <span>
            <Link
              isExternal
              href='https://docs.axiom.xyz/axiom-architecture/verifying-storage-proofs/how-do-i-find-storage-slots'
              target='_blank'
            >
              here
            </Link>
          </span>
          {' for information on how to calculate storage slots.'}
        </Text>
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

export default Custom
