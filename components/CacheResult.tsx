import { Table, Text } from '@nextui-org/react'
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
      <Text weight={'medium'} size={32}>
        Results
      </Text>
      {queries.length > 0 ? (
        <Table
          aria-label='Example table with static content'
          css={{
            height: 'auto',
            minWidth: '100%',
          }}
        >
          <Table.Header>
            <Table.Column>Destinaiton Chain</Table.Column>
            <Table.Column>Block Height</Table.Column>
            <Table.Column>Contract Address</Table.Column>
            <Table.Column>Storage Slot</Table.Column>
            <Table.Column>Result</Table.Column>
          </Table.Header>
          <Table.Body>
            {queries.map((query, index) => {
              const result = results[index]
              return (
                <Table.Row key={index}>
                  <Table.Cell>{convertChainIdToName(query.dstChainId)}</Table.Cell>
                  <Table.Cell>{query.height == 0 ? 'Latest' : query.height}</Table.Cell>
                  <Table.Cell>{omitText(query.to, 4, 2)}</Table.Cell>
                  <Table.Cell>{omitText(query.slot, 4, 2)}</Table.Cell>
                  <Table.Cell>{result}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
          <Table.Pagination noMargin align='center' rowsPerPage={page} />
        </Table>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default CasheResult
