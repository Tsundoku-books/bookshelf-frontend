import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, FlaskConical, ShoppingBag } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { PublicControls } from './PublicControls'
import { PublicFooter } from './PublicFooter'

const ITEMS = [
  { key: 'library', Icon: BookOpen },
  { key: 'store', Icon: ShoppingBag },
  { key: 'qa', Icon: FlaskConical },
] as const

export function AuthLayout({ testId, children }: { testId: string; children: ReactNode }) {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-hero text-on-hero" data-testid={testId}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-on-hero/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-on-hero/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="relative z-20 flex justify-end p-4">
        <PublicControls variant="onDark" />
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 pb-8 lg:grid-cols-2 lg:gap-16">
        <section
          aria-label={t('authLayout.panelLabel')}
          className="text-center lg:text-left"
          data-testid="auth-brand-panel"
        >
          <BrandLogo className="mx-auto h-10 w-auto lg:mx-0 lg:h-12" />
          <p className="mt-6 text-2xl font-bold lg:text-4xl" data-testid="auth-tagline">
            {t('authLayout.tagline')}
          </p>
          <p className="mt-3 text-sm text-on-hero/80 lg:text-base" data-testid="auth-name-meaning">
            {t('authLayout.nameMeaning')}
          </p>

          {/* Hidden below lg: on a phone the form has to stay in the first screen. */}
          <ul className="mt-8 hidden space-y-4 lg:block" data-testid="auth-brand-items">
            {ITEMS.map(({ key, Icon }) => (
              <li key={key} className="flex items-start gap-3" data-testid={`auth-brand-item-${key}`}>
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-on-hero/80" aria-hidden="true" />
                <span>{t(`authLayout.items.${key}`)}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/about"
            className="mt-8 hidden rounded-md font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-hero lg:inline-block"
            data-testid="auth-why-link"
          >
            {t('authLayout.whyLink')}
          </Link>
        </section>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md rounded-2xl border border-on-hero/20 bg-on-hero/10 p-8 shadow-2xl backdrop-blur-xl animate-fadeIn">
            {children}
          </div>
        </div>
      </main>

      <PublicFooter variant="onDark" showLogo />
    </div>
  )
}
