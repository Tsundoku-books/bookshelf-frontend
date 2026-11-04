import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { THEME_CHOICES, type ThemeChoice } from '../lib/theme'

const LABEL_KEYS: Record<ThemeChoice, 'theme.system' | 'theme.light' | 'theme.dark'> = {
  system: 'theme.system',
  light: 'theme.light',
  dark: 'theme.dark',
}

export function ThemeSelect() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <span className="ts-select">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeChoice)}
        aria-label={t('theme.label')}
        data-testid="theme-select"
        className="h-9 min-h-0 text-sm"
      >
        {THEME_CHOICES.map((choice) => (
          <option key={choice} value={choice}>
            {t(LABEL_KEYS[choice])}
          </option>
        ))}
      </select>
    </span>
  )
}
