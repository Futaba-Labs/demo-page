import { Button, Input } from '@nextui-org/react'
import { NextPage } from 'next'
import { InputHTMLAttributes, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { FaTrashAlt } from 'react-icons/fa'

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
      <div className='flex flex-wrap w-full md:flex-nowrap md:w-3/5 gap-4'>
        <div>
          <DropdownSelect
            selected={selected}
            selectedValue={selectedValue}
            setSelected={setSelected}
            keys={['Goerli', 'Optimism Goerli', 'Arbitrum Goerli']}
          />
        </div>

        <Input placeholder={'Token Address'} fullWidth={true} {...registerToken} />

        <Button onClick={onClick} color={'danger'} variant='flat'>
          <FaTrashAlt color='red' />
        </Button>
      </div>
    </>
  )
}

export default InputForm
