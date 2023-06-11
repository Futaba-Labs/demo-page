import { NextPage } from 'next/types'
import { Navbar, useTheme } from '@nextui-org/react'
import { Image } from '@nextui-org/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import styled from 'styled-components'

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
