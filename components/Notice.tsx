import { CardBody } from '@nextui-org/react'
import { NextPage } from 'next/types'

const Notice: NextPage = () => {
  return (
    <div>
      <div>
        <div>
          <CardBody>
            <div>The contract used in this demo has not yet been audited and should not be used in production.</div>
          </CardBody>
        </div>
      </div>
    </div>
  )
}

export default Notice
