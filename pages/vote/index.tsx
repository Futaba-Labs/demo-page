import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import { Button, Card, Link, Select, Skeleton, SelectItem, Selection } from '@nextui-org/react'
import NextLink from 'next/link'
import Notice from 'components/Notice'
import { ProposalData } from 'types'
import { VOTING_ABI } from 'utils'
import { useDeployment } from 'hooks'

import dynamic from 'next/dynamic'

const Proposal = dynamic(() => import('components/Proposal'))

const selectOptions = [
  { label: 'Expire Date', value: 'date' },
  { label: 'Created Date', value: 'id' },
]

const Vote: NextPage = () => {
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const router = useRouter()

  const deployment = useDeployment()

  const { data, refetch, isFetched } = useContractRead({
    address: deployment.voting as `0x${string}`,
    abi: VOTING_ABI,
    functionName: 'getAllProposals',
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    const proposalData = data as ProposalData[]
    if (proposalData && proposalData.length > 0) {
      setProposals(
        proposalData.sort((a, b) => {
          if (a.expirationTime > b.expirationTime) return -1
          if (a.expirationTime < b.expirationTime) return 1
          return 0
        }),
      )
    }
  }, [data])

  const handleSort = (keys: any) => {
    const key = keys.values().next().value
    const p = [...proposals]
    if (key === 'date') {
      p.sort((a, b) => {
        if (a.expirationTime > b.expirationTime) return -1
        if (a.expirationTime < b.expirationTime) return 1
        return 0
      })
    } else {
      p.sort((a, b) => {
        if (a.id > b.id) return -1
        if (a.id < b.id) return 1
        return 0
      })
    }
    setProposals(p)
  }

  return (
    <>
      <div>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h2 className='text-3xl font-semibold mb-4'>Cross-chain voting</h2>
        <p className='text-lg font-normal mb-1'>
          {
            'Here you can experience cross-chain voting, where you can see if there is an Ethereum NFT on Polygon and vote for it.'
          }
        </p>
        <p className='text-lg font-normal mb-1'>
          {'You can mint a sample NFT from '}
          <span>
            <Link href='/faucet' className='text-lg font-normal mb-1' as={NextLink}>
              Faucet
            </Link>
          </span>
          {'.'}
        </p>
        <div style={{ padding: '8px' }}></div>
        <Button onPress={() => router.push('/vote/create')} color='success' variant='flat'>
          {'Create proposal'}
        </Button>
        <div style={{ padding: '8px' }}></div>
        <div className='flex justify-between mb-10'>
          <h2 className='text-3xl font-semibold'>Proposals</h2>
          <Select
            label='Sort'
            size='sm'
            placeholder='Select an sort method'
            className='max-w-xs'
            onSelectionChange={(keys) => handleSort(keys)}
          >
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {isFetched && data ? (
          <Proposal proposals={proposals} />
        ) : (
          <div className='grid grid-cols-3 gap-4'>
            <Card className='space-y-5 p-4'>
              <Skeleton className='w-full rounded-lg'>
                <div className='h-10 w-full rounded-lg bg-default-200'></div>
              </Skeleton>
              <Skeleton className='w-full rounded-lg'>
                <div className='h-20 w-full rounded-lg bg-default-200'></div>
              </Skeleton>
              <Skeleton className='w-4/5 rounded-lg'>
                <div className='h-8 w-4/5 rounded-lg bg-default-300'></div>
              </Skeleton>
            </Card>
            <Card className='space-y-5 p-4'>
              <Skeleton className='w-full rounded-lg'>
                <div className='h-10 w-full rounded-lg bg-default-200'></div>
              </Skeleton>
              <Skeleton className='w-full rounded-lg'>
                <div className='h-20 w-full rounded-lg bg-default-200'></div>
              </Skeleton>
              <Skeleton className='w-4/5 rounded-lg'>
                <div className='h-8 w-4/5 rounded-lg bg-default-300'></div>
              </Skeleton>
            </Card>
            <Card className='space-y-5 p-4'>
              <Skeleton className='w-full rounded-lg'>
                <div className='h-10 w-full rounded-lg bg-default-200'></div>
              </Skeleton>
              <Skeleton className='w-full rounded-lg'>
                <div className='h-20 w-full rounded-lg bg-default-200'></div>
              </Skeleton>
              <Skeleton className='w-4/5 rounded-lg'>
                <div className='h-8 w-4/5 rounded-lg bg-default-300'></div>
              </Skeleton>
            </Card>
          </div>
        )}
      </div>
      <div className='pb-10'></div>
    </>
  )
}

export default Vote
