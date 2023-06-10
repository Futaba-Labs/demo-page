import { Button, Col, Container, Loading, Row, Text } from '@nextui-org/react'
import { NextPage } from 'next'
import { useFieldArray, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import CustomInputForm from 'components/CustomInputForm'
import Notice from 'components/Notice'

const Custom: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const { register, control, setValue } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_queries',
  })

  const { address, isConnected, isDisconnected } = useAccount()

  const sendQuery = async () => {
    console.log('send query')
  }

  return (
    <>
      <Container>
        <div style={{ padding: '8px' }}></div>
        <Notice />
        <div style={{ padding: '8px' }}></div>
        <Text weight={'medium'} size={32}>
          Custom Query
        </Text>
        {fields.map((field, i) => (
          <div key={i}>
            <div style={{ padding: '16px' }}></div>
            <CustomInputForm
              label='Token Address'
              index={i}
              setChain={setValue}
              registerToken={register(`custom_queries.${i}.tokenAddress`)}
              onClick={() => remove(i)}
            />
          </div>
        ))}
        <div style={{ padding: '16px' }}></div>
        <Row gap={0}>
          <Col span={2}>
            <Button onClick={() => append({ chain: '', tokenAddress: '' })} flat auto disabled={fields.length > 11}>
              Add Query
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                sendQuery()
              }}
              flat
              auto
              disabled={fields.length === 0 || isDisconnected || loading}
            >
              {loading ? <Loading size='sm' /> : 'Send Query'}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Custom
