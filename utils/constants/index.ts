import CUSTOM_QUERY_ABI from './abi/custom_query.json'
import BALANCE_QUERY_ABI from './abi/balance_query.abi.json'
import VOTING_ABI from './abi/voting.abi.json'
import ERC20_ABI from './abi/erc20.abi.json'
import LIGHT_CLIENT_ABI from './abi/light_client.abi.json'
import GATEWAY_ABI from './abi/gateway.abi.json'
import ERC721_ABI from './abi/erc721.abi.json'

export { CUSTOM_QUERY_ABI, BALANCE_QUERY_ABI, VOTING_ABI, ERC20_ABI, LIGHT_CLIENT_ABI, GATEWAY_ABI, ERC721_ABI }

export * from './deployment'
export * from './env'

export const mainColor = '#1F8506'

export const NFT_ADDRESS = '0x39AFC1A50b132ad535E7fAA22876cd8Ff8DEccF2'

export const CHAINS = [
  { label: "Sepolia", value: "11155111" },
  { label: "Optimism Sepolia", value: "11155420" },
  { label: "Arbitrum Sepolia", value: "421614" },
]
