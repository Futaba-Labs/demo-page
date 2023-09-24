import { Button, Input, Spacer } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { Delete } from 'react-iconly'
import DropdownSelect from './DropdownSelect'

type Props = {
  formName: string
  setChain: (name: string, value: string) => void
  index: number
  registerAddress: UseFormRegisterReturn
  registerHeight: UseFormRegisterReturn
  registerSlot: UseFormRegisterReturn
  onClick: () => void
} & InputHTMLAttributes<HTMLInputElement>

const CustomInputForm: NextPage<Props> = ({
  formName,
  setChain,
  registerAddress,
  registerHeight,
  registerSlot,
  index,
  onClick,
}) => {
  const [selected, setSelected] = useState<any>(new Set(['Select Chain']))

  const selectedValue = useMemo(() => {
    const value = Array.from(selected).join(', ').replaceAll('_', ' ')
    setChain(`${formName}.${index}.chain`, value)
    return value
  }, [selected])

  return (
    <div style={{ width: '70%' }}>
      <div>
        <DropdownSelect
          selected={selected}
          selectedValue={selectedValue}
          setSelected={setSelected}
          keys={['Goerli', 'Optimism Goerli', 'Arbitrum Goerli']}
        />
        <Spacer x={1} />
        <Input placeholder={'Block height'} {...registerHeight} type='number' fullWidth={true} />
        <Spacer x={1} />
        <Input placeholder={'Contarct address'} {...registerAddress} fullWidth={true} />
      </div>
      <div style={{ padding: '16px' }}></div>
      <div>
        <Input placeholder={'Storage slot'} fullWidth={true} {...registerSlot} />
        <Spacer y={1} />
        <Button onClick={onClick} color={'danger'}>
          <Delete primaryColor='red' />
        </Button>
      </div>
    </div>
  )
}

export default CustomInputForm
