import { Card, Row, Text } from '@nextui-org/react'
import { NextPage } from 'next/types'

const Notice: NextPage = () => {
  return (
    <Card css={{ $$cardColor: '$colors$primary' }}>
      <Card.Body>
        <Row justify='center' align='center'>
          <Text h6 size={15} color='white' css={{ m: 0 }}>
            The contract used in this demo has not yet been audited and should not be used in production.
          </Text>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default Notice
