import { NextPage } from 'next/types'
import { useTheme as useNextTheme } from 'next-themes'
import { Navbar, Switch, useTheme } from '@nextui-org/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Image } from '@nextui-org/react'

interface LayoutProps {
  children?: React.ReactNode
}

const Header = () => {
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()
  return (
    <Navbar variant={'sticky'} isBordered>
      <Navbar.Brand>
        <Image width={300} src='https://i.ibb.co/nP58sy7/lohoho.png' alt='Default Image' objectFit='scale-down' />
      </Navbar.Brand>
      <Navbar.Content hideIn='xs'>
        <ConnectButton />
        <Switch checked={isDark} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
      </Navbar.Content>
    </Navbar>
  )
}

const Layout: NextPage = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default Layout
