import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const usePageTheme = () => {
  const { theme } = useTheme()
  const [osTheme, setOSTheme] = useState('light' as 'light' | 'dark'),
    [pageTheme, setPageTheme] = useState('light' as 'light' | 'dark')
  const w = typeof window !== 'undefined' ? window : null

  useEffect(() => {
    if (!w) return
    if (w.matchMedia('(prefers-color-scheme: dark)').matches) {
      setOSTheme('dark')
    } else {
      setOSTheme('light')
    }
  }, [w])

  useEffect(() => {
    if (theme === 'light') {
      setPageTheme('light')
    } else {
      setPageTheme('dark')
    }
  }, [theme])

  return { osTheme, setOSTheme, pageTheme, setPageTheme }
}
