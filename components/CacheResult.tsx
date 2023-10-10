import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import Image from 'next/image'
import { NextPage } from 'next'
import { QueryResult } from 'types'
import { convertChainIdToName, omitText } from 'utils/helper'

type Props = {
  queries: QueryResult[]
  page: number
}

const CacheResult: NextPage<Props> = ({ queries, page }) => {
  return (
    <>
      <h2 className='text-3xl font-semibold mb-4'>Results</h2>
      {queries.length > 0 ? (
        <Table aria-label='Example table with static content'>
          <TableHeader>
            <TableColumn>Destinaiton Chain</TableColumn>
            <TableColumn>Block Height</TableColumn>
            <TableColumn>Contract Address</TableColumn>
            <TableColumn>Storage Slot</TableColumn>
            <TableColumn>Result</TableColumn>
          </TableHeader>
          <TableBody>
            {queries.map((query, index) => {
              const imageURL = `/images/chains/${query.dstChainId.toString()}.svg`
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className='flex items-center'>
                      <Image src={imageURL} width={25} height={25} alt={query.dstChainId.toString()} />
                      <p className='ml-1'>{convertChainIdToName(query.dstChainId)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{query.height == 0 ? 'Latest' : query.height}</TableCell>
                  <TableCell>{omitText(query.to, 4, 2)}</TableCell>
                  <TableCell>{omitText(query.slot, 4, 2)}</TableCell>
                  <TableCell>{query.result}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default CacheResult
