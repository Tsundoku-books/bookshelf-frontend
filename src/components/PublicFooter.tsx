import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BrandLogo } from './BrandLogo'
import type { SegmentedVariant } from './segmentedStyles'

const STYLES: Record<SegmentedVariant, { text: string; link: string }> = {
  onLight: { text: 'text-text-muted', link: 'text-primary focus-visible:outline-primary' },
  onDark: { text: 'text-on-hero/80', link: 'text-on-hero focus-visible:outline-on-hero' },
}

export function PublicFooter({
  variant = 'onLight',
  showLogo = false,
}: {
  variant?: SegmentedVariant
  showLogo?: boolean
}) {
  const { t } = useTranslation()
  const styles = STYLES[variant]
  const linkClass = `rounded-md px-1 font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.link}`

  return (
    <footer
      className={`relative z-10 flex flex-col items-center gap-3 px-4 py-6 text-center text-sm ${styles.text}`}
      data-testid="public-footer"
    >
      {showLogo && <BrandLogo className="h-6 w-auto" />}
      <nav aria-label={t('footer.label')} className="flex items-center gap-4" data-testid="footer-links">
        <Link to="/about" className={linkClass} data-testid="footer-about-link">
          {t('footer.about')}
        </Link>
        <Link to="/terms" className={linkClass} data-testid="footer-terms-link">
          {t('footer.terms')}
        </Link>
      </nav>
      <p data-testid="footer-note">{t('footer.note')}</p>
    </footer>
  )
}
