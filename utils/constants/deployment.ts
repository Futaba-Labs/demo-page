import { ChainKey, ChainStage } from '@futaba-lab/sdk'
import { Deployment } from 'types'

export const DEPLOYMENT: Record<ChainStage, Partial<Record<ChainKey, Deployment>>> = {
  [ChainStage.MAINNET]: {
    [ChainKey.ETHEREUM]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '',
    },
    [ChainKey.POLYGON]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '',
    },
    [ChainKey.ARBITRUM]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '',
    },
    [ChainKey.OPTIMISM]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '',
    },
  },
  [ChainStage.TESTNET]: {
    [ChainKey.GOERLI]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x30D3C07CEB71553CABe5FA4d29fe4Ce2Aead38e5',
    },
    [ChainKey.MUMBAI]: {
      balance: "0xA20c1fA80FFCb4e7bb9ACEC26028Ac1a1492Ec83",
      custom: "0x0A15BF261A3C45D9288c0BDe8E7543b03bc99e20",
      voting: "0x60fc298716FAA62Cd26045769A3B07dD8961a0cd",
      testToken: '',
    },
    [ChainKey.ARBITRUM_GOERLI]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0xD3BbB5f1269e8Cd3677C951722dA5597D450D121',
    },
    [ChainKey.OPTIMISM_GOERLI]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x73969C83706a2aED1D5CB242CA365EdFe679DFE3',
    },
    [ChainKey.ARBITRUM_SEPOLIA]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x0Ea06D21B4163E9C60063e562cBd1739aE7B7015',
    },
    [ChainKey.OPTIMISM_SEPOLIA]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x21370CaE272802491CB4115EF4e188Ac3721d992',
    },
    [ChainKey.SEPOLIA]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x91D1a12c16d2Ff1c072069a9d9c90d2c0299B244',
    },
  },
  [ChainStage.DEVNET]: {
    [ChainKey.GOERLI]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x30D3C07CEB71553CABe5FA4d29fe4Ce2Aead38e5',
    },
    [ChainKey.MUMBAI]: {
      balance: "0xA20c1fA80FFCb4e7bb9ACEC26028Ac1a1492Ec83",
      custom: "0x0A15BF261A3C45D9288c0BDe8E7543b03bc99e20",
      voting: "0x60fc298716FAA62Cd26045769A3B07dD8961a0cd",
      testToken: '',
    },
    [ChainKey.ARBITRUM_GOERLI]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0xD3BbB5f1269e8Cd3677C951722dA5597D450D121',
    },
    [ChainKey.OPTIMISM_GOERLI]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x73969C83706a2aED1D5CB242CA365EdFe679DFE3',
    },
    [ChainKey.ARBITRUM_SEPOLIA]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x0Ea06D21B4163E9C60063e562cBd1739aE7B7015',
    },
    [ChainKey.OPTIMISM_SEPOLIA]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x21370CaE272802491CB4115EF4e188Ac3721d992',
    },
    [ChainKey.SEPOLIA]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x91D1a12c16d2Ff1c072069a9d9c90d2c0299B244',
    },
  },
}
