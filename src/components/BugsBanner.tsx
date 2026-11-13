import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FlaskConical } from 'lucide-react'
import { usePlayground } from '../contexts/PlaygroundContext'

/** Shown while any playground bug is on, so nobody mistakes a planted bug for a real failure. */
export function BugsBanner() {
  const { t } = useTranslation()
  const { activeCount } = usePlayground()

  if (activeCount === 0) return null

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-warning bg-warning-subtle px-3 py-2 text-sm font-semibold text-warning"
      data-testid="bugs-banner"
    >
      <FlaskConical className="h-4 w-4" aria-hidden="true" />
      <span>{t('playground.banner', { count: activeCount })}</span>
      <Link to="/playground" className="underline" data-testid="bugs-banner-link">
        {t('playground.bannerLink')}
      </Link>
    </div>
  )
}
