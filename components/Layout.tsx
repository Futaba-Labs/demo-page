import { NextPage } from 'next/types'
import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import { Image } from '@nextui-org/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { LIGHT_CLIENT_ABI } from 'utils'
import { useLightClient } from 'hooks/useLightClient'
import VerifyModal from './VerifyModal'
interface LayoutProps {
  children?: React.ReactNode
}

const Header = () => {
  return (
    <>
      <Navbar isBordered shouldHideOnScroll>
        <NavbarBrand>
          <Link href='/'>
            <Image height={75} width={220} src={'/images/futaba_banner_black.png'} alt='Default Image' />
          </Link>
        </NavbarBrand>
        <NavbarContent>
          <Link href='/'>Balance query</Link>
          <Link href='/custom'>Custom query</Link>
          <Link href='/cache'>Access cache</Link>
          <Link href='/vote'>Cross-chain Voting</Link>
          <Link href='/explorer'>Explorer</Link>
          <NavbarContent>
            <Link href='https://futaba.gitbook.io/docs/introduction/futaba-introduction' target='block'>
              Docs
            </Link>
          </NavbarContent>
        </NavbarContent>
        <NavbarContent>
          <ConnectButton />
        </NavbarContent>
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
