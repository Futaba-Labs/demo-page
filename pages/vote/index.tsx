import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import { Button, Link } from '@nextui-org/react'
import Notice from 'components/Notice'
import Proposal from 'components/Proposal'
import { ProposalData } from 'types'
import { VOTING_ABI } from 'utils'
import { useDeployment } from 'hooks'

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
    // TODO: fetch proposals
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
          {'You can mint a sample NFT '}
          <span>
            <Link
              href='https://goerli.etherscan.io/address/0xb75824D76C9c8E580b38F713FCFD5951C5616606#writeContract'
              isExternal
              showAnchorIcon
              className='text-lg font-normal mb-1'
            >
              here
            </Link>
          </span>
          {'.'}
        </p>
        <div style={{ padding: '8px' }}></div>
        <Button onPress={() => router.push('/vote/create')} color='success' variant='flat'>
          {'Create proposal'}
        </Button>
        <div style={{ padding: '8px' }}></div>
        <h2 className='text-3xl font-semibold mb-4'>Proposals</h2>
        {isFetched && data ? <Proposal proposals={proposals} /> : <span>No proposals</span>}
      </div>
    </>
  )
}

export default Vote
