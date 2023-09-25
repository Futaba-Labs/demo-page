import { Card, CardBody, CardFooter, CardHeader, Chip, Divider } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ProposalData } from 'types'
import { converUnixToDate } from 'utils/helper'

interface ProposalProps {
  proposals: ProposalData[]
}

const Proposal: NextPage<ProposalProps> = ({ proposals }) => {
  const router = useRouter()
  return (
    <div className='grid grid-cols-3 gap-4'>
      {proposals.length > 0 ? (
        proposals.map((proposal) => {
          const expireTime = converUnixToDate(parseInt(proposal.expirationTime.toString()))
          return (
            <Card
              isPressable
              isHoverable
              onPress={() => router.push(`/vote/${proposal.id.toString()}`)}
              key={proposal.id}
            >
              <CardHeader>
                <div className='flex justify-between w-full'>
                  <p className='text-lg font-medium ml-2'>{proposal.title}</p>
                  <div className='ml-2'>
                    {expireTime.getTime() > Date.now() ? (
                      <Chip color='success' variant='shadow'>
                        Active
                      </Chip>
                    ) : (
                      <Chip color='secondary' variant='shadow'>
                        Finisihed
                      </Chip>
                    )}
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className='text-md font-normal'>{proposal.description}</p>
              </CardBody>
              <Divider />
              <CardFooter>
                <p className='text-md font-normal ml-2'>Expire Date: {expireTime.toDateString()}</p>
              </CardFooter>
            </Card>
          )
        })
      ) : (
        <></>
      )}
    </div>
  )
}

export default Proposal
