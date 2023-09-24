import { Badge, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'
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
    <>
      <div>
        <div>
          {proposals.length > 0 ? (
            proposals.map((proposal) => {
              const expireTime = converUnixToDate(parseInt(proposal.expirationTime.toString()))
              return (
                <div key={proposal.id}>
                  <Card isPressable isHoverable onPress={() => router.push(`/vote/${proposal.id.toString()}`)}>
                    <CardHeader>
                      <div>
                        <div>{proposal.title}</div>
                        <div>
                          {expireTime.getTime() > Date.now() ? (
                            <Badge disableOutline color='success'>
                              Active
                            </Badge>
                          ) : (
                            <Badge disableOutline color='secondary'>
                              Finisihed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>{proposal.description}</CardBody>
                    <Divider />
                    <CardFooter>Expire Date: {expireTime.toDateString()}</CardFooter>
                  </Card>
                </div>
              )
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default Proposal
