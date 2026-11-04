import { useState } from 'react'
import { applyTheme, getStoredTheme, storeTheme, type ThemeChoice } from '../lib/theme'

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeChoice>(getStoredTheme)

  const setTheme = (choice: ThemeChoice) => {
    applyTheme(choice)
    storeTheme(choice)
    setThemeState(choice)
  }

  return { theme, setTheme }
}
