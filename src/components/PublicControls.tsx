import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSelect } from './ThemeSelect'
import type { SegmentedVariant } from './segmentedStyles'

const LINK_STYLES: Record<SegmentedVariant, string> = {
  onLight: 'text-primary hover:underline focus-visible:outline-primary',
  onDark: 'text-on-hero hover:underline focus-visible:outline-on-hero',
}

export function PublicControls({ variant = 'onLight' }: { variant?: SegmentedVariant }) {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('publicNav.label')}
      className="flex items-center gap-3"
      data-testid="public-controls"
    >
      <Link
        to="/about"
        className={`rounded-md px-1 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${LINK_STYLES[variant]}`}
        data-testid="about-link"
      >
        {t('publicNav.about')}
      </Link>
      <ThemeSelect variant={variant} />
      <LanguageSwitcher variant={variant} />
    </nav>
  )
}
