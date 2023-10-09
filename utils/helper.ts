import { Wallet, ethers } from "ethers"
import { ToastOptions, toast } from "react-toastify"
import { concat, hexZeroPad, keccak256 } from "ethers/lib/utils.js"
import { ERC20_ABI } from "./constants"
import { env } from "./constants"

export const getWallet = (chainId: number) => {
  const provider = getProvider(chainId)
  if (!provider) throw new Error("Invalid chainId")
  const wallet = new Wallet(env.PRIVATE_KEY, provider)
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

export const getProvider = (chainId: number) => {
  switch (chainId) {
    case 5:
      return new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${env.RPC_API_KEY_MAP["goerli"]}`)
    case 420:
      return new ethers.providers.JsonRpcProvider(`https://opt-goerli.g.alchemy.com/v2/${env.RPC_API_KEY_MAP["optimism-goerli"]}`)
    case 80001:
      return new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${env.RPC_API_KEY_MAP["mumbai"]}`)
    case 421613:
      return new ethers.providers.JsonRpcProvider(`https://arb-goerli.g.alchemy.com/v2/${env.RPC_API_KEY_MAP["arbitrum-goerli"]}`)
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

export const omitText = (text: string | undefined, start: number, end: number) => {
  if (!text) return ""
  if (text.length < start + end) return text
  return text.substring(0, start) + '...' + text.substring(text.length - end, text.length)
}

export const converUnixToDate = (time: number) => {
  const date = new Date(time * 1000);
  return date
}

export const getExploerUrl = (chainId: number) => {
  switch (chainId) {
    case 5:
      return 'https://goerli.etherscan.io/'
    case 420:
      return 'https://goerli-optimism.etherscan.io/'
    case 80001:
      return 'https://mumbai.polygonscan.com/'
    case 421613:
      return "https://goerli.arbiscan.io/"
    default:
      return 'https://mumbai.polygonscan.com/'
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

export const calculateTimeDifference = (craetedAt: Date) => {
  const now = new Date()
  const timeZoneOffset = now.getTimezoneOffset()
  const adjustedTime = new Date(now.getTime() + timeZoneOffset * 60 * 1000)
  const adjustedCreatedAt = new Date(craetedAt.getTime() + craetedAt.getTimezoneOffset() * 60 * 1000)
  const differenceInMilliseconds = Math.abs(adjustedTime.getTime() - adjustedCreatedAt.getTime())
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
  const differenceInMinutes = Math.floor(differenceInSeconds / 60)
  const differenceInHours = Math.floor(differenceInMinutes / 60)
  const differenceInDays = Math.floor(differenceInHours / 24)
  const differenceInYears = Math.floor(differenceInDays / 365)

  if (differenceInMinutes < 1) {
    return 'just now'
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes} mins ago`
  } else if (differenceInHours < 24) {
    const remainingMinutes = differenceInMinutes % 60
    return `${differenceInHours} hours ${remainingMinutes} mins ago`
  } else if (differenceInDays < 365) {
    const remainingHours = differenceInHours % 24
    return `${differenceInDays} days ${remainingHours} hours ago`
  } else {
    const remainingDays = differenceInDays % 365
    return `${differenceInYears} years ${remainingDays} days ago`
  }
}
