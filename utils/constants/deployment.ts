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
      balance: '0x980C6C355CFBb16420e8Af169F7a3F1310090E10',
      custom: '0xbc1bbd63D6cff2DC985F1DE0b166aA39F8a86E3C',
      voting: '0x462D421c1a174AF3f76C6072123Afb6aA7202F25',
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
  },
  [ChainStage.DEVNET]: {
    [ChainKey.GOERLI]: {
      balance: '',
      custom: '',
      voting: '',
      testToken: '0x30D3C07CEB71553CABe5FA4d29fe4Ce2Aead38e5',
    },
    [ChainKey.MUMBAI]: {
      balance: '0x980C6C355CFBb16420e8Af169F7a3F1310090E10',
      custom: '0xbc1bbd63D6cff2DC985F1DE0b166aA39F8a86E3C',
      voting: '0x462D421c1a174AF3f76C6072123Afb6aA7202F25',
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
  },
}
