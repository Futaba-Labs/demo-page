import { NextPage } from 'next/types'
import { Link, Navbar, useTheme } from '@nextui-org/react'
import { Image } from '@nextui-org/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface LayoutProps {
  children?: React.ReactNode
}

const Header = () => {
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
          <Navbar.Link href='/custom'>Custom query</Navbar.Link>
          <Navbar.Link href='/cache'>Access cache</Navbar.Link>
          <Navbar.Link href='/explorer'>Explorer</Navbar.Link>
          <Navbar.Link href='https://futaba.gitbook.io/docs/introduction/futaba-introduction' target='block' isExternal>
            Docs
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
