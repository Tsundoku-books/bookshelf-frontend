import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n'

type Variant = 'onLight' | 'onDark'

const LABEL_KEYS: Record<SupportedLanguage, 'language.ptBR' | 'language.en'> = {
  'pt-BR': 'language.ptBR',
  en: 'language.en',
}

const VARIANT_STYLES: Record<Variant, { group: string; active: string; inactive: string }> = {
  onLight: {
    group: 'border-border bg-background',
    active: 'bg-surface text-heading shadow-sm',
    inactive: 'text-text-muted hover:text-text',
  },
  onDark: {
    group: 'border-on-primary/30 bg-on-primary/10',
    active: 'bg-surface text-heading shadow-sm',
    inactive: 'text-on-primary/70 hover:text-on-primary',
  },
}

export function LanguageSwitcher({ variant = 'onLight' }: { variant?: Variant }) {
  const { i18n, t } = useTranslation()
  const styles = VARIANT_STYLES[variant]
  // `resolvedLanguage` already maps values like "en-US" to a supported language.
  const resolved = i18n.resolvedLanguage ?? ''
  const current: SupportedLanguage = (SUPPORTED_LANGUAGES as readonly string[]).includes(resolved)
    ? (resolved as SupportedLanguage)
    : 'pt-BR'

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      data-testid="language-switcher"
      className={`inline-flex items-center gap-1 rounded-lg border p-1 ${styles.group}`}
    >
      {SUPPORTED_LANGUAGES.map((lng) => {
        const isActive = lng === current
        return (
          <button
            key={lng}
            type="button"
            onClick={() => i18n.changeLanguage(lng)}
            aria-pressed={isActive}
            data-testid={lng === 'pt-BR' ? 'lang-pt' : 'lang-en'}
            className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
              isActive ? styles.active : styles.inactive
            }`}
          >
            {t(LABEL_KEYS[lng])}
          </button>
        )
      })}
    </div>
  )
}
