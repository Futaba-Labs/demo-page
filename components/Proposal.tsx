import { Card, CardBody, CardFooter, CardHeader, Chip, Divider, Pagination } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import { ProposalData } from 'types'
import { converUnixToDate } from 'utils/helper'

interface ProposalProps {
  proposals: ProposalData[]
}

const Proposal: NextPage<ProposalProps> = ({ proposals }) => {
  const [page, setPage] = useState(1),
    [items, setItems] = useState<ProposalData[]>([])
  const router = useRouter()

  const pages = Math.ceil(proposals.length / 9)

  useEffect(() => {
    const start = (page - 1) * 9
    const end = start + 9
    setItems(proposals.slice(start, end))
  }, [page, proposals])

  // const items = useMemo(() => {
  //   const start = (page - 1) * 9
  //   const end = start + 9

  //   return proposals.slice(start, end)
  // }, [page, proposals])

  return (
    <div className='grid grid-cols-3 gap-4'>
      {items.length > 0 ? (
        items.map((proposal) => {
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
                        Finished
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
      {proposals.length > 9 && (
        <Pagination
          isCompact
          showControls
          showShadow
          color='success'
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
          className='col-start-2 justify-self-center'
        />
      )}
    </div>
  )
}

export default Proposal
