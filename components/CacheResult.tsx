import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { QueryRequest } from 'types'
import { convertChainIdToName, omitText } from 'utils/helper'

type Props = {
  queries: QueryRequest[]
  results: string[]
  page: number
}

const CasheResult: NextPage<Props> = ({ queries, results, page }) => {
  return (
    <>
      Results
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
              const result = results[index]
              return (
                <TableRow key={index}>
                  <TableCell>{convertChainIdToName(query.dstChainId)}</TableCell>
                  <TableCell>{query.height == 0 ? 'Latest' : query.height}</TableCell>
                  <TableCell>{omitText(query.to, 4, 2)}</TableCell>
                  <TableCell>{omitText(query.slot, 4, 2)}</TableCell>
                  <TableCell>{result}</TableCell>
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

export default CasheResult
