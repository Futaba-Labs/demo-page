import { Dropdown } from '@nextui-org/react'
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
        <Dropdown.Button flat css={{ tt: 'capitalize' }}>
          {selectedValue}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label='Single selection actions'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {keys.map((key) => (
            <Dropdown.Item key={key}>{key}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default DropdownSelect
