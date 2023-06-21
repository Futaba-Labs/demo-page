import { Button, Card, Container, Grid, Loading, Progress, Spacer, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useNetwork, useContractRead, useContractWrite, useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { concat, hexZeroPad, keccak256 } from 'ethers/lib/utils'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { GelatoRelay } from '@gelatonetwork/relay-sdk'
import Notice from 'components/Notice'
import { DEPLOYMENTS, NFT_ADDRESS, VOTINGABI } from 'utils/constants'
import { ProposalData, QueryRequest } from 'types'
import { converUnixToDate, showToast } from 'utils/helper'

const relay = new GelatoRelay()

const VoteDetail: NextPage = () => {
  const [proposal, setProposal] = useState<ProposalData>(),
    [queries, setQueries] = useState<QueryRequest[]>([]),
    [loading, setLoading] = useState(false),
    [hasVoted, setHasVoted] = useState(false),
    [voteCount, setVoteCount] = useState<{ yes: number; no: number }>({ yes: 0, no: 0 }),
    router = useRouter(),
    { id } = router.query,
    { chain } = useNetwork(),
    { address, isConnected } = useAccount(),
    addRecentTransaction = useAddRecentTransaction(),
    { data, refetch } = useContractRead({
      address: DEPLOYMENTS.voting[chain?.id.toString() as keyof typeof DEPLOYMENTS.voting] as `0x${string}`,
      abi: VOTINGABI,
      functionName: 'getProposal',
      args: [parseInt(id as string)],
    }),
    { data: count } = useContractRead({
      address: DEPLOYMENTS.voting[chain?.id.toString() as keyof typeof DEPLOYMENTS.voting] as `0x${string}`,
      abi: VOTINGABI,
      functionName: 'countVotes',
      args: [parseInt(id as string)],
    }),
    {
      data: yesTx,
      write: voteYes,
      isSuccess: isSuccessYes,
      isError: isErrorYes,
    } = useContractWrite({
      address: DEPLOYMENTS.voting[chain?.id.toString() as keyof typeof DEPLOYMENTS.custom] as `0x${string}`,
      abi: VOTINGABI,
      functionName: 'queryNFT',
      args: [queries, parseInt(id as string), true],
    }),
    {
      data: noTx,
      write: voteNo,
      isSuccess: isSuccessNo,
      isError: isErrorNo,
    } = useContractWrite({
      address: DEPLOYMENTS.voting[chain?.id.toString() as keyof typeof DEPLOYMENTS.custom] as `0x${string}`,
      abi: VOTINGABI,
      functionName: 'queryNFT',
      args: [queries, parseInt(id as string), false],
    })
  const voting = async (vote: boolean) => {
    if (!isConnected || queries.length == 0) return
    setLoading(true)
    try {
      const fee = await relay.getEstimatedFee(
        80001,
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        BigNumber.from('1000000'),
        true,
      )
      if (vote) {
        voteYes({ value: fee.toBigInt() })
      } else {
        voteNo({ value: fee.toBigInt() })
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      showToast('error', 'Transaction Failed')
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (isErrorYes || isErrorNo) {
      setLoading(false)
      showToast('error', 'Transaction Failed')
    }
  }, [isErrorYes, isErrorNo])

  useEffect(() => {
    if (proposal && address) {
      setQueries([
        {
          dstChainId: 5,
          to: NFT_ADDRESS,
          height: 0,
          slot: keccak256(concat([hexZeroPad(address, 32), hexZeroPad(BigNumber.from(3).toHexString(), 32)])),
        },
      ])
      setHasVoted(proposal.voters.includes(address))
    }
  }, [address, proposal])

  useEffect(() => {
    const tx = yesTx || noTx
    if (tx) {
      addRecentTransaction({
        hash: tx.hash,
        description: 'Query Sent',
        confirmations: 5,
      })
    }
    setLoading(false)
  }, [yesTx, noTx])

  useEffect(() => {
    if (data) {
      setProposal(data as ProposalData)
    }
  }, [data])

  useEffect(() => {
    const c = count as BigNumber[]
    if (c) {
      setVoteCount({ yes: parseInt(c[0].toString()), no: parseInt(c[1].toString()) })
    }
  }, [count])

  useEffect(() => {
    if (isSuccessYes || isSuccessNo) {
      showToast('success', 'Transaction Success\nPlease confirm in your transaction history')
      router.push('/')
    }
  })

  return (
    <>
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={36}>
          {'Voting'}
        </Text>
        <div style={{ padding: '16px' }}></div>
        {proposal ? (
          <Grid.Container gap={2} justify='center'>
            <Grid xs={6} justify='center'>
              <Card css={{ mw: '500px' }}>
                <Card.Header>
                  <Text weight={'normal'} size={32}>
                    {proposal.title}
                  </Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ py: '$10' }}>
                  <Text>{proposal.description}</Text>
                </Card.Body>
                <Card.Divider />
                <Card.Footer>
                  <Text weight={'normal'} size={16}>
                    Expire Date:{' '}
                    {parseInt(proposal.expirationTime.toString()) !== 0
                      ? converUnixToDate(parseInt(proposal.expirationTime.toString())).toDateString()
                      : 0}
                  </Text>
                </Card.Footer>
              </Card>
            </Grid>
            <Grid xs={6} direction='column'>
              {converUnixToDate(parseInt(proposal.expirationTime.toString())).getTime() < Date.now() || hasVoted ? (
                <></>
              ) : (
                <Grid.Container xs={12} gap={2} justify='center'>
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      <Grid>
                        <Button rounded shadow onPress={() => voting(true)}>
                          {'Vote "Yes"'}
                        </Button>
                      </Grid>
                      <Grid>
                        <Button rounded shadow onPress={() => voting(false)}>
                          {'Vote "No"'}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid.Container>
              )}

              <div style={{ padding: '8px' }}></div>
              <Grid.Container xs={12} gap={2} direction='column'>
                <Grid css={{ margin: '0 15%' }}>
                  <Text weight={'normal'} size={20}>
                    Yes
                  </Text>
                  <Progress
                    value={voteCount.yes !== 0 ? (voteCount.yes / (voteCount.no + voteCount.yes)) * 100 : 0}
                    size='lg'
                    shadow
                    css={{ width: '100%' }}
                  />
                </Grid>
                <Grid css={{ margin: '0 15%' }}>
                  <Text weight={'normal'} size={20}>
                    No
                  </Text>
                  <Progress
                    color='error'
                    value={voteCount.no !== 0 ? (voteCount.no / (voteCount.no + voteCount.yes)) * 100 : 0}
                    size='lg'
                    shadow
                  />
                </Grid>
                <Spacer x={1} />
              </Grid.Container>
            </Grid>
          </Grid.Container>
        ) : (
          <></>
        )}
      </Container>
    </>
  )
}

export default VoteDetail
