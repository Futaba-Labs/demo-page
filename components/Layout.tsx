'use client'
import { NextPage } from 'next/types'
import { useTheme as useNextTheme } from 'next-themes'
import { Navbar, useTheme } from '@nextui-org/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Image } from '@nextui-org/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

interface LayoutProps {
  children?: React.ReactNode
}

const Header = () => {
  const { setTheme } = useNextTheme()
  const { isDark } = useTheme()
  return (
    <>
      <Navbar variant='floating' shouldHideOnScroll>
        <Navbar.Brand>
          <Image
            height={75}
            width={220}
            src={isDark ? '/images/futaba_banner_white.png' : '/images/futaba_banner_black.png'}
            alt='Default Image'
            objectFit='scale-down'
          />
        </Navbar.Brand>
        <Navbar.Content hideIn='xs' activeColor='success' gap={'$12'} enableCursorHighlight>
          <Navbar.Link href='/'>Home</Navbar.Link>
          <Navbar.Link href='/explorer'>Explorer</Navbar.Link>
          <Navbar.Link href='https://futaba.gitbook.io/docs/introduction/futaba-introduction' target='block' isExternal>
            Docs
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <ConnectButton />
          {/* <Switch checked={isDark} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} color='success' /> */}
        </Navbar.Content>
      </Navbar>
    </>
  )
}

const Layout: NextPage = ({ children }: LayoutProps) => {
  const { isDark } = useTheme()

  return (
    <>
      <Header />
      <main>{children}</main>
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
