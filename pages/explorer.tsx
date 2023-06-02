import { Container, Text } from '@nextui-org/react'
import Transaction from 'components/Transaction'
import { useTransaction } from 'hooks/useTransaction'
import { NextPage } from 'next'

const Explorer: NextPage = () => {
  const { transactions } = useTransaction()
  return (
    <>
      <Container>
        <Text weight={'medium'} size={32}>
          Transactions
        </Text>
        <Transaction queryData={transactions} rowsPerPage={15} />
      </Container>
    </>
  )
}

export default Explorer
