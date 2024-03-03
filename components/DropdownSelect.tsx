import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react'
import { NextPage } from 'next'
import Image from 'next/image'

type Props = {
  selected: any
  setSelected: (set: any) => void
  selectedValue: string
  items: {
    label: string
    value: string
  }[]
  defaultSelectedKey?: string
}

const DropdownSelect: NextPage<Props> = ({ setSelected, items, selectedValue, defaultSelectedKey }) => {
  return (
    <Select
      label=''
      placeholder='Select chain'
      labelPlacement='outside'
      isRequired
      onSelectionChange={setSelected}
      defaultSelectedKeys={defaultSelectedKey && [defaultSelectedKey]}
      startContent={
        selectedValue !== '' &&
        selectedValue !== 'Select Chain' && (
          <Image src={'/images/chains/' + selectedValue + '.svg'} width={25} height={25} alt={selectedValue} />
        )
      }
    >
      {items.map((chain) => (
        <SelectItem
          key={chain.value}
          value={chain.value}
          startContent={
            <Image src={'/images/chains/' + chain.value + '.svg'} width={25} height={25} alt={chain.value} />
          }
        >
          {chain.label}
        </SelectItem>
      ))}
    </Select>
  )
}

export default DropdownSelect
