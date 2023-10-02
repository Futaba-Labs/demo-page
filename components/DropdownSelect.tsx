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
      <Dropdown className=''>
        <DropdownTrigger>
          <Button className='px-6' color='success' variant='flat'>
            {selectedValue}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Single selection actions'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selected}
          onSelectionChange={setSelected}
          color='success'
          variant='flat'
        >
          {keys.map((key) => (
            <DropdownItem key={key} className='text-black dark:text-white'>
              {key}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default DropdownSelect
