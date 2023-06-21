import { Card, Grid, Row, Text } from '@nextui-org/react'
import { NextPage } from 'next/types'

const Notice: NextPage = () => {
  return (
    <Grid.Container justify='center'>
      <Grid>
        <Card css={{ $$cardColor: '$colors$primary', padding: '0 16px' }}>
          <Card.Body>
            <Row justify='center' align='center'>
              <Text h6 size={15} color='white' css={{ m: 0 }}>
                The contract used in this demo has not yet been audited and should not be used in production.
              </Text>
            </Row>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  )
}

export default Notice
