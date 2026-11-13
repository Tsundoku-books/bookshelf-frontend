import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Mail, Lock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { ThemeSelect } from '../components/ThemeSelect'
import { RoleSelector } from '../components/RoleSelector'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../lib/apiError'
import type { SelfServiceRole } from '../types/auth'

export function RegisterPage() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Library only by default, which is what the account did before roles existed.
  const [roles, setRoles] = useState<SelfServiceRole[]>(['reader'])
  const [accepted, setAccepted] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (step === 1) {
      setStep(2)
      return
    }
    if (roles.length === 0) {
      setError(t('register.rolesRequired'))
      return
    }
    setLoading(true)

    try {
      await register(name, email, password, roles)
    } catch (err) {
      setError(getApiErrorMessage(err, 'register.genericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-hero p-4"
      data-testid="register-page"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-on-hero/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-on-hero/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <ThemeSelect variant="onDark" />
        <LanguageSwitcher variant="onDark" />
      </div>

      <div className="relative bg-on-hero/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full border border-on-hero/20 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-on-hero">{t('register.title')}</h1>
        </div>

        {error && (
          <div
            className="mb-4 p-3 bg-danger/20 border border-danger/50 rounded-lg text-on-hero text-sm text-center"
            data-testid="error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        <div
          role="note"
          className="mb-4 p-3 bg-warning/20 border border-warning/50 rounded-lg text-on-hero text-sm text-center"
          data-testid="register-test-notice"
        >
          {t('register.testNotice')}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Distinct keys: otherwise React reuses the Continuar button as Voltar and the browser submits the form on the same click. */}
          {step === 1 ? (
            <Fragment key="account">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-on-hero/90 mb-2">
                {t('register.fullName')}
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 z-10 w-5 h-5 text-on-hero/60 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="name-input"
                  aria-label={t('register.nameAriaLabel')}
                  className="w-full pl-11 pr-4 py-3 bg-on-hero/10 backdrop-blur-sm border border-on-hero/30 rounded-lg text-on-hero placeholder-on-hero/70 focus:ring-2 focus:ring-on-hero/50 focus:border-transparent transition-all"
                  placeholder={t('register.fullNamePlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-hero/90 mb-2">
                {t('common.email')}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 z-10 w-5 h-5 text-on-hero/60 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="email-input"
                  aria-label={t('register.emailAriaLabel')}
                  className="w-full pl-11 pr-4 py-3 bg-on-hero/10 backdrop-blur-sm border border-on-hero/30 rounded-lg text-on-hero placeholder-on-hero/70 focus:ring-2 focus:ring-on-hero/50 focus:border-transparent transition-all"
                  placeholder={t('common.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-on-hero/90 mb-2">
                {t('common.password')}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 z-10 w-5 h-5 text-on-hero/60 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="password-input"
                  aria-label={t('register.passwordAriaLabel')}
                  className="w-full pl-11 pr-4 py-3 bg-on-hero/10 backdrop-blur-sm border border-on-hero/30 rounded-lg text-on-hero placeholder-on-hero/70 focus:ring-2 focus:ring-on-hero/50 focus:border-transparent transition-all"
                  placeholder={t('common.passwordPlaceholder')}
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-on-hero/60 mt-1">{t('register.passwordHint')}</p>
            </div>


              <Button
                type="submit"
                variant="cta"
                className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                data-testid="register-next-button"
              >
                {t('register.next')}
              </Button>
            </Fragment>
          ) : (
            <Fragment key="usage">
            <fieldset className="space-y-2" data-testid="register-roles">
              <legend className="text-sm font-medium text-on-hero/90">{t('register.rolesTitle')}</legend>
              <p className="text-xs text-on-hero/60">{t('register.rolesHint')}</p>
              <RoleSelector
                value={roles}
                onChange={setRoles}
                variant="onDark"
                disabled={loading}
                testIdPrefix="register-role"
              />
            </fieldset>

            <label className="flex items-start gap-2 text-sm text-on-hero/90">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                data-testid="accept-terms-checkbox"
                className="mt-1"
                required
              />
              <span>
                {t('register.acceptPrefix')}{' '}
                <Link
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                  data-testid="terms-link"
                >
                  {t('register.acceptLink')}
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading || !accepted}
              variant="cta" className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              data-testid="register-button"
            >
              {loading ? t('register.submitting') : t('register.submit')}
            </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-full text-on-hero hover:bg-on-hero/10"
                data-testid="register-back-button"
              >
                {t('register.back')}
              </Button>
            </Fragment>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-on-hero/80 text-sm">
            {t('register.haveAccount')}{' '}
            <Link to="/login" className="text-on-hero font-semibold hover:underline transition-all">
              {t('register.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
