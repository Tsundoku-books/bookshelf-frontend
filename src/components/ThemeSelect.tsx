import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { THEME_CHOICES, type ThemeChoice } from '../lib/theme'
import { SEGMENTED_STYLES, type SegmentedVariant } from './segmentedStyles'

const OPTIONS: Record<ThemeChoice, { labelKey: 'theme.system' | 'theme.light' | 'theme.dark'; Icon: LucideIcon }> = {
  system: { labelKey: 'theme.system', Icon: Monitor },
  light: { labelKey: 'theme.light', Icon: Sun },
  dark: { labelKey: 'theme.dark', Icon: Moon },
}

export function ThemeSelect({ variant = 'onLight' }: { variant?: SegmentedVariant }) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const styles = SEGMENTED_STYLES[variant]

  return (
    <div
      role="group"
      aria-label={t('theme.label')}
      data-testid="theme-select"
      className={`inline-flex items-center gap-1 rounded-lg border p-1 ${styles.group}`}
    >
      {THEME_CHOICES.map((choice) => {
        const { labelKey, Icon } = OPTIONS[choice]
        const isActive = choice === theme
        return (
          <button
            key={choice}
            type="button"
            onClick={() => setTheme(choice)}
            aria-pressed={isActive}
            aria-label={t(labelKey)}
            title={t(labelKey)}
            data-testid={`theme-${choice}`}
            className={`rounded-md p-1.5 transition-colors ${isActive ? styles.active : styles.inactive}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
