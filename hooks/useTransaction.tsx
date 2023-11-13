import { useEffect, useState } from 'react'
import { QueryData } from 'types'
import createSupabase from 'utils/supabase'

export const useTransaction = () => {
  const [transactions, setTransactions] = useState<QueryData[]>([])
  const [allTransactions, setAllTransactions] = useState<QueryData[]>([])
  const supabase = createSupabase()

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
          (payload) => {
            const data = payload.new as QueryData
            const transaction: QueryData = {
              transactionHash: data.transactionHash,
              executedHash: data.executedHash,
              id: data.id,
              status: data.status,
              sender: data.sender,
              from: data.from,
              packet: data.packet,
              createdAt: data.createdAt,
            }

            if (payload.eventType === 'INSERT') {
              setAllTransactions((prev) => [transaction, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              setAllTransactions((prev) => {
                const index = prev.findIndex((t) => t.id === transaction.id)
                if (index !== -1) {
                  prev[index] = transaction
                }
                return [...prev]
              })
            }
          },
        )
        .subscribe()
    }
  }

  const subscribeTransactionsBySender = async (sender: string) => {
    if (supabase) {
      supabase
        .channel('any')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'QueryData',
            filter: `sender=eq.${sender}`,
          },
          (payload) => {
            console.log('Update transactions')
            const data = payload.new as QueryData
            const transaction: QueryData = {
              transactionHash: data.transactionHash,
              executedHash: data.executedHash,
              id: data.id,
              status: data.status,
              sender: data.sender,
              from: data.from,
              packet: data.packet,
              createdAt: data.createdAt,
            }

            if (payload.eventType === 'INSERT') {
              setTransactions((prev) => [transaction, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              setTransactions((prev) => {
                const index = prev.findIndex((t) => t.id === transaction.id)
                if (index !== -1) {
                  prev[index] = transaction
                }
                return [...prev]
              })
            }
          },
        )
        .subscribe()
    }
  }

  const subscribeTransactionsByQueryId = async (queryId: string) => {
    if (supabase) {
      supabase
        .channel('any')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'QueryData',
            filter: `id=eq.${queryId}`,
          },
          (payload) => {
            const data = payload.new as QueryData
            const transaction: QueryData = {
              transactionHash: data.transactionHash,
              executedHash: data.executedHash,
              id: data.id,
              status: data.status,
              sender: data.sender,
              from: data.from,
              packet: data.packet,
              createdAt: data.createdAt,
            }

            if (payload.eventType === 'INSERT') {
              setTransactions((prev) => [transaction, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              setTransactions((prev) => {
                const index = prev.findIndex((t) => t.id === transaction.id)
                if (index !== -1) {
                  prev[index] = transaction
                }
                return [...prev]
              })
            }
          },
        )
        .subscribe()
    }
  }

  return {
    transactions,
    allTransactions,
    fetchAllTransactions,
    fetchTransactionsBySender,
    fetchTransactionsByQueryId,
    subscribeTransactions,
    subscribeTransactionsBySender,
    subscribeTransactionsByQueryId,
  }
}
