import { ChainStage, getGatewayAddress } from '@futaba-lab/sdk'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

export const useGateway = () => {
  const [gateway, setGateway] = useState('' as `0x${string}`)

  const { chain } = useNetwork()

  useEffect(() => {
    if (!chain) return
    if (chain.id !== 80001) return
    const gw = getGatewayAddress(ChainStage.TESTNET, chain?.id as number) as `0x${string}`
    setGateway(gw)
  }, [chain])

  return gateway
}
