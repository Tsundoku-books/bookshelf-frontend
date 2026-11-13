import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, FlaskConical, ShoppingBag, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { PublicControls } from '../components/PublicControls'
import { PublicFooter } from '../components/PublicFooter'
import { useAuth } from '../contexts/AuthContext'
import { homePathFor } from '../lib/roles'

const SECTIONS = [
  { key: 'name', Icon: BookOpen },
  { key: 'what', Icon: BookOpen },
  { key: 'features', Icon: ShoppingBag },
  { key: 'qa', Icon: FlaskConical },
  { key: 'data', Icon: ShieldCheck },
] as const

const REPOSITORIES_URL = 'https://github.com/Tsundoku-books'

export function AboutPage() {
  const { t } = useTranslation()
  const { isAuthenticated, roles } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-surface" data-testid="about-page">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to={isAuthenticated ? homePathFor(roles) : '/login'}
            className="font-medium text-primary hover:underline"
            data-testid="about-back-link"
          >
            {isAuthenticated ? t('about.backToApp') : t('about.backToLogin')}
          </Link>
          <PublicControls />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-text" data-testid="about-title">
          {t('about.title')}
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-text-muted" data-testid="about-intro">
          {t('about.intro')}
        </p>

        <div className="space-y-8">
          {SECTIONS.map(({ key, Icon }) => (
            <section key={key} data-testid={`about-section-${key}`}>
              <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-text">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                {t(`about.sections.${key}.title`)}
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-text-muted">{t(`about.sections.${key}.body`)}</p>
            </section>
          ))}
        </div>

        <nav aria-label={t('about.linksLabel')} className="mt-10 flex flex-wrap gap-x-6 gap-y-2" data-testid="about-links">
          <Link to="/terms" className="font-semibold text-primary hover:underline" data-testid="about-terms-link">
            {t('about.termsLink')}
          </Link>
          <a
            href={REPOSITORIES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
            data-testid="about-github-link"
          >
            {t('about.githubLink')}
          </a>
        </nav>

        {!isAuthenticated && (
          <div className="mt-12 rounded-2xl bg-background p-6 text-center" data-testid="about-cta">
            <h2 className="mb-2 text-xl font-semibold text-text">{t('about.cta.title')}</h2>
            <p className="mb-4 text-text-muted">{t('about.cta.body')}</p>
            <Button asChild variant="cta" className="px-8 py-6 text-base font-semibold">
              <Link to="/register" data-testid="about-register-button">
                {t('about.cta.button')}
              </Link>
            </Button>
          </div>
        )}
      </div>
      <PublicFooter />
    </div>
  )
}
