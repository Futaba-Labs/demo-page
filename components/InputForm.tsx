import { Button, Col, Input, Row, Spacer } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { Delete } from 'react-iconly'
import DropdownSelect from './DropdownSelect'

type Props = {
  setChain: (name: string, value: string) => void
  index: number
  registerToken: UseFormRegisterReturn
  label: string
  onClick: () => void
} & InputHTMLAttributes<HTMLInputElement>

const InputForm: NextPage<Props> = ({ label, setChain, registerToken, index, onClick }) => {
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
          <DropdownSelect
            selected={selected}
            selectedValue={selectedValue}
            setSelected={setSelected}
            keys={['Goerli', 'Optimism Goerli']}
          />
        </Col>
        <Col>
          <Input labelPlaceholder={label} fullWidth={true} {...registerToken} />
        </Col>
        <Spacer y={1} />
        <Col>
          <Button onClick={onClick} flat auto color={'error'}>
            <Delete primaryColor='red' />
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default InputForm
