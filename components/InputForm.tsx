import { Button, Input } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { FaTrashAlt } from 'react-icons/fa'

import { CHAINS, convertChainNameToId } from 'utils'
import DropdownSelect from './DropdownSelect'

type Props = {
  setChain: (name: string, value: string) => void
  index: number
  registerToken: UseFormRegisterReturn
  registerDecimal: UseFormRegisterReturn
  onClick: () => void
  defaultSelectKey?: string
} & InputHTMLAttributes<HTMLInputElement>

const InputForm: NextPage<Props> = ({ setChain, registerToken, registerDecimal, index, onClick, defaultSelectKey }) => {
  const [selected, setSelected] = useState<any>(new Set([defaultSelectKey && 'Select Chain']))

  const selectedValue = useMemo(() => {
    const value = Array.from(selected).join(', ').replaceAll('_', ' ')
    setChain(`queries.${index}.chain`, value.toString())
    return value
  }, [selected])

  return (
    <>
      <div className='flex flex-wrap w-full md:flex-nowrap md:w-3/5 gap-4'>
        <div className='basis-1/4'>
          <DropdownSelect selected={selected} selectedValue={selectedValue} setSelected={setSelected} items={CHAINS} />
        </div>
        <Input placeholder={'Token Address'} fullWidth={true} {...registerToken} className='basis-2/4' isRequired />
        <Button onClick={onClick} color={'danger'} variant='flat'>
          <FaTrashAlt color='red' />
        </Button>
      </div>
    </>
  )
}

export default InputForm
