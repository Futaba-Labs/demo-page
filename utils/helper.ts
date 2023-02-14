import { Wallet, ethers } from "ethers"
import { ERC20ABI } from "./constants"

export const getTokenDecimals = async (chain: string, token: string) => {
  const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY !== undefined ? process.env.NEXT_PUBLIC_PRIVATE_KEY : ""
  const { provider, chainId } = getProviderAndEndpoint(chain)
  const wallet = new Wallet(PRIVATE_KEY, provider)

  const erc20 = new ethers.Contract(
    token,
    ERC20ABI,
    wallet
  )
  let result = 0
  try {
    result = await erc20.decimals()
  } catch (error) {
    console.log(error)
  }

  return { decimals: result, chainId }
}

const getProviderAndEndpoint = (chain: string) => {
  switch (chain) {
    case "Goerli":
      return { chainId: 5, provider: new ethers.providers.WebSocketProvider(`wss://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_API_KEY}`, "goerli"), endpoint: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_API_KEY}` }
    case "Optimism Goerli":
      return { chainId: 420, provider: new ethers.providers.WebSocketProvider(`wss://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_API_KEY}`, "optimism-goerli"), endpoint: `https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_API_KEY}` }
    case "Mumbai":
      return { chainId: 80001, provider: new ethers.providers.WebSocketProvider(`wss://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_TESTNET_API_KEY}`, "maticmum"), endpoint: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_TESTNET_API_KEY}` }
    default:
      return { chainId: 5, provider: new ethers.providers.WebSocketProvider(`wss://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_API_KEY}`, "goerli"), endpoint: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_API_KEY}` }
  }
}
