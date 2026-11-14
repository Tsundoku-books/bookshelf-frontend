import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoOnLight from "../../design-system/assets/logo/logo-horizontal-on-light.svg";
import logoOnDark from "../../design-system/assets/logo/logo-horizontal-on-dark.svg";
import { ChevronDown } from "lucide-react";
import { Avatar } from "./Avatar";
import { Menu, MENU_ITEM } from "./Menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSelect } from "./ThemeSelect";
import { BugsBanner } from "./BugsBanner";
import { useAuth } from "../contexts/AuthContext";
import { useCartCount } from "../contexts/CartContext";
import { homePathFor } from "../lib/roles";

const NAV_LINK = "text-sm font-medium text-text-muted hover:text-heading";

export function AppHeader() {
  const { t } = useTranslation();
  const { user, logout, hasRole, roles } = useAuth();
  const count = useCartCount();

  return (
    <>
      <header
        className="bg-surface border-b border-border shadow-sm"
        data-testid="app-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="m-0">
            <Link
              to={homePathFor(roles)}
              className="flex items-center space-x-3"
            >
              <img
                src={logoOnLight}
                alt="Tsundoku"
                className="ts-only-light h-8"
              />
              <img src={logoOnDark} alt="" className="ts-only-dark h-8" />
            </Link>
          </h1>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2" aria-label={t("nav.main")}>
              {hasRole("reader") && (
                <Link
                  to="/dashboard"
                  className={`${NAV_LINK} rounded-lg px-2 py-1.5 hover:bg-background`}
                  data-testid="nav-library"
                >
                  {t("nav.library")}
                </Link>
              )}
              {(hasRole("buyer") || hasRole("seller")) && (
                <Menu
                  label={t("nav.marketplace")}
                  testId="marketplace-menu"
                  trigger={
                    <>
                      {t("nav.marketplace")}
                      {count > 0 && (
                        <span className="rounded-full bg-primary px-1.5 text-xs text-on-primary" aria-hidden="true">
                          {count}
                        </span>
                      )}
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </>
                  }
                >
                  {hasRole("buyer") && (
                    <>
                      <Link to="/store" className={MENU_ITEM} data-testid="nav-store">
                        {t("nav.store")}
                      </Link>
                      <Link to="/cart" className={MENU_ITEM} data-testid="nav-cart">
                        {t("nav.cart")}
                        {count > 0 && (
                          <span
                            className="rounded-full bg-primary px-1.5 text-xs text-on-primary"
                            data-testid="cart-count"
                          >
                            {count}
                          </span>
                        )}
                      </Link>
                      <Link to="/orders" className={MENU_ITEM} data-testid="nav-orders">
                        {t("nav.orders")}
                      </Link>
                    </>
                  )}
                  {hasRole("seller") && (
                    <>
                      <Link to="/sell" className={MENU_ITEM} data-testid="nav-sell">
                        {t("nav.sell")}
                      </Link>
                      <Link to="/sales" className={MENU_ITEM} data-testid="nav-sales">
                        {t("nav.sales")}
                      </Link>
                    </>
                  )}
                </Menu>
              )}
            </nav>
            {user && (
              <Menu
                label={t("nav.userMenu", { name: user.name })}
                testId="user-menu"
                trigger={
                  <>
                    <Avatar name={user.name} />
                    <span className="hidden max-w-32 truncate sm:inline">{user.name}</span>
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </>
                }
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold text-heading">{user.name}</p>
                  <p className="truncate text-xs text-text-muted">{user.email}</p>
                </div>
                <Link to="/account" className={MENU_ITEM} data-testid="nav-account">
                  {t("nav.account")}
                </Link>
                <Link to="/playground" className={MENU_ITEM} data-testid="nav-playground">
                  {t("nav.playground")}
                </Link>
                <div className="flex flex-col gap-2 border-t border-border px-3 py-3" data-keep-open>
                  <ThemeSelect />
                  <LanguageSwitcher />
                </div>
                <button type="button" onClick={logout} className={MENU_ITEM} data-testid="logout-button">
                  {t("dashboard.logout")}
                </button>
              </Menu>
            )}
          </div>
        </div>
      </header>
      <BugsBanner />
    </>
  );
}
