'use client';

import { ThemeProvider } from './ThemeProvider';

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
