import type { NextPage } from 'next'
import { useFieldArray, useForm } from 'react-hook-form'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Col, Container, Grid, Row, Spacer, Text } from '@nextui-org/react'
import InputPage from 'components/InputForm'

export interface QueryForm {
  chain: string
  tokenAddress: string
}

const Home: NextPage = () => {
  const { register, control, setValue, handleSubmit } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'queries',
  })

  const sendQuery = () => {
    const queries: QueryForm[] = control._formValues['queries'].map((f: any) => {
      return { chain: f['chain'], tokenAddress: f['tokenAddress'] }
    })

    try {
      // TODO send transaction
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Container>
        <Text weight={'medium'} size={48}>
          Futaba Demo Page
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          On this page you can experience Futaba's query.
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          Enter the chain and token address and a new token will be minted for that total amount.
        </Text>
        <Text weight={'normal'} size={24} css={{ padding: '1px' }}>
          Let's try it 🚀
        </Text>
      </Container>
      <Container>
        {fields.map((field, i) => (
          <div key={i}>
            <div style={{ padding: '16px' }}></div>
            <InputPage
              label='Token Address'
              index={i}
              setChain={setValue}
              registerToken={register(`queries.${i}.tokenAddress`)}
              onClick={() => remove(i)}
            />
          </div>
        ))}
        <div style={{ padding: '16px' }}></div>
        <Row gap={0}>
          <Col span={2}>
            <Button onClick={() => append({ chain: '', tokenAddress: '' })} flat auto color={'success'}>
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
              color={'success'}
              disabled={fields.length === 0}
            >
              Send Query
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
