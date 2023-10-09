import '../styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { polygonMumbai } from 'wagmi/chains'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import Layout from 'components/Layout'
import { env } from 'utils'
import type { AppProps } from 'next/app'

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({
      apiKey: env.RPC_API_KEY_MAP['mumbai'],
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
        <main className='text-foreground bg-light-gradient dark:bg-dark-gradient'>
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
