import { Chip } from '@nextui-org/react'
import { NextPage } from 'next/types'

const Notice: NextPage = () => {
  return (
    <div className='flex justify-center'>
      <Chip variant='shadow' size='lg' className='bg-green-500 px-4 py-6'>
        <span className='text-white'>
          The contract used in this demo has not yet been audited and should not be used in production.
        </span>
      </Chip>
    </div>
  )
}

export default Notice
