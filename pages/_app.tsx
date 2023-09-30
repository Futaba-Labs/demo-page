import '../styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { polygonMumbai } from 'wagmi/chains'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import Layout from 'components/Layout'
import type { AppProps } from 'next/app'

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
      <NextThemesProvider attribute='class' defaultTheme={'light'}>
        <main className='text-foreground bg-background'>
          <WagmiConfig config={config}>
            <Layout {...pageProps}>
              <Component {...pageProps} />
            </Layout>
          </WagmiConfig>
        </main>
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default MyApp
