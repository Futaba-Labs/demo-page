import { NextPage } from 'next'
import { useForm, useFieldArray } from 'react-hook-form'
import { useAccount, useContractRead } from 'wagmi'
import { useEffect, useState } from 'react'
import { Button, Link } from '@nextui-org/react'
import Notice from 'components/Notice'
import CustomInputForm from 'components/CustomInputForm'
import { getLocalStorege, setLocalStorege, showToast } from 'utils/helper'
import { QueryResult } from 'types'
import { GATEWAY_ABI } from 'utils'
import { useGateway } from 'hooks'

import dynamic from 'next/dynamic'
const CacheResult = dynamic(() => import('components/CacheResult'))

const FORM_NAME = 'cache'
const STORAGE_KEY = 'cache'

const Cache: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [queries, setQueries] = useState<QueryResult[]>([])
  const { register, control, setValue, handleSubmit } = useForm()
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
    const requests: QueryResult[] = []
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
        result: '',
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
      const results = data as string[]
      const queryCache = [...queries]
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        const request = queryCache[i]
        request.result = result
      }

      setQueries(queryCache)

      setLocalStorege(STORAGE_KEY, JSON.stringify(queryCache))
    }
  }, [data])

  useEffect(() => {
    const data = getLocalStorege(STORAGE_KEY)
    if (data) setQueries(JSON.parse(data))

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
          {'Sample data can be found in '}
          <span>
            <Link
              href='https://futaba.gitbook.io/docs/guide/futaba-demo/custom-query'
              isExternal
              showAnchorIcon
              color='primary'
              className='text-lg font-normal mb-1'
            >
              Guide
            </Link>
          </span>
          {'.'}
        </p>
        <form onSubmit={handleSubmit(getCache)}>
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
              type='submit'
              isLoading={loading}
              disabled={fields.length === 0 || isDisconnected}
              color='success'
              variant='flat'
            >
              {loading ? 'Querying' : 'Get Cache'}
            </Button>
          </div>
        </form>

        <div style={{ padding: '16px' }}></div>
        <CacheResult page={10} queries={queries} />
        <div style={{ padding: '16px' }}></div>
      </div>
    </>
  )
}

export default Cache
