import { Badge, Link, SimpleColors, Table } from '@nextui-org/react'
import { NextPage } from 'next/types'
import { Transaction } from 'types'

interface Props {
  transactons: Transaction[]
}
interface BadgeParam {
  text: string
  color: SimpleColors
}
const Explorer: NextPage<Props> = ({ transactons }) => {
  const omitText = (text?: string) => {
    return text ? text.substring(0, 10) + '...' : ''
  }

  const convertStatus = (status: number): BadgeParam => {
    switch (status) {
      case 0:
        return { text: 'Request Pending...', color: 'default' }
      case 1:
        return { text: 'Relaying...', color: 'secondary' }
      case 2:
        return { text: 'Delivered', color: 'success' }
      case 3:
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
      {transactons.length > 0 ? (
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
            {transactons.map((transaction) => {
              const { text, color } = convertStatus(transaction.deliverStatus)
              const resTxHash = omitText(transaction.responseTransactionHash)
              return (
                <Table.Row key={transaction.queryId}>
                  <Table.Cell>
                    <Link isExternal href={getExploerUrl(transaction.chainId) + transaction.requestTransactionHash}>
                      {omitText(transaction.requestTransactionHash)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {resTxHash !== '' ? (
                      <Link isExternal href={getExploerUrl(transaction.chainId) + transaction.responseTransactionHash}>
                        {resTxHash}
                      </Link>
                    ) : (
                      <div></div>
                    )}
                  </Table.Cell>
                  <Table.Cell>{omitText(transaction.queryId)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={color} size='lg'>
                      {text}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{converChain(transaction.chainId)}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default Explorer
