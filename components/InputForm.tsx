import { Button, Card, Col, Container, Dropdown, Input, Row, Spacer } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type Props = {
  setChain: (name: string, value: string) => void
  index: number
  registerToken: UseFormRegisterReturn
  label: string
  onClick: () => void
} & InputHTMLAttributes<HTMLInputElement>

const InputPage: NextPage<Props> = ({ label, setChain, registerToken, index, onClick }) => {
  const [selected, setSelected] = useState<any>(new Set(['Select Chain']))

  const selectedValue = useMemo(() => {
    const value = Array.from(selected).join(', ').replaceAll('_', ' ')
    setChain(`queries.${index}.chain`, value)
    return value
  }, [selected])

  return (
    <>
      <Row gap={0}>
        <Col span={4}>
          {/* <input type='text' {...registerChain} value={selectedValue} onChange={console.log} onChangeCapture={}/> */}
          <Dropdown>
            <Dropdown.Button flat color='success' css={{ tt: 'capitalize' }}>
              {selectedValue}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label='Single selection actions'
              color='primary'
              disallowEmptySelection
              selectionMode='single'
              selectedKeys={selected}
              onSelectionChange={setSelected}
            >
              <Dropdown.Item key='Goerli'>Goerli</Dropdown.Item>
              <Dropdown.Item key='Optimism Goerli'>Optimism Goerli</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <Input labelPlaceholder={label} fullWidth={true} {...registerToken} />
        </Col>
        <Spacer y={1} />
        <Col>
          <Button onClick={onClick} flat auto color={'error'}>
            Remove Query
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default InputPage
