import { Button, Input } from '@nextui-org/react'
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
      <div className='flex w-2/3'>
        <div className='mr-4'>
          <DropdownSelect
            selected={selected}
            selectedValue={selectedValue}
            setSelected={setSelected}
            keys={['Goerli', 'Optimism Goerli', 'Arbitrum Goerli']}
          />
        </div>

        <Input placeholder={label} fullWidth={true} {...registerToken} className='mr-4' />

        <Button onClick={onClick} color={'danger'} variant='flat'>
          <Delete primaryColor='red' />
        </Button>
      </div>
    </>
  )
}

export default InputForm
