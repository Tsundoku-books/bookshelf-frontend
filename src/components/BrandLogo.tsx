import onForest from '../../design-system/assets/logo/logo-horizontal-on-forest.svg'
import onDark from '../../design-system/assets/logo/logo-horizontal-on-dark.svg'

/** The dark theme turns the hero into a near-black, so it needs the on-dark lockup: both are rendered and CSS picks one. */
export function BrandLogo({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <span className="inline-flex" data-testid="brand-logo">
      <img src={onForest} alt="Tsundoku" className={`brand-logo-light ${className}`} />
      <img src={onDark} alt="Tsundoku" className={`brand-logo-dark ${className}`} />
    </span>
  )
}
