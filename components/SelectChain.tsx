import { Dropdown } from '@nextui-org/react'
import { QueryForm } from 'pages'
import React, { useMemo, useState } from 'react'
import { UseFormRegister } from 'react-hook-form'

export const SelectChain = React.forwardRef<HTMLUListElement, { label: string } & ReturnType<UseFormRegister<any>>>(
  ({ onChange, onBlur }, ref) => {
    const [selected, setSelected] = useState<any>(new Set(['Select Chain']))

    const selectedValue = useMemo(() => {
      const value = Array.from(selected).join(', ').replaceAll('_', ' ')
      return value
    }, [selected])

    return (
      <Dropdown>
        <Dropdown.Button flat color='success' css={{ tt: 'capitalize' }} onChangeCapture={console.log}>
          {selectedValue}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label='Single selection actions'
          color='primary'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selected}
          onSelectionChange={(keys) => {
            setSelected(keys)
          }}
          ref={ref}
          onChange={() => console.log('test')}
          onBlur={onBlur}
        >
          <Dropdown.Item key='Goerli'>Goerli</Dropdown.Item>
          <Dropdown.Item key='Optimism Goerli'>Optimism Goerli</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  },
)
