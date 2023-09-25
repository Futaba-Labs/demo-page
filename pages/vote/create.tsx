import { Button, Input, Spacer, Textarea } from '@nextui-org/react'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useContractWrite, useNetwork } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import Notice from 'components/Notice'
import { showToast } from 'utils/helper'
import { VOTING_ABI } from 'utils'
import { useDeployment } from 'hooks'

const Create: NextPage = () => {
  const [title, setTitle] = useState(''),
    [description, setDescription] = useState(''),
    [expirationTime, setExpirationTime] = useState(0),
    [height, setHeight] = useState(0),
    [loading, setLoading] = useState(false)

  const addRecentTransaction = useAddRecentTransaction()

  const router = useRouter()

  const { chain } = useNetwork()

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

  const createProposal = () => {
    setLoading(true)

    try {
      write()
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

  return (
    <>
      <div>
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
          <Input
            label={'Title'}
            placeholder='Proposal title'
            fullWidth={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Spacer x={1} />
          <Input
            label={'Expiration date'}
            placeholder={Date.now().toString()}
            type='date'
            fullWidth={true}
            onChange={onChangeExpirationTime}
          />
          <Spacer x={1} />
          <Input
            label={'Block height'}
            placeholder={'0'}
            type='number'
            fullWidth={true}
            onChange={(e) => setHeight(parseInt(e.target.value))}
          />
        </div>
        <div style={{ padding: '16px' }}></div>
        <div>
          <Textarea
            label='Description'
            placeholder='Proposal description'
            fullWidth={true}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ padding: '16px' }}></div>
        <Button onPress={() => createProposal()} color='success' variant='flat' isLoading={loading}>
          {loading ? 'Creating' : 'Create'}
        </Button>
      </div>
    </>
  )
}

export default Create
