import { useEffect, useState } from 'react'
import { QueryData } from 'types'
import { useSupabase } from './useSupabaseClient'

export const useTransaction = () => {
  const [transactions, setTransactions] = useState<QueryData[]>([])
  const [allTransactions, setAllTransactions] = useState<QueryData[]>([])
  const supabase = useSupabase()

  const fetchAllTransactions = async () => {
    if (supabase) {
      const { data } = await supabase.from('QueryData').select().order('createdAt', { ascending: false })
      const transactionData: QueryData[] = []
      if (data) {
        for (const d of data) {
          const transaction: QueryData = {
            transactionHash: d['transactionHash'],
            executedHash: d['executedHash'],
            id: d['id'],
            status: d['status'],
            sender: d['sender'],
            from: d['from'],
            packet: d['packet'],
            createdAt: d['createdAt'],
          }
          transactionData.push(transaction)
        }
        setAllTransactions(transactionData)
      }
    }
  }

  const fetchTransactionsBySender = async (sender: string) => {
    if (supabase) {
      const { data } = await supabase
        .from('QueryData')
        .select()
        .eq('sender', sender)
        .order('createdAt', { ascending: false })
      const transactionData: QueryData[] = []
      if (data) {
        for (const d of data) {
          const transaction: QueryData = {
            transactionHash: d['transactionHash'],
            executedHash: d['executedHash'],
            id: d['id'],
            status: d['status'],
            sender: d['sender'],
            from: d['from'],
            packet: d['packet'],
            createdAt: d['createdAt'],
          }
          transactionData.push(transaction)
        }
        setTransactions(transactionData)
      }
    }
  }

  const fetchTransactionsByQueryId = async (queryId: string) => {
    if (supabase) {
      const { data } = await supabase
        .from('QueryData')
        .select()
        .eq('id', queryId)
        .order('createdAt', { ascending: false })
      const transactionData: QueryData[] = []
      if (data) {
        for (const d of data) {
          const transaction: QueryData = {
            transactionHash: d['transactionHash'],
            executedHash: d['executedHash'],
            id: d['id'],
            status: d['status'],
            sender: d['sender'],
            from: d['from'],
            packet: d['packet'],
            createdAt: d['createdAt'],
          }
          transactionData.push(transaction)
        }
        setTransactions(transactionData)
      }
    }
  }

  const subscribeTransactions = async () => {
    if (supabase) {
      supabase
        .channel('any')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'QueryData',
          },
          fetchAllTransactions,
        )
        .subscribe()
    }
  }

  useEffect(() => {
    subscribeTransactions()
  }, [supabase])

  return { transactions, allTransactions, fetchAllTransactions, fetchTransactionsBySender, fetchTransactionsByQueryId }
}
