import { useEffect, useState } from 'react'
import { SupabaseClient, createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined ? process.env.NEXT_PUBLIC_SUPABASE_URL : ''
const SUPABASE_API_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY !== undefined ? process.env.NEXT_PUBLIC_SUPABASE_API_KEY : ''

export const useSupabase = () => {
  // const signer = await fetchSigner()

  const [supabase, setSupabase] = useState<SupabaseClient>()

  useEffect(() => {
    const client = createSupabaseClient(SUPABASE_URL, SUPABASE_API_KEY)
    setSupabase(client)
  }, [])
  return supabase
}
