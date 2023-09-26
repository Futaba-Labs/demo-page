import { Button, Input } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { Delete } from 'react-iconly'
import { convertChainNameToId } from 'utils'
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
    const chainId = convertChainNameToId(value)
    if (chainId) {
      setChain(`${formName}.${index}.chain`, chainId.toString())
    }
    return value
  }, [selected])

  return (
    <div className='flex flex-col w-2/3'>
      <div className='flex flex-row mb-4 gap-4'>
        <div>
          <DropdownSelect
            selected={selected}
            selectedValue={selectedValue}
            setSelected={setSelected}
            keys={['Goerli', 'Optimism Goerli', 'Arbitrum Goerli']}
          />
        </div>
        <div className='flex flex-row gap-4 w-full'>
          <Input
            placeholder={'Block height'}
            {...registerHeight}
            type='number'
            fullWidth={false}
            className='basis-1/4'
          />
          <Input placeholder={'Contarct address'} {...registerAddress} className='basis-3/4' />
        </div>
      </div>
      <div className='flex'>
        <Input placeholder={'Storage slot'} {...registerSlot} className='mr-4' />
        <Button onClick={onClick} color={'danger'} variant='flat'>
          <Delete primaryColor='red' />
        </Button>
      </div>
    </div>
  )
}

export default CustomInputForm
