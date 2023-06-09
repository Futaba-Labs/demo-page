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

const theme = createTheme({
  type: 'light',
  theme: {
    colors: {
      green200: '#D5EAD8',
      green300: '#A5D4AD',
      green400: '#89C997',
      green500: '#00A051',
      green600: '#1F8506',
      green700: '#006428',

      primaryLight: '$green200',
      primaryLightHover: '$green300', // commonly used on hover state
      primaryLightActive: '$green400', // commonly used on pressed state
      primaryLightContrast: '$green600', // commonly used for text inside the component
      primary: '$green600',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primaryShadow: '$green500',
    },
  },
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
    <NextThemesProvider defaultTheme='system' attribute='class'>
      <NextUIProvider theme={theme}>
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
