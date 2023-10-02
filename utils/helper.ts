import { Wallet, ethers } from "ethers"
import { ToastOptions, toast } from "react-toastify"
import { concat, hexZeroPad, keccak256 } from "ethers/lib/utils.js"
import { ERC20_ABI } from "./constants"

const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY !== undefined ? process.env.NEXT_PUBLIC_PRIVATE_KEY : ""

export const getWallet = (chainId: number) => {
  const provider = getProvider(chainId)
  if (!provider) throw new Error("Invalid chainId")
  const wallet = new Wallet(PRIVATE_KEY, provider)
  return wallet
}

export const getTokenDecimal = async (chainId: number, token: string) => {
  const wallet = getWallet(chainId)

  const erc20 = new ethers.Contract(
    token,
    ERC20_ABI,
    wallet
  )
  let decimal = 18
  try {
    decimal = await erc20.decimals()
  } catch (error) {
    console.log(error)
  }

  return decimal
}

export const getLatestBlockNumber = async (chainId: number) => {
  const provider = getProvider(chainId)
  if (!provider) return
  const blockNumber = await provider.getBlockNumber()
  return blockNumber
}

export const getBalanceSlot = (sender: string) => {
  return keccak256(concat([
    // Mappings' keys in Solidity must all be word-aligned (32 bytes)
    hexZeroPad(sender, 32),

    // Similarly with the slot-index into the Solidity variable layout
    hexZeroPad("0x00000000000000000000000000000000000000000000000000000000000000c9", 32),
  ]));
}

const getProvider = (chainId: number) => {
  switch (chainId) {
    case 5:
      return new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_API_KEY}`)
    case 420:
      return new ethers.providers.JsonRpcProvider(`https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_API_KEY}`)
    case 80001:
      return new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_TESTNET_API_KEY}`)
    case 421613:
      return new ethers.providers.JsonRpcProvider(`https://arb-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_API_KEY}`)
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

export const getExploerUrl = (chainId: number) => {
  switch (chainId) {
    case 5:
      return 'https://goerli.etherscan.io/tx/'
    case 420:
      return 'https://goerli-optimism.etherscan.io/tx/'
    case 80001:
      return 'https://mumbai.polygonscan.com/tx/'
    case 421613:
      return "https://goerli.arbiscan.io/tx/"
    default:
      return 'https://mumbai.polygonscan.com/tx/'
  }
}

export const setLocalStorege = (key: string, item: string) => {
  const w = typeof window !== 'undefined' ? window : null
  if (w) {
    if (w.localStorage) {
      w.localStorage.setItem(key, item)
    }
  }
}

export const getLocalStorege = (key: string) => {
  const w = typeof window !== 'undefined' ? window : null
  if (w) {
    if (w.localStorage) {
      const data = w.localStorage.getItem(key)
      return data
    }
  }
}

