import { ChainStage, getLightClientAddress } from '@futaba-lab/sdk'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

export const useLightClient = () => {
  const [lightClient, setLightClient] = useState('' as `0x${string}`)

  const { chain } = useNetwork()

  useEffect(() => {
    if (!chain) return
    if (chain.id !== 80001) return
    const lc = getLightClientAddress(ChainStage.TESTNET, chain?.id as number) as `0x${string}`
    setLightClient(lc)
  }, [chain])

  return lightClient
}
