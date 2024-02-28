export const env = {
  PRIVATE_KEY: process.env.NEXT_PUBLIC_PRIVATE_KEY || '',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_API_KEY: process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '',
  RPC_API_KEY: process.env.NEXT_PUBLIC_RPC_API_KEY || '',
  API_KEY_MAP: {
    "mumbai": process.env.NEXT_PUBLIC_MUMBAI_API_KEY || "",
    "goerli": process.env.NEXT_PUBLIC_GOERLI_API_KEY || "",
    "optimism-goerli": process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_API_KEY || "",
    "arbitrum-goerli": process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_API_KEY || "",
    "sepolia": process.env.NEXT_PUBLIC_SEPOLIA_API_KEY || "",
    "arbitrum-sepolia": process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_API_KEY || "",
    "optimism-sepolia": process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_API_KEY || "",
  },
}
