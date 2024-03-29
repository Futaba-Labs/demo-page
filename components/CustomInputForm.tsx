import { Button, Input } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { FaTrashAlt } from 'react-icons/fa'
import { CHAINS, convertChainNameToId } from 'utils'
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
    setChain(`${formName}.${index}.chain`, value.toString())
    return value
  }, [selected])

  return (
    <div className='flex flex-wrap flex-col w-full md:flex-nowrap md:w-2/3 gap-4'>
      <div className='flex flex-col md:flex-row md:mb-4 gap-4'>
        <div className='basis-1/4'>
          <DropdownSelect selected={selected} selectedValue={selectedValue} setSelected={setSelected} items={CHAINS} />
        </div>
        <Input
          placeholder={'Block height'}
          {...registerHeight}
          type='number'
          fullWidth={false}
          isRequired
          className='basis-1/4'
        />
        <Input placeholder={'Contarct address'} {...registerAddress} isRequired className='basis-1/2' />
      </div>
      <div className='flex'>
        <Input placeholder={'Storage slot'} {...registerSlot} className='mr-4' isRequired />
        <Button onClick={onClick} color={'danger'} variant='flat'>
          <FaTrashAlt color='red' />
        </Button>
      </div>
    </div>
  )
}

export default CustomInputForm
