import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Progress, Spacer } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useNetwork, useContractRead, useContractWrite, useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { concat, hexZeroPad, keccak256 } from 'ethers/lib/utils'
import Notice from 'components/Notice'
import { ProposalData, QueryRequest } from 'types'
import { checkSufficientBalance, converUnixToDate, showToast } from 'utils/helper'
import { NFT_ADDRESS, VOTING_ABI } from 'utils'
import { useDeployment } from 'hooks'
import { FutabaQueryAPI, ChainStage, ChainId } from '@futaba-lab/sdk'
import { ConnectButton, useAddRecentTransaction } from '@rainbow-me/rainbowkit'

const VoteDetail: NextPage = () => {
  const [proposal, setProposal] = useState<ProposalData>(),
    [queries, setQueries] = useState<QueryRequest[]>([]),
    [loadingYes, setLoadingYes] = useState(false),
    [loadingNo, setLoadingNo] = useState(false),
    [hasVoted, setHasVoted] = useState(false),
    [showButton, setShowButton] = useState(false),
    [voteCount, setVoteCount] = useState<{ yes: number; no: number }>({ yes: 0, no: 0 }),
    router = useRouter(),
    { id } = router.query,
    { chain } = useNetwork(),
    { address, isConnected } = useAccount(),
    addRecentTransaction = useAddRecentTransaction()

  const deployment = useDeployment()
  const votingAddress = deployment.voting as `0x${string}`
  const { data, refetch } = useContractRead({
      address: votingAddress,
      abi: VOTING_ABI,
      functionName: 'getProposal',
      args: [parseInt(id as string)],
    }),
    { data: count } = useContractRead({
      address: votingAddress,
      abi: VOTING_ABI,
      functionName: 'countVotes',
      args: [parseInt(id as string)],
    }),
    {
      data: yesTx,
      write: voteYes,
      isSuccess: isSuccessYes,
      isError: isErrorYes,
    } = useContractWrite({
      address: votingAddress,
      abi: VOTING_ABI,
      functionName: 'queryNFT',
      args: [queries, parseInt(id as string), true],
    }),
    {
      data: noTx,
      write: voteNo,
      isSuccess: isSuccessNo,
      isError: isErrorNo,
    } = useContractWrite({
      address: votingAddress,
      abi: VOTING_ABI,
      functionName: 'queryNFT',
      args: [queries, parseInt(id as string), false],
    })

  const voting = async (vote: boolean) => {
    if (!isConnected || queries.length == 0) return
    if (vote) {
      setLoadingYes(true)
    } else {
      setLoadingNo(true)
    }
    try {
      if (!chain || !address) return
      const [sufficient, fee] = await checkSufficientBalance(chain.id as number, queries, address)

      if (!sufficient) {
        showToast('Insufficient balance', 'error', false)
        stopLoading()
        return
      }
      if (vote) {
        voteYes({ value: fee.toBigInt() })
      } else {
        voteNo({ value: fee.toBigInt() })
      }
    } catch (error) {
      failProcess()
    }
  }

  const getScanUrl = (height: string) => {
    return `https://goerli.etherscan.io/block/${height}`
  }

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (isErrorYes || isErrorNo) {
      failProcess()
    }
  }, [isErrorYes, isErrorNo])

  useEffect(() => {
    if (proposal && address) {
      setQueries([
        {
          dstChainId: ChainId.SEPOLIA,
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
    stopLoading()
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

  useEffect(() => {
    if (isConnected && chain && chain.id === 80001) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [isConnected, chain])

  const failProcess = () => {
    stopLoading()
    showToast('error', 'Transaction Failed')
  }

  const stopLoading = () => {
    setLoadingYes(false)
    setLoadingNo(false)
  }

  return (
    <>
      <div>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <h2 className='text-3xl font-semibold mb-4'>{'Voting'}</h2>
        <div style={{ padding: '16px' }}></div>
        {proposal ? (
          <div className='flex justify-around gap-12'>
            <div className='w-full'>
              <Card className='max-w-1/2 min-w-1/3'>
                <CardHeader>
                  <p className='text-lg font-medium ml-2'>{proposal.title}</p>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className='text-md font-normal'>{proposal.description}</p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <div className='flex flex-col ml-2'>
                    <span className='text-md font-normal mb-1'>
                      Block height:{' '}
                      <Link
                        href={getScanUrl(proposal.height.toString())}
                        className='text-md font-normal'
                        isExternal
                        showAnchorIcon
                      >
                        {proposal.height.toString()}
                      </Link>
                    </span>
                    <p className='text-md font-normal'>
                      Expire Date:{' '}
                      {parseInt(proposal.expirationTime.toString()) !== 0
                        ? converUnixToDate(parseInt(proposal.expirationTime.toString())).toDateString()
                        : 0}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className='flex flex-col w-1/2'>
              {converUnixToDate(parseInt(proposal.expirationTime.toString())).getTime() < Date.now() || hasVoted ? (
                <></>
              ) : (
                <div>
                  {!showButton && <ConnectButton />}
                  {showButton && (
                    <div className='flex w-full gap-6'>
                      <Button
                        onPress={() => voting(true)}
                        color='success'
                        variant='flat'
                        fullWidth={true}
                        isLoading={loadingYes}
                        isDisabled={loadingYes || loadingNo}
                      >
                        {loadingYes ? 'Voting' : 'Vote "Yes"'}
                      </Button>
                      <Button
                        onPress={() => voting(false)}
                        color='danger'
                        variant='flat'
                        fullWidth={true}
                        isLoading={loadingNo}
                        isDisabled={loadingYes || loadingNo}
                      >
                        {loadingNo ? 'Voting' : 'Vote "No"'}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div style={{ padding: '8px' }}></div>
              <div className='flex flex-col'>
                <div className='mb-2'>
                  <p className='text-md font-normal mb-1'>Yes</p>
                  <Progress
                    color='success'
                    value={voteCount.yes !== 0 ? (voteCount.yes / (voteCount.no + voteCount.yes)) * 100 : 0}
                    size='lg'
                  />
                </div>
                <div>
                  <p className='text-md font-normal mb-1'>No</p>
                  <Progress
                    color='danger'
                    value={voteCount.no !== 0 ? (voteCount.no / (voteCount.no + voteCount.yes)) * 100 : 0}
                    size='lg'
                  />
                </div>
                <Spacer x={1} />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default VoteDetail
