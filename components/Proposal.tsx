import { Badge, Card, Col, Container, Grid, Row, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ProposalData } from 'types'
import { converUnixToDate } from 'utils/helper'

interface ProposalProps {
  proposals: ProposalData[]
}

const Proposal: NextPage<ProposalProps> = ({ proposals }) => {
  const router = useRouter()
  console.log(proposals)
  return (
    <>
      <Container>
        <Grid.Container gap={2} justify='center'>
          {proposals.length > 0 ? (
            proposals.map((proposal) => {
              const expireTime = converUnixToDate(parseInt(proposal.expirationTime.toString()))
              return (
                <Grid key={proposal.id} sm={12} md={4}>
                  <Card
                    css={{ mw: '600px' }}
                    isPressable
                    isHoverable
                    onPress={() => router.push(`/vote/${proposal.id.toString()}`)}
                  >
                    <Card.Header>
                      <Row gap={0} align={'center'}>
                        <Col>
                          <Text weight={'normal'} size={24}>
                            {proposal.title}
                          </Text>
                        </Col>
                        <Col css={{ textAlign: 'end' }}>
                          {expireTime.getTime() > Date.now() ? (
                            <Badge enableShadow disableOutline color='success'>
                              Active
                            </Badge>
                          ) : (
                            <Badge enableShadow disableOutline color='secondary'>
                              Finisihed
                            </Badge>
                          )}
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ py: '$10' }}>
                      <Text>{proposal.description}</Text>
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer>
                      <Text weight={'normal'} size={16}>
                        Expire Date: {expireTime.toDateString()}
                      </Text>
                    </Card.Footer>
                  </Card>
                </Grid>
              )
            })
          ) : (
            <></>
          )}
        </Grid.Container>
      </Container>
    </>
  )
}

export default Proposal
