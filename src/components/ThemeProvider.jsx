'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider defaultTheme="dark" themes={['dark', 'light', 'ancient']}>
      {children}
    </NextThemesProvider>
  );
}
