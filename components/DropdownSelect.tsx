import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { NextPage } from 'next'

type Props = {
  selected: any
  setSelected: (set: any) => void
  selectedValue: string
  keys: string[]
}

const DropdownSelect: NextPage<Props> = ({ selected, setSelected, selectedValue, keys }) => {
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button>{selectedValue}</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Single selection actions'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {keys.map((key) => (
            <DropdownItem key={key}>{key}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default DropdownSelect
