import { Container, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import Transaction from 'components/Transaction'
import { useTransaction } from 'hooks/useTransaction'

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
