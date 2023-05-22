import { Badge, Link, SimpleColors, Table } from '@nextui-org/react'
import { NextPage } from 'next/types'
import { QueryData as QueryData } from 'types'

interface Props {
  queryData: QueryData[]
}
interface BadgeParam {
  text: string
  color: SimpleColors
}
const Explorer: NextPage<Props> = ({ queryData: queries }) => {
  const omitText = (text?: string) => {
    return text ? text.substring(0, 10) + '...' : ''
  }

  const convertStatus = (status: number): BadgeParam => {
    switch (status) {
      case 0:
        return { text: 'Request Pending...', color: 'default' }
      case 1:
        return { text: 'Delivered', color: 'success' }
      case 2:
        return { text: 'Failed', color: 'error' }
      default:
        return { text: 'Request Pending', color: 'default' }
    }
  }

  const converChain = (chainId: number) => {
    switch (chainId) {
      case 80001:
        return 'Mumbai'

      default:
        return 'Mumbai'
    }
  }

  const getExploerUrl = (chainId: number) => {
    switch (chainId) {
      case 80001:
        return 'https://mumbai.polygonscan.com/tx/'

      default:
        return 'https://mumbai.polygonscan.com/tx/'
    }
  }
  return (
    <>
      {queries.length > 0 ? (
        <Table
          aria-label='Example table with static content'
          css={{
            height: 'auto',
            minWidth: '100%',
          }}
        >
          <Table.Header>
            <Table.Column>Request Transaction</Table.Column>
            <Table.Column>Resopnse Transaction</Table.Column>
            <Table.Column>Query Id</Table.Column>
            <Table.Column>Deliver Status</Table.Column>
            <Table.Column>Chain Id</Table.Column>
          </Table.Header>
          <Table.Body>
            {queries.map((query) => {
              const { text, color } = convertStatus(query.status)
              const resTxHash = omitText(query.executedHash)
              return (
                <Table.Row key={query.transactionHash}>
                  <Table.Cell>
                    <Link
                      isExternal
                      href={getExploerUrl(query.from) + query.transactionHash}
                      target='_blank'
                      color={'success'}
                    >
                      {omitText(query.transactionHash)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {resTxHash !== '' ? (
                      <Link
                        isExternal
                        href={getExploerUrl(query.from) + query.executedHash}
                        target='_blank'
                        color={'success'}
                      >
                        {resTxHash}
                      </Link>
                    ) : (
                      <div></div>
                    )}
                  </Table.Cell>
                  <Table.Cell>{omitText(query.id)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={color} size='lg'>
                      {text}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{converChain(query.from)}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
          <Table.Pagination noMargin align='center' rowsPerPage={5} />
        </Table>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default Explorer
