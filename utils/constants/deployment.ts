import { ChainId, ChainKey, ChainStage, getChainKey } from "@futaba-lab/sdk"

type Deployment = {
  balance: string
  custom: string
  voting: string
}

export const DEPLOYMENT: Record<ChainStage, Partial<Record<ChainKey, Deployment>>> = {
  [ChainStage.MAINNET]: {
    [ChainKey.ETHEREUM]: {
      balance: "",
      custom: "",
      voting: "",
    },
    [ChainKey.POLYGON]: {
      balance: "",
      custom: "",
      voting: "",
    },
    [ChainKey.ARBITRUM]: {
      balance: "",
      custom: "",
      voting: "",
    },
    [ChainKey.OPTIMISM]: {
      balance: "",
      custom: "",
      voting: "",
    },
  },
  [ChainStage.TESTNET]: {
    [ChainKey.GOERLI]: {
      balance: "",
      custom: "",
      voting: "",
    },
    [ChainKey.MUMBAI]: {
      balance: "0x980C6C355CFBb16420e8Af169F7a3F1310090E10",
      custom: "0xbc1bbd63D6cff2DC985F1DE0b166aA39F8a86E3C",
      voting: "0x462D421c1a174AF3f76C6072123Afb6aA7202F25",
    },
    [ChainKey.ARBITRUM_GOERLI]: {
      balance: "",
      custom: "",
      voting: "",
    },
    [ChainKey.OPTIMISM_GOERLI]: {
      balance: "",
      custom: "",
      voting: "",
    },
  },
}

export const getDeployment = (stage: ChainStage, chainId: ChainId) => {
  const chainKey = getChainKey(chainId)
  const deployment = DEPLOYMENT[stage][chainKey]
  if (!deployment) {
    throw new Error(`No deployment for ${stage} ${chainKey}`)
  }
  return deployment
}
