import { Button, Container, Link, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useNetwork, useContractRead } from 'wagmi'
import Notice from 'components/Notice'
import Proposal from 'components/Proposal'
import { DEPLOYMENTS, VOTINGABI } from 'utils/constants'
import { ProposalData } from 'types'

const Vote: NextPage = () => {
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const router = useRouter()

  const { chain } = useNetwork()

  const { data, refetch, isFetched } = useContractRead({
    address: DEPLOYMENTS.voting[chain?.id.toString() as keyof typeof DEPLOYMENTS.voting] as `0x${string}`,
    abi: VOTINGABI,
    functionName: 'getAllProposals',
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    // TODO: fetch proposals
    console.log(data)
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
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={36}>
          Cross-chain Voting
        </Text>
        <Text size={18}>
          {
            'Here you can experience cross-chain voting, where you can see if there is an Ethereum NFT on Polygon and vote for it.'
          }
        </Text>
        <Text size={18}>
          {'You can mint a sample NFT '}
          <span>
            <Link
              isExternal
              href='https://docs.axiom.xyz/axiom-architecture/verifying-storage-proofs/how-do-i-find-storage-slots'
              target='_blank'
            >
              here
            </Link>
          </span>
          {'.'}
        </Text>
        <div style={{ padding: '8px' }}></div>
        <Button onPress={() => router.push('/vote/create')}>{'Create proposal'}</Button>
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={32}>
          Proposals
        </Text>
        {isFetched && data ? <Proposal proposals={proposals} /> : <Text size={18}>No proposals</Text>}
      </Container>
    </>
  )
}

export default Vote
