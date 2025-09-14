'use client'

import { ThemeProvider } from './ThemeProvider'

interface ClientThemeProviderProps {
  children: React.ReactNode
}

export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}