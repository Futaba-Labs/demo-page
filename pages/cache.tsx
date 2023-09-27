import { NextPage } from 'next'
import { useForm, useFieldArray } from 'react-hook-form'
import { useAccount, useContractRead } from 'wagmi'
import { useEffect, useState } from 'react'
import { Button, Link } from '@nextui-org/react'
import Notice from 'components/Notice'
import CustomInputForm from 'components/CustomInputForm'
import { showToast } from 'utils/helper'
import { QueryRequest } from 'types'
import CasheResult from 'components/CacheResult'
import { GATEWAY_ABI } from 'utils'
import { useGateway } from 'hooks'

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

  const gateway = useGateway()

  const { data, refetch } = useContractRead({
    address: gateway as `0x${string}`,
    abi: GATEWAY_ABI,
    functionName: 'getCache',
    args: [queries],
  })

  const getCache = async () => {
    const requests: QueryRequest[] = []
    control._formValues[FORM_NAME].forEach((query: any) => {
      if (query.height < 0) {
        setLoading(false)
        showToast('error', 'Invalid height')
        return
      }
      requests.push({
        dstChainId: parseInt(query.chain),
        to: query.contractAddress,
        height: query.height,
        slot: query.slot,
      })
    })

    if (requests.length === 0) {
      setLoading(false)
      showToast('error', 'No queries')
      return
    }
    setQueries(requests)
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

  useEffect(() => {
    append({ chain: '', contractAddress: '', height: 0, slot: '' })
    return () => {
      remove(0)
    }
  }, [])

  return (
    <>
      <div>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h2 className='text-3xl font-semibold mb-4'>Access cache</h2>
        <p className='text-lg font-normal'>
          {'Here you can access the data of other chains you have queried in the past in byte type.'}
        </p>
        <p className='text-lg font-normal mb-1'>
          {'Specify destination chain, block height, contract address, and storage slot.'}
        </p>
        <p className='text-lg font-normal mb-1'>
          {'Sample data can be found '}
          <span>
            <Link
              href='https://futaba.gitbook.io/docs/guide/futaba-demo/custom-query'
              isExternal
              showAnchorIcon
              color='primary'
              className='text-lg font-normal mb-1'
            >
              here
            </Link>
          </span>
          {'.'}
        </p>

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
        <div className='flex'>
          <Button
            onClick={() => append({ chain: '', tokenAddress: '' })}
            disabled={fields.length > 11}
            color='success'
            variant='flat'
            className='mr-4'
          >
            Add Query
          </Button>
          <Button
            onClick={() => {
              getCache()
            }}
            isLoading={loading}
            disabled={fields.length === 0 || isDisconnected}
            color='success'
            variant='flat'
          >
            {loading ? 'Querying' : 'Get Cache'}
          </Button>
        </div>
        <div style={{ padding: '16px' }}></div>
        <CasheResult page={10} queries={queries} results={results} />
      </div>
    </>
  )
}

export default Cache
