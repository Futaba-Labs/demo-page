import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useNetwork, useContractRead } from 'wagmi'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import Notice from 'components/Notice'
import Proposal from 'components/Proposal'
import { ProposalData } from 'types'
import { VOTING_ABI } from 'utils'
import { useDeployment } from 'hooks'

const Vote: NextPage = () => {
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const router = useRouter()

  const { chain } = useNetwork()
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
        Cross-chain Voting
        {
          'Here you can experience cross-chain voting, where you can see if there is an Ethereum NFT on Polygon and vote for it.'
        }
        {'You can mint a sample NFT '}
        <span>
          <Link
            href='https://goerli.etherscan.io/address/0xb75824D76C9c8E580b38F713FCFD5951C5616606#writeContract'
            target='_blank'
          >
            here
          </Link>
        </span>
        {'.'}
        <div style={{ padding: '8px' }}></div>
        <Button onPress={() => router.push('/vote/create')}>{'Create proposal'}</Button>
        <div style={{ padding: '8px' }}></div>
        Proposals
        {isFetched && data ? <Proposal proposals={proposals} /> : <span>No proposals</span>}
      </div>
    </>
  )
}

export default Vote
