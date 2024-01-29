import '../styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import '@rainbow-me/rainbowkit/styles.css'

import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import {
  coin98Wallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import Layout from 'components/Layout'
import { env } from 'utils'
import type { AppProps } from 'next/app'
import { infuraProvider } from 'wagmi/providers/infura'
import { SpeedInsights } from '@vercel/speed-insights/next'

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    infuraProvider({
      apiKey: env.RPC_API_KEY,
    }),
  ],
)

const projectId = '5573a7c23be46c0343267fb1dca563af'

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      coin98Wallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
])

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme={'light'}>
        <main className='text-foreground bg-light-gradient dark:bg-dark-gradient bg-cover px-5 md:px-32  '>
          <WagmiConfig config={config}>
            <Layout {...pageProps}>
              <Component {...pageProps} />
              <Analytics />
              <SpeedInsights />
            </Layout>
          </WagmiConfig>
        </main>
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default MyApp
