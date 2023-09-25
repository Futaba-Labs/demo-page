import {
  Chip,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { NextPage } from 'next/types'
import { useState, useMemo } from 'react'
import { QueryData as QueryData } from 'types'

interface Props {
  queryData: QueryData[]
  rowsPerPage: number
}
interface ChipParam {
  text: string
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}
const Transaction: NextPage<Props> = ({ queryData: queries, rowsPerPage: rowsPerPage }) => {
  const [page, setPage] = useState(1)

  const pages = Math.ceil(queries.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return queries.slice(start, end)
  }, [page, queries])

  const omitText = (text?: string) => {
    return text ? text.substring(0, 10) + '...' : ''
  }

  const convertStatus = (status: number): ChipParam => {
    switch (status) {
      case 0:
        return { text: 'Request Pending...', color: 'secondary' }
      case 1:
        return { text: 'Delivered', color: 'success' }
      case 3:
        return { text: 'Failed', color: 'danger' }
      default:
        return { text: 'Request Pending', color: 'default' }
    }
  }

  const converChain = (chainId: number) => {
    switch (chainId) {
      case 80001:
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img height={25} width={25} src={'/images/matic.svg'} alt='Default Image' />
            <span style={{ paddingLeft: '0.5rem' }}>Mumbai</span>
          </div>
        )

      default:
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img height={25} width={25} src={'/images/matic.svg'} alt='Default Image' />
            <span style={{ paddingLeft: '0.5rem' }}>Mumbai</span>
          </div>
        )
    }
  }

  const getExploerUrl = (chainId: number) => {
    switch (chainId) {
      case 80001:
        return 'https://mumbai.polygonscan.com/tx/'

      default:
        return 'https://mumbai.polygonscan.com/tx/'
    }
  }

  const calculateTimeDifference = (craetedAt: Date) => {
    const now = new Date()
    const timeZoneOffset = now.getTimezoneOffset()
    const adjustedTime = new Date(now.getTime() + timeZoneOffset * 60 * 1000)
    const differenceInMilliseconds = Math.abs(adjustedTime.getTime() - craetedAt.getTime())
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
    const differenceInMinutes = Math.floor(differenceInSeconds / 60)
    const differenceInHours = Math.floor(differenceInMinutes / 60)
    const differenceInDays = Math.floor(differenceInHours / 24)
    const differenceInYears = Math.floor(differenceInDays / 365)

    if (differenceInMinutes < 1) {
      return 'just now'
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} mins ago`
    } else if (differenceInHours < 24) {
      const remainingMinutes = differenceInMinutes % 60
      return `${differenceInHours} hours ${remainingMinutes} mins ago`
    } else if (differenceInDays < 365) {
      const remainingHours = differenceInHours % 24
      return `${differenceInDays} days ${remainingHours} hours ago`
    } else {
      const remainingDays = differenceInDays % 365
      return `${differenceInYears} years ${remainingDays} days ago`
    }
  }

  return (
    <>
      {queries.length > 0 ? (
        <Table
          bottomContent={
            <div className='flex w-full justify-center'>
              <Pagination
                isCompact
                showControls
                showShadow
                color='success'
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          aria-label='Example static collection table'
          className='mb-10'
        >
          <TableHeader>
            <TableColumn>Src Chain</TableColumn>
            <TableColumn>Request Transaction</TableColumn>
            <TableColumn>Response Transaction</TableColumn>
            <TableColumn>Age</TableColumn>
            <TableColumn>Query Id</TableColumn>
            <TableColumn>Deliver Status</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((query) => {
              const { text: status, color } = convertStatus(query.status)
              const resTxHash = omitText(query.executedHash)
              return (
                <TableRow key={query.transactionHash}>
                  <TableCell>{converChain(query.from)}</TableCell>
                  <TableCell>
                    <Link
                      isExternal
                      isBlock
                      showAnchorIcon
                      href={getExploerUrl(query.from) + query.transactionHash}
                      color='success'
                    >
                      {omitText(query.transactionHash)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {resTxHash !== '' ? (
                      <Link
                        isExternal
                        isBlock
                        showAnchorIcon
                        href={getExploerUrl(query.from) + query.executedHash}
                        color='success'
                      >
                        {resTxHash}
                      </Link>
                    ) : (
                      <div></div>
                    )}
                  </TableCell>
                  <TableCell>{calculateTimeDifference(new Date(query.createdAt.toString()))}</TableCell>
                  <TableCell>{omitText(query.id)}</TableCell>
                  <TableCell>
                    <Chip color={color} size='lg'>
                      {status}
                    </Chip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default Transaction
