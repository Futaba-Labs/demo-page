import { env } from 'utils'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

const client: SupabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY)

const createSupabase = () => client

export default createSupabase
