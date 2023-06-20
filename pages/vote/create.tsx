import { Container, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import Notice from 'components/Notice'

const Create: NextPage = () => {
  return (
    <>
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={32}>
          Create proposal
        </Text>
      </Container>
    </>
  )
}

export default Create
