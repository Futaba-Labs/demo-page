'use client'
import '../styles/globals.css'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '@rainbow-me/rainbowkit/styles.css'

import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import Layout from 'components/Layout'
import { mainColor } from 'utils/constants'
import type { AppProps } from 'next/app'

const lightTheme = createTheme({
  type: 'light',
  theme: {},
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
})

const { chains, publicClient } = configureChains([polygonMumbai], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'Futaba demo app',
  projectId: '5573a7c23be46c0343267fb1dca563af',
  chains,
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
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
        <WagmiConfig config={config}>
          <RainbowKitProvider
            showRecentTransactions={true}
            chains={chains}
            theme={{
              lightMode: rainbowLightTheme({
                accentColor: mainColor,
              }),
              darkMode: rainbowDarkTheme({
                accentColor: mainColor,
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
