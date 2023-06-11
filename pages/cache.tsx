import { Button, Col, Container, Loading, Row, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import { useForm, useFieldArray } from 'react-hook-form'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import Notice from 'components/Notice'
import CustomInputForm from 'components/CustomInputForm'
import { convertChainNameToId, showToast } from 'utils/helper'
import { QueryRequest } from 'types'
import { DEPLOYMENTS, CUSTOMQUERYABI } from 'utils/constants'
import CasheResult from 'components/CacheResult'

const FORM_NAME = 'cache'

const Cache: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [queries, setQueries] = useState<QueryRequest[]>([])
  const [results, setResults] = useState<string[]>([])
  const { register, control, setValue } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: FORM_NAME,
  })

  const { address, isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const { data, refetch, isFetched } = useContractRead({
    address: DEPLOYMENTS.custom[chain?.id.toString() as keyof typeof DEPLOYMENTS.custom] as `0x${string}`,
    abi: CUSTOMQUERYABI,
    functionName: 'getCache',
    args: [queries],
  })

  const getCache = async () => {
    setLoading(true)
    return new Promise<void>((resolve, reject) => {
      const requests: QueryRequest[] = []
      control._formValues[FORM_NAME].forEach((query: any) => {
        console.log(query)
        const dstChainId = convertChainNameToId(query.chain)
        if (!dstChainId) {
          showToast('error', 'Invalid chain')
          reject()
          setLoading(false)
          return
        }
        if (query.height < 0) {
          setLoading(false)
          showToast('error', 'Invalid height')
          reject()
          return
        }
        requests.push({
          dstChainId,
          to: query.contractAddress,
          height: query.height,
          slot: query.slot,
        })
      })

      if (requests.length === 0) {
        setLoading(false)
        showToast('error', 'No queries')
        reject()
        return
      }

      setQueries(requests)
    })
  }

  useEffect(() => {
    if (queries.length === 0) return
    refetch()
    setLoading(false)
  }, [queries])

  useEffect(() => {
    if (data) {
      const result = data as string[]
      setResults(result)
    }
  }, [data])

  return (
    <>
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={32}>
          Access cache
        </Text>
        <Text size={18}>
          {'Here you can access the data of other chains you have queried in the past in byte type.'}
        </Text>
        <Text size={18}>{'Specify destination chain, block height, contract address, and storage slot.'}</Text>
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
                getCache()
              }}
              flat
              auto
              disabled={fields.length === 0 || isDisconnected}
            >
              {loading ? <Loading /> : 'Get Cache'}
            </Button>
          </Col>
        </Row>
        <div style={{ padding: '16px' }}></div>
        <CasheResult page={10} queries={queries} results={results} />
      </Container>
    </>
  )
}

export default Cache
