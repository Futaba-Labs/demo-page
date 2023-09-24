import { NextPage } from 'next'
import { useForm, useFieldArray } from 'react-hook-form'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { getLightClientAddress, ChainStage } from '@futaba-lab/sdk'
import { Button } from '@nextui-org/react'
import Notice from 'components/Notice'
import CustomInputForm from 'components/CustomInputForm'
import { convertChainNameToId, showToast } from 'utils/helper'
import { QueryRequest } from 'types'
import CasheResult from 'components/CacheResult'
import { CUSTOM_QUERY_ABI } from 'utils'

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

  const { isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const lightClient = getLightClientAddress(ChainStage.TESTNET, chain?.id as number)

  const { data, refetch } = useContractRead({
    address: lightClient as `0x${string}`,
    abi: CUSTOM_QUERY_ABI,
    functionName: 'getCache',
    args: [queries],
  })

  const getCache = async () => {
    setLoading(true)
    return new Promise<void>((resolve, reject) => {
      const requests: QueryRequest[] = []
      control._formValues[FORM_NAME].forEach((query: any) => {
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
      <div>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        Access cache
        {'Here you can access the data of other chains you have queried in the past in byte type.'}
        {'Specify destination chain, block height, contract address, and storage slot.'}{' '}
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
        <div>
          <div>
            <Button onClick={() => append({ chain: '', tokenAddress: '' })} disabled={fields.length > 11}>
              Add Query
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                getCache()
              }}
              disabled={fields.length === 0 || isDisconnected}
            >
              {loading ? <div /> : 'Get Cache'}
            </Button>
          </div>
        </div>
        <div style={{ padding: '16px' }}></div>
        <CasheResult page={10} queries={queries} results={results} />
      </div>
    </>
  )
}

export default Cache
