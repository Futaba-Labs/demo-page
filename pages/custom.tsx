import { Button, Col, Container, Link, Loading, Row, Text } from '@nextui-org/react'
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
    console.log(control._formValues['custom_queries'])
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
        <Text size={18}>
          {'Here you can specify any contract address, block height, and storage slot to run query.'}
        </Text>
        <Text size={18}>
          {'Click '}
          <span>
            <Link
              isExternal
              href='https://docs.axiom.xyz/axiom-architecture/verifying-storage-proofs/how-do-i-find-storage-slots'
              target='_blank'
            >
              here
            </Link>
          </span>
          {' for information on how to calculate storage slots.'}
        </Text>
        {fields.map((field, i) => (
          <div key={i}>
            <div style={{ padding: '20px' }}></div>
            <CustomInputForm
              index={i}
              setChain={setValue}
              registerAddress={register(`custom_queries.${i}.tokenAddress`)}
              registerHeight={register(`custom_queries.${i}.height`)}
              registerSlot={register(`custom_queries.${i}.slot`)}
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
