import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { AuthLayout } from '../components/AuthLayout'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../lib/apiError'

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(getApiErrorMessage(err, 'login.genericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout testId="login-page">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-on-hero mb-2">{t('common.appName')}</h1>
          <p className="text-on-hero/80 text-sm">{t('login.subtitle')}</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
                aria-label={t('login.emailAriaLabel')}
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
                aria-label={t('login.passwordAriaLabel')}
                className="w-full pl-11 pr-4 py-3 bg-on-hero/10 backdrop-blur-sm border border-on-hero/30 rounded-lg text-on-hero placeholder-on-hero/70 focus:ring-2 focus:ring-on-hero/50 focus:border-transparent transition-all"
                placeholder={t('common.passwordPlaceholder')}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="cta" className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            data-testid="login-button"
          >
            {loading ? t('login.submitting') : t('login.submit')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-on-hero/80 text-sm">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-on-hero font-semibold hover:underline transition-all">
              {t('login.signUp')}
            </Link>
          </p>
        </div>
    </AuthLayout>
  )
}
