import { NextPage } from 'next/types'
import { Navbar, useTheme } from '@nextui-org/react'
import { Image } from '@nextui-org/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import styled from 'styled-components'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork, useContractRead } from 'wagmi'
import { DEPLOYMENTS, LIGHT_CLIENT_ABI } from 'utils/constants'
import VerifyModal from './VerifyModal'

interface LayoutProps {
  children?: React.ReactNode
}

const Header = () => {
  const { theme } = useTheme()
  const CustomLink = styled.span`
    color: ${theme!.colors.black.value};
    &:hover {
      color: ${theme!.colors.accents5.value};
      transition-duration: 200ms;
    }
  `
  return (
    <>
      <Navbar variant='floating' shouldHideOnScroll>
        <Navbar.Brand>
          <Link href='/'>
            <Image
              height={75}
              width={220}
              src={'/images/futaba_banner_black.png'}
              alt='Default Image'
              objectFit='scale-down'
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Content hideIn='xs' gap={'$12'}>
          <Link href='/custom'>
            <CustomLink>Custom query</CustomLink>
          </Link>
          <Link href='/cache'>
            <CustomLink>Access cache</CustomLink>
          </Link>
          <Link href='/vote'>
            <CustomLink>Cross-chain Voting</CustomLink>
          </Link>
          <Link href='/explorer'>
            <CustomLink>Explorer</CustomLink>
          </Link>
          <Navbar.Link href='https://futaba.gitbook.io/docs/introduction/futaba-introduction' target='block' isExternal>
            <CustomLink>Docs</CustomLink>
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <ConnectButton />
        </Navbar.Content>
      </Navbar>
    </>
  )
}

const Layout: NextPage = ({ children }: LayoutProps) => {
  const { isDark } = useTheme()
  const [visible, setVisible] = useState(false)
  const handler = () => window.open('https://futaba.gitbook.io/docs/introduction/futaba-introduction', '_blank')
  const closeHandler = () => setVisible(false)

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const { data, refetch, isError } = useContractRead({
    address: DEPLOYMENTS['light_client'][
      chain?.id.toString() as keyof (typeof DEPLOYMENTS)['light_client']
    ] as `0x${string}`,
    abi: LIGHT_CLIENT_ABI,
    functionName: 'isWhitelisted',
    args: [address],
  })

  useEffect(() => {
    if (isError) setVisible(true)
    if (isConnected && data) {
      setVisible(!data as boolean)
    } else {
      setVisible(true)
    }
  }, [data, isError])

  useEffect(() => {
    setVisible(true)
    if (address) {
      refetch()
    }
  }, [address])

  return (
    <>
      <Head>
        <title>Futaba Demo</title>
        <meta name='description' content='Demo page to try Futaba in action' />
        <meta property='og:title' content='Futaba Demo' />
        <meta property='og:description' content={'Demo page to try Futaba in action'} />
        <meta property='og:image' content={'/images/futaba_ogp.png'} />
      </Head>
      <Header />
      <main>{children}</main>
      <VerifyModal visible={visible} handler={handler} closeHandler={closeHandler} />
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  )
}

export default Layout
