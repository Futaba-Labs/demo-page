import { NextPage } from 'next/types'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  useDisclosure,
  Button,
} from '@nextui-org/react'
import {
  RainbowKitProvider,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { BsSun, BsMoon } from 'react-icons/bs'
import { FaTwitter } from 'react-icons/fa'
import { useTheme } from 'next-themes'
import { polygonMumbai } from 'viem/chains'
import { configureChains } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { usePageTheme } from 'hooks'
import { env } from 'utils'

interface LayoutProps {
  children?: React.ReactNode
}

const Header = () => {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { osTheme } = usePageTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log(`osTheme: ${osTheme}`)
    if (osTheme === 'light') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }, [osTheme])

  if (!mounted) return null

  return (
    <>
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth='full'
        height='5rem'
        className='rounded-full mt-4 drop-shadow-xl'
      >
        <NavbarBrand>
          <Link href='/' as={NextLink}>
            {theme === 'light' ? (
              <Image height={75} width={220} src={'/images/futaba_banner_black.png'} alt='Default Image' />
            ) : (
              <Image height={75} width={220} src={'/images/futaba_banner_white.png'} alt='Default Image' />
            )}
          </Link>
        </NavbarBrand>
        <NavbarContent className='hidden lg:flex gap-4' justify='start'>
          <NavbarItem>
            <Link href='/faucet' as={NextLink} color='foreground'>
              Faucet
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/' as={NextLink} color='foreground'>
              Balance
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/custom' as={NextLink} color='foreground'>
              Custom
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/cache' as={NextLink} color='foreground'>
              Cache
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/vote' as={NextLink} color='foreground'>
              Voting
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='/explorer' as={NextLink} color='foreground'>
              Explorer
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href='https://futaba.gitbook.io/docs/guide/futaba-demo' isExternal showAnchorIcon color='primary'>
              Guide
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end'>
          <ConnectButton
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
          <div className='flex gap-1 items-center'>
            <Button isIconOnly variant='light' className='hidden lg:flex'>
              <Link href='https://twitter.com/FutabaOmni' color='foreground' isExternal>
                <FaTwitter />
              </Link>
            </Button>
            {theme === 'light' ? (
              <Button isIconOnly variant='light' onClick={() => setTheme('dark')} className='hidden lg:flex'>
                <BsMoon />
              </Button>
            ) : (
              <Button isIconOnly variant='light' onClick={() => setTheme('light')} className='hidden lg:flex'>
                <BsSun />
              </Button>
            )}
            <NavbarMenuToggle className='lg:hidden' aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
          </div>
        </NavbarContent>
        <NavbarMenu className='mt-4'>
          <NavbarItem>
            <Link href='/faucet' as={NextLink}>
              Faucet
            </Link>
          </NavbarItem>
          <NavbarMenuItem>
            <Link href='/' as={NextLink}>
              Balance
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/custom' as={NextLink}>
              Custom
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/cache' as={NextLink}>
              Access
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/vote' as={NextLink}>
              Voting
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='/explorer' as={NextLink}>
              Explorer
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='https://futaba.gitbook.io/docs/guide/futaba-demo' isExternal showAnchorIcon>
              Docs
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='https://twitter.com/FutabaOmni' isExternal showAnchorIcon>
              Twitter
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            {theme === 'light' ? (
              <Button isIconOnly variant='light' onClick={() => setTheme('dark')}>
                <BsMoon />
              </Button>
            ) : (
              <Button isIconOnly variant='light' onClick={() => setTheme('light')}>
                <BsSun />
              </Button>
            )}
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </>
  )
}

const { chains } = configureChains(
  [polygonMumbai],
  [
    infuraProvider({
      apiKey: env.RPC_API_KEY_MAP['mumbai'],
    }),
  ],
)

const Layout: NextPage = ({ children }: LayoutProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { pageTheme } = usePageTheme()

  useEffect(() => {
    onOpen()
  }, [onOpen])

  return (
    <>
      <RainbowKitProvider
        showRecentTransactions={true}
        chains={chains}
        theme={
          pageTheme === 'light'
            ? rainbowLightTheme({
                accentColor: '#1F8506',
              })
            : rainbowDarkTheme({
                accentColor: '#1F8506',
              })
        }
        coolMode
      >
        <Head>
          <title>Futaba Demo</title>
          <meta name='description' content='Demo page to try Futaba in action' />
          <meta property='og:title' content='Futaba Demo' />
          <meta property='og:description' content={'Demo page to try Futaba in action'} />
          <meta property='og:image' content={'/images/futaba_ogp.png'} />
        </Head>
        <Header />

        <main>{children}</main>

        {/* <VerifyModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} /> */}
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
      </RainbowKitProvider>
    </>
  )
}

export default Layout
