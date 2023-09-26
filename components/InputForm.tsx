import { Button, Input } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { Delete } from 'react-iconly'
import { convertChainNameToId } from 'utils'
import DropdownSelect from './DropdownSelect'

type Props = {
  setChain: (name: string, value: string) => void
  index: number
  registerToken: UseFormRegisterReturn
  registerDecimal: UseFormRegisterReturn
  onClick: () => void
} & InputHTMLAttributes<HTMLInputElement>

const InputForm: NextPage<Props> = ({ setChain, registerToken, registerDecimal, index, onClick }) => {
  const [selected, setSelected] = useState<any>(new Set(['Select Chain']))

  const selectedValue = useMemo(() => {
    const value = Array.from(selected).join(', ').replaceAll('_', ' ')
    const chainId = convertChainNameToId(value)
    if (chainId) {
      setChain(`queries.${index}.chain`, chainId.toString())
    }
    return value
  }, [selected])

  return (
    <>
      <div className='flex w-4/5'>
        <div className='mr-4'>
          <DropdownSelect
            selected={selected}
            selectedValue={selectedValue}
            setSelected={setSelected}
            keys={['Goerli', 'Optimism Goerli', 'Arbitrum Goerli']}
          />
        </div>

        <div className='flex flex-row gap-4 mr-4'>
          <div className='flex flex-col w-full gap-2 basis-3/4'>
            <Input placeholder={'Token Address'} fullWidth={true} {...registerToken} />
            <p className='text-default-500 text-xs'>Enter an address and the decimal will be automatically entered.</p>
          </div>
          <Input placeholder={'Decimal'} {...registerDecimal} type={'number'} className='basis-1/4' />
        </div>

        <Button onClick={onClick} color={'danger'} variant='flat'>
          <Delete primaryColor='red' />
        </Button>
      </div>
    </>
  )
}

export default InputForm
