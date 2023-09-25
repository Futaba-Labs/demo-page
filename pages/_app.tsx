import '../styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import '@rainbow-me/rainbowkit/styles.css'

import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { polygonMumbai } from 'wagmi/chains'
import Layout from 'components/Layout'
import type { AppProps } from 'next/app'

// const theme = createTheme({
//   type: 'light',
//   theme: {
//     colors: {
//       green200: '#D5EAD8',
//       green300: '#A5D4AD',
//       green400: '#89C997',
//       green500: '#00A051',
//       green600: '#1F8506',
//       green700: '#006428',

//       primaryLight: '$green200',
//       primaryLightHover: '$green300', // commonly used on hover state
//       primaryLightActive: '$green400', // commonly used on pressed state
//       primaryLightContrast: '$green600', // commonly used for text inside the component
//       primary: '$green600',
//       primaryBorder: '$green500',
//       primaryBorderHover: '$green600',
//       primarySolidHover: '$green700',
//       primaryShadow: '$green500',
//     },
//   },
// })

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_RPC_KEY !== undefined ? process.env.NEXT_PUBLIC_RPC_KEY : '',
    }),
  ],
)

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
    <NextUIProvider>
      <main className='light text-foreground bg-background'>
        <WagmiConfig config={config}>
          <RainbowKitProvider
            showRecentTransactions={true}
            chains={chains}
            theme={{
              lightMode: rainbowLightTheme({
                accentColor: '#1F8506',
              }),
              darkMode: rainbowDarkTheme({
                accentColor: '#1F8506',
              }),
            }}
            coolMode
          >
            <Layout {...pageProps}>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </WagmiConfig>
      </main>
    </NextUIProvider>
  )
}

export default MyApp
