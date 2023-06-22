import { Button, Container, Input, Loading, Row, Spacer, Text, Textarea } from '@nextui-org/react'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useContractWrite, useNetwork } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import Notice from 'components/Notice'
import { DEPLOYMENTS, VOTINGABI } from 'utils/constants'
import { showToast } from 'utils/helper'

interface ProposalParam {
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
    [loading, setLoading] = useState(false)

  const addRecentTransaction = useAddRecentTransaction()

  const { chain } = useNetwork()

  const { data, write, isError } = useContractWrite({
    address: DEPLOYMENTS.voting[chain?.id.toString() as keyof typeof DEPLOYMENTS.voting] as `0x${string}`,
    abi: VOTINGABI,
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
      console.log(error)
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
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={36}>
          Create proposal
        </Text>
        <Text size={18}>{'You can create your own Proposal here.'}</Text>
        <Text size={18}>{'Enter at which Block height you want to check for the presence of NFT.'}</Text>
        <div style={{ padding: '16px' }}></div>
        <Row css={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Input label={'Title'} fullWidth={true} value={title} onChange={(e) => setTitle(e.target.value)} />
          <Spacer x={1} />
          <Input label={'Expiration date'} type='date' fullWidth={true} onChange={onChangeExpirationTime} />
          <Spacer x={1} />
          <Input
            label={'Block height'}
            type='number'
            fullWidth={true}
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
          />
        </Row>
        <div style={{ padding: '16px' }}></div>
        <Row>
          <Textarea
            label='Description'
            placeholder='Enter proposal description'
            fullWidth={true}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Row>
        <div style={{ padding: '16px' }}></div>
        <Button onPress={() => createProposal()} flat auto>
          {loading ? <Loading /> : 'Create'}
        </Button>
      </Container>
    </>
  )
}

export default Create