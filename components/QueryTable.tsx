import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next/types'
import Image from 'next/image'
import { convertChainIdToName, omitText, getExploerUrl } from 'utils'
import CopySnippet from './CopySnippet'
import { QueryResult } from 'types'

type Props = {
  queries: QueryResult[]
}

const QueryTable: NextPage<Props> = ({ queries }) => {
  return (
    <Table aria-label='Example static collection table' className='mb-10' layout='auto'>
      <TableHeader>
        <TableColumn>Chain</TableColumn>
        <TableColumn>Contract</TableColumn>
        <TableColumn>Height</TableColumn>
        <TableColumn>Slot</TableColumn>
        <TableColumn className='w-2/5'>Value</TableColumn>
      </TableHeader>
      <TableBody emptyContent={<Spinner label='Loading...' color='success' />}>
        {queries.map((query, index) => {
          const imageURL = '/images/chains/' + query.dstChainId.toString() + '.svg'
          const alt = 'chain_' + query.dstChainId.toString()
          return (
            <TableRow key={index}>
              <TableCell>
                <div className='flex items-center'>
                  <Image src={imageURL} width={25} height={25} alt={alt} />
                  <p className='ml-1'>{convertChainIdToName(query.dstChainId)}</p>
                </div>
              </TableCell>
              <TableCell>
                <CopySnippet
                  displayedText={omitText(query.to, 5, 5)}
                  copyText={query.to}
                  link={getExploerUrl(query.dstChainId) + 'address/' + query.to}
                />
              </TableCell>
              <TableCell>{query.height.toString()}</TableCell>
              <TableCell>
                <CopySnippet displayedText={omitText(query.slot, 5, 5)} copyText={query.slot} />
              </TableCell>
              <TableCell>
                <p className='break-words whitespace-pre-wrap'>{query.result}</p>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default QueryTable
