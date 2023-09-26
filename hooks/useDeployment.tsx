import { ChainStage, getChainKey } from '@futaba-lab/sdk'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { Deployment } from 'types'
import { DEPLOYMENT } from 'utils'

export const useDeployment = () => {
  const [deployment, setDeployment] = useState<Deployment>({
    balance: '0x0000000000000000000000000000000000000000',
    voting: '0x0000000000000000000000000000000000000000',
    custom: '0x0000000000000000000000000000000000000000',
  })

  const { chain } = useNetwork()

  useEffect(() => {
    if (!chain) return
    const stage = ChainStage.TESTNET
    try {
      const chainKey = getChainKey(chain.id)
      const d = DEPLOYMENT[stage][chainKey] as Deployment
      setDeployment(d)
    } catch (error) {
      console.log(error)
    }
  }, [chain])

  return deployment
}
