import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n'

import { SEGMENTED_STYLES, type SegmentedVariant } from './segmentedStyles'

const LABEL_KEYS: Record<SupportedLanguage, 'language.ptBR' | 'language.en'> = {
  'pt-BR': 'language.ptBR',
  en: 'language.en',
}

export function LanguageSwitcher({ variant = 'onLight' }: { variant?: SegmentedVariant }) {
  const { i18n, t } = useTranslation()
  const styles = SEGMENTED_STYLES[variant]
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
