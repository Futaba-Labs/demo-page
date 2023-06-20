import { Container, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useNetwork, useContractRead } from 'wagmi'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import Notice from 'components/Notice'
import { DEPLOYMENTS, VOTINGABI } from 'utils/constants'
import { ProposalData } from 'types'

const VoteDetail: NextPage = () => {
  const [proposal, setProposal] = useState<ProposalData>()
  const router = useRouter()
  const { id } = router.query

  const { chain } = useNetwork()

  const { data, refetch, isFetched } = useContractRead({
    address: DEPLOYMENTS.voting[chain?.id.toString() as keyof typeof DEPLOYMENTS.voting] as `0x${string}`,
    abi: VOTINGABI,
    functionName: 'getProposal',
    args: [BigNumber.from(id as string)],
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    console.log(data)
    if (data) {
      setProposal(data as ProposalData)
    }
  }, [data])

  return (
    <>
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={32}>
          {proposal ? proposal.title : ''}
        </Text>
      </Container>
    </>
  )
}

export default VoteDetail
