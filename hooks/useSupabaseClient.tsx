import { useEffect, useState } from 'react'
import { SupabaseClient, createClient as createSupabaseClient } from '@supabase/supabase-js'
import { env } from 'utils'

export const useSupabase = () => {
  // const signer = await fetchSigner()

  const [supabase, setSupabase] = useState<SupabaseClient>()

  useEffect(() => {
    const client = createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_API_KEY)
    setSupabase(client)
  }, [])
  return supabase
}
