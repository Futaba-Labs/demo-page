import { ChainStage } from '@futaba-lab/sdk'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { Deployment } from 'types'
import { getDeployment } from 'utils'

export const useDeployment = () => {
  const [deployment, setDeployment] = useState<Deployment>({
    balance: '',
    voting: '',
    custom: '',
  })

  const { chain } = useNetwork()

  useEffect(() => {
    if (!chain) return
    const d = getDeployment(ChainStage.TESTNET, chain?.id as number)
    setDeployment(d)
  }, [chain])

  return deployment
}
