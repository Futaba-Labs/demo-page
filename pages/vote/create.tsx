import { Button, Input, Spacer, Textarea } from '@nextui-org/react'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { ConnectButton, useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import Notice from 'components/Notice'
import { showToast } from 'utils/helper'
import { VOTING_ABI } from 'utils'
import { useDeployment } from 'hooks'
import { SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  title: string
  description: string
  expirationTime: number
  height: number
}

const Create: NextPage = () => {
  const [title, setTitle] = useState(''),
    [description, setDescription] = useState(''),
    [expirationTime, setExpirationTime] = useState(0),
    [height, setHeight] = useState(0),
    [loading, setLoading] = useState(false),
    [showButton, setShowButton] = useState(false)

  const { register, handleSubmit, watch, setValue } = useForm<Inputs>()

  const addRecentTransaction = useAddRecentTransaction()

  const router = useRouter()

  const { chain } = useNetwork()
  const { isConnected } = useAccount()

  const deployment = useDeployment()

  const { data, write, isError } = useContractWrite({
    address: deployment.voting as `0x${string}`,
    abi: VOTING_ABI,
    functionName: 'createProposal',
    args: [title, description, expirationTime, height],
  })

  const onChangeExpirationTime = (event: any) => {
    const time = new Date(event.target.value.toString())
    setExpirationTime(Math.floor((time.getTime() - Date.now()) / 60 / 1000))
  }

  const createProposal: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    setLoading(true)

    try {
      const time = new Date(data.expirationTime.toString())
      const expirationTime = Math.floor((time.getTime() - Date.now()) / 60 / 1000)
      write({ args: [data.title, data.description, expirationTime, data.height] })
    } catch (error) {
      setLoading(false)
      showToast('error', 'Transaction failed')
    }
  }

  useEffect(() => {
    if (data) {
      addRecentTransaction({
        hash: data.hash,
        description: 'Create proposal',
        confirmations: 5,
      })
      router.push('/vote')
    }
    setLoading(false)
  }, [data])

  useEffect(() => {
    if (isError) {
      setLoading(false)
      showToast('error', 'Transaction Failed')
    }
  }, [isError])

  useEffect(() => {
    if (isConnected && chain && chain.id === 80001) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [isConnected, chain])

  return (
    <>
      <form onSubmit={handleSubmit(createProposal)}>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h2 className='text-3xl font-semibold mb-4'>Create proposal</h2>
        <p className='text-lg font-normal mb-1'>{'You can create your own Proposal here.'}</p>
        <p className='text-lg font-normal mb-1'>
          {'Enter at which Block height you want to check for the presence of NFT.'}
        </p>

        <div style={{ padding: '16px' }}></div>
        <div className='flex flex-row gap-4'>
          <Input label={'Title'} placeholder='Proposal title' fullWidth={true} {...register('title')} isRequired />
          <Spacer x={1} />
          <Input
            label={'Expiration date'}
            placeholder={Date.now().toString()}
            type='date'
            fullWidth={true}
            {...register('expirationTime')}
            isRequired
          />
          <Spacer x={1} />
          <Input
            label={'Block height'}
            placeholder={'0'}
            type='number'
            fullWidth={true}
            {...register('height')}
            isRequired
          />
        </div>
        <div style={{ padding: '16px' }}></div>
        <div>
          <Textarea
            label='Description'
            placeholder='Proposal description'
            fullWidth={true}
            {...register('description')}
            isRequired
          />
        </div>
        <div style={{ padding: '16px' }}></div>
        {showButton ? (
          <Button type='submit' color='success' variant='flat' isLoading={loading}>
            {loading ? 'Creating' : 'Create'}
          </Button>
        ) : (
          <ConnectButton />
        )}
      </form>
    </>
  )
}

export default Create
