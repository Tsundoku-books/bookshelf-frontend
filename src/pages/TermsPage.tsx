import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { ThemeSelect } from '../components/ThemeSelect'

const SECTIONS = [
  'purpose',
  'noRealData',
  'account',
  'dataReset',
  'marketplace',
  'privacy',
  'rights',
  'liability',
  'changes',
] as const

export function TermsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background" data-testid="terms-page">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/register" className="text-primary font-medium hover:underline" data-testid="terms-back-link">
            {t('terms.back')}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSelect />
            <LanguageSwitcher />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text mb-2">{t('terms.title')}</h1>
        <p className="text-text-muted mb-4">{t('terms.updated')}</p>
        <div
          role="note"
          className="mb-8 rounded-lg border-2 border-dashed border-warning bg-warning-subtle px-3 py-2 text-sm font-bold text-warning"
          data-testid="terms-notice"
        >
          {t('terms.notice')}
        </div>

        <div className="space-y-6">
          {SECTIONS.map((key) => (
            <section key={key} data-testid={`terms-section-${key}`}>
              <h2 className="text-xl font-semibold text-text mb-2">{t(`terms.sections.${key}.title`)}</h2>
              <p className="text-text-muted leading-relaxed">{t(`terms.sections.${key}.body`)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
