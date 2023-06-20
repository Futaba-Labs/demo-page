import { BigNumber, Wallet, ethers } from "ethers"
import { ToastOptions, toast } from "react-toastify"
import { concat, hexZeroPad, keccak256 } from "ethers/lib/utils.js"
import { ERC20ABI } from "./constants"

export const getTokenDecimals = async (chain: string, token: string) => {
  const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY !== undefined ? process.env.NEXT_PUBLIC_PRIVATE_KEY : ""
  const config = getNeteorkConfig(chain)
  if (!config) return
  const wallet = new Wallet(PRIVATE_KEY, config.provider)

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

  return { decimals: result, chainId: config.chainId, chainName: chain }
}

export const getLatestBlockNumber = async (chain: string) => {
  const config = getNeteorkConfig(chain)
  if (!config) return
  const blockNumber = await config.provider.getBlockNumber()
  return blockNumber
}

export const getBalanceSlot = (token: string) => {
  return keccak256(concat([
    // Mappings' keys in Solidity must all be word-aligned (32 bytes)
    hexZeroPad(token, 32),

    // Similarly with the slot-index into the Solidity variable layout
    hexZeroPad(BigNumber.from(0).toHexString(), 32),
  ]));
}

const getNeteorkConfig = (chain: string) => {
  switch (chain) {
    case "Goerli":
      return { chainId: 5, provider: new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_API_KEY}`) }
    case "Optimism Goerli":
      return { chainId: 420, provider: new ethers.providers.JsonRpcProvider(`https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_API_KEY}`) }
    case "Mumbai":
      return { chainId: 80001, provider: new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_TESTNET_API_KEY}`) }
    case "Arbitrum Goerli":
      return { chainId: 421613, provider: new ethers.providers.JsonRpcProvider(`https://arb-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_API_KEY}`) }
    default:
      return
  }
}

export const showToast = (message: string, type: string, isDark = false) => {
  const theme = isDark ? "dark" : "light"
  const toastOpt: ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme,
  }
  switch (type) {
    case "success":
      toast.success(message, toastOpt)
      break
    case "error":
      toast.error(message, toastOpt)
      break
  }
}

export const convertChainNameToId = (chainName: string) => {
  switch (chainName) {
    case "Goerli":
      return 5
    case "Optimism Goerli":
      return 420
    case "Mumbai":
      return 80001
    case "Arbitrum Goerli":
      return 421613
    default:
      return
  }
}

export const convertChainIdToName = (chainId: number) => {
  switch (chainId) {
    case 5:
      return "Goerli"
    case 420:
      return "Optimism Goerli"
    case 80001:
      return "Mumbai"
    case 421613:
      return "Arbitrum Goerli"
    default:
      return
  }
}

export const omitText = (text: string, start: number, end: number) => {
  return text.substring(0, start) + '...' + text.substring(text.length - end, text.length)
}

export const converUnixToDate = (time: number) => {
  const date = new Date(time * 1000);
  return date
}
