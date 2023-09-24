import { Button, Input, Spacer } from '@nextui-org/react'
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
      <div>
        <div>
          <DropdownSelect
            selected={selected}
            selectedValue={selectedValue}
            setSelected={setSelected}
            keys={['Goerli', 'Optimism Goerli', 'Arbitrum Goerli']}
          />
        </div>
        <div>
          <Input placeholder={label} fullWidth={true} {...registerToken} />
        </div>
        <Spacer y={1} />
        <div>
          <Button onClick={onClick} color={'danger'}>
            <Delete primaryColor='red' />
          </Button>
        </div>
      </div>
    </>
  )
}

export default InputForm
