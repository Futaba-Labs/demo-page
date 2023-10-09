import { Link, Snippet } from '@nextui-org/react'
import { NextPage } from 'next/types'

type Props = {
  displayedText: string
  copyText: string
  link?: string
}

const CopySnippet: NextPage<Props> = ({ displayedText, copyText, link }) => {
  return (
    <Snippet hideSymbol={true} variant='flat' className='bg-white p-0' codeString={copyText}>
      {link ? (
        <Link href={link} isExternal>
          <p className='font-sans text-small'>{displayedText}</p>
        </Link>
      ) : (
        <p className='font-sans'>{displayedText}</p>
      )}
    </Snippet>
  )
}

export default CopySnippet
