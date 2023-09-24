import { NextPage } from 'next/types'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link as NextLink,
} from '@nextui-org/react'
import { Image } from '@nextui-org/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import Link from 'next/link'
import { LIGHT_CLIENT_ABI } from 'utils'
import { useLightClient } from 'hooks/useLightClient'
import VerifyModal from './VerifyModal'
interface LayoutProps {
  children?: React.ReactNode
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} isBordered shouldHideOnScroll maxWidth='full'>
        <NavbarContent className='lg:hidden' justify='start'>
          <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
        </NavbarContent>
        <NavbarBrand>
          <Link href='/'>
            <Image height={75} width={220} src={'/images/futaba_banner_black.png'} alt='Default Image' />
          </Link>
        </NavbarBrand>
        <NavbarContent className='hidden lg:flex gap-4' justify='start'>
          <NavbarItem>
            <Link href='/'>Balance query</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/custom'>Custom query</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/cache'>Access cache</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/vote'>Cross-chain Voting</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/explorer'>Explorer</Link>
          </NavbarItem>
          <NavbarItem>
            <NextLink href='https://futaba.gitbook.io/docs/introduction/futaba-introduction' isExternal showAnchorIcon>
              Docs
            </NextLink>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent>
          <ConnectButton />
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <Link href='/'>Balance query</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/custom'>Custom query</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/cache'>Access cache</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/vote'>Cross-chain Voting</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/explorer'>Explorer</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink href='https://futaba.gitbook.io/docs/introduction/futaba-introduction' isExternal showAnchorIcon>
              Docs
            </NextLink>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </>
  )
}

const Layout: NextPage = ({ children }: LayoutProps) => {
  const [visible, setVisible] = useState(false)
  const handler = () => window.open('https://futaba.gitbook.io/docs/introduction/futaba-introduction', '_blank')
  const closeHandler = () => setVisible(false)

  const { address, isConnected } = useAccount()
  const lightClient = useLightClient()

  const { data, refetch, isError } = useContractRead({
    address: lightClient as `0x${string}`,
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
      />
    </>
  )
}

export default Layout
