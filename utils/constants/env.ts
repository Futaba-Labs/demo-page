export const env = {
  PRIVATE_KEY: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_API_KEY: process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "",
  RPC_API_KEY_MAP: {
    "mumbai": process.env.NEXT_PUBLIC_POLYGON_TESTNET_API_KEY || "",
    "goerli": process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_API_KEY || "",
    "optimism-goerli": process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_API_KEY || "",
    "arbitrum-goerli": process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_API_KEY || "",
  }
}
