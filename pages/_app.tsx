'use client'
import '../styles/globals.css'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import Layout from 'components/Layout'
import type { AppProps } from 'next/app'

const lightTheme = createTheme({
  type: 'light',
  theme: {},
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
})

const { chains, provider } = configureChains([polygonMumbai], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'Futaba Demo Page',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider
      defaultTheme='system'
      attribute='class'
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={{
              lightMode: rainbowLightTheme({
                accentColor: '#17C964',
              }),
              darkMode: rainbowDarkTheme({
                accentColor: '#17C964',
              }),
            }}
            coolMode
          >
            <Layout {...pageProps}>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </WagmiConfig>
      </NextUIProvider>
    </NextThemesProvider>
  )
}

export default MyApp
