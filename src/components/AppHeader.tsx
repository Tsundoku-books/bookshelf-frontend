import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoOnLight from '../../design-system/assets/logo/logo-horizontal-on-light.svg'
import logoOnDark from '../../design-system/assets/logo/logo-horizontal-on-dark.svg'
import { Button } from './ui/button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSelect } from './ThemeSelect'
import { useAuth } from '../contexts/AuthContext'
import { useCartCount } from '../contexts/CartContext'
import { homePathFor } from '../lib/roles'

const NAV_LINK = 'text-sm font-medium text-text-muted hover:text-heading'

export function AppHeader() {
  const { t } = useTranslation()
  const { user, logout, hasRole, roles } = useAuth()
  const count = useCartCount()

  return (
    <header className="bg-surface border-b border-border shadow-sm" data-testid="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to={homePathFor(roles)} className="flex items-center space-x-3">
          <img src={logoOnLight} alt="Tsundoku" className="ts-only-light h-8" />
          <img src={logoOnDark} alt="" className="ts-only-dark h-8" />
          {user && <p className="text-xs text-text-muted">{user.name}</p>}
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-4 sm:flex" aria-label={t('nav.main')}>
            {hasRole('reader') && (
              <Link to="/dashboard" className={NAV_LINK} data-testid="nav-library">
                {t('nav.library')}
              </Link>
            )}
            {hasRole('buyer') && (
              <>
                <Link to="/store" className={NAV_LINK} data-testid="nav-store">
                  {t('nav.store')}
                </Link>
                <Link to="/cart" className={NAV_LINK} data-testid="nav-cart">
                  {t('nav.cart')}
                  {count > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-on-primary" data-testid="cart-count">
                      {count}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className={NAV_LINK} data-testid="nav-orders">
                  {t('nav.orders')}
                </Link>
              </>
            )}
            {hasRole('seller') && (
              <>
                <Link to="/sell" className={NAV_LINK} data-testid="nav-sell">
                  {t('nav.sell')}
                </Link>
                <Link to="/sales" className={NAV_LINK} data-testid="nav-sales">
                  {t('nav.sales')}
                </Link>
              </>
            )}
            <Link to="/account" className={NAV_LINK} data-testid="nav-account">
              {t('nav.account')}
            </Link>
          </nav>
          <ThemeSelect />
          <LanguageSwitcher />
          <Button variant="outline" size="sm" onClick={logout} className="hover:bg-background">
            {t('dashboard.logout')}
          </Button>
        </div>
      </div>
    </header>
  )
}
