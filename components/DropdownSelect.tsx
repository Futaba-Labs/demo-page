import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react'
import { NextPage } from 'next'

type Props = {
  selected: any
  setSelected: (set: any) => void
  selectedValue: string
  items: {
    label: string
    value: string
  }[]
}

const DropdownSelect: NextPage<Props> = ({ setSelected, items }) => {
  return (
    <Select label='' placeholder='Select chain' labelPlacement='outside' isRequired onSelectionChange={setSelected}>
      {items.map((chain) => (
        <SelectItem key={chain.value} value={chain.value}>
          {chain.label}
        </SelectItem>
      ))}
    </Select>
  )
}

export default DropdownSelect
