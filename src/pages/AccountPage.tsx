import { Alert } from '../components/Alert'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookMarked, Building2, ShieldCheck, Store, Users } from 'lucide-react'
import { Button } from '../components/ui/button'
import { AppHeader } from '../components/AppHeader'
import { RoleSelector } from '../components/RoleSelector'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../lib/apiError'
import { formatCnpj, SELF_SERVICE_ROLES } from '../lib/roles'
import { meService } from '../services/me.service'
import type { SelfServiceRole } from '../types/auth'
import type { Company } from '../types/company'

export function AccountPage() {
  const { t } = useTranslation()
  const { user, roles, hasRole, applySession } = useAuth()

  const savedRoles = roles.filter((role): role is SelfServiceRole =>
    (SELF_SERVICE_ROLES as string[]).includes(role),
  )
  const [selected, setSelected] = useState<SelfServiceRole[]>(savedRoles)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [name, setName] = useState(user?.name ?? '')
  const [nameStatus, setNameStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [nameError, setNameError] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    let cancelled = false
    meService
      .getProfile()
      .then((profile) => {
        if (!cancelled) setCompanies(profile.companies)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getApiErrorMessage(err, 'account.loadError'))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const add = selected.filter((role) => !savedRoles.includes(role))
  const remove = savedRoles.filter((role) => !selected.includes(role))
  const changed = add.length + remove.length > 0

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setSaveError('')
    try {
      const response = await meService.updateRoles({ add, remove })
      applySession(response)
      setSelected(response.user.roles.filter((r): r is SelfServiceRole => r !== 'admin'))
      setSaved(true)
    } catch (err) {
      setSaveError(getApiErrorMessage(err, 'account.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameStatus('saving')
    setNameError('')
    try {
      const response = await meService.updateProfile(name)
      applySession(response)
      setNameStatus('saved')
    } catch (err) {
      setNameError(getApiErrorMessage(err, 'profile.nameError'))
      setNameStatus('error')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordStatus('saving')
    setPasswordError('')
    try {
      await meService.changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setPasswordStatus('saved')
    } catch (err) {
      setPasswordError(getApiErrorMessage(err, 'profile.passwordError'))
      setPasswordStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-background" data-testid="account-page">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-heading mb-1">{t('account.title')}</h2>
          <p className="text-text-muted">{t('account.subtitle')}</p>
        </div>

        {!hasRole('reader') && (
          <Alert tone="warning" testId="library-off-notice">
            {t('account.libraryOff')}
          </Alert>
        )}

        <section className="ts-card p-6 space-y-6" aria-labelledby="profile-title">
          <div>
            <h3 id="profile-title" className="text-xl font-bold text-heading mb-4">
              {t('profile.title')}
            </h3>
            <form onSubmit={handleSaveName} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="profile-name" className="block text-sm font-medium text-text mb-1">
                  {t('profile.name')}
                </label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setNameStatus('idle')
                  }}
                  className="ts-input"
                  data-testid="profile-name-input"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={nameStatus === 'saving' || name.trim() === '' || name === user?.name}
                data-testid="profile-name-save"
              >
                {t('profile.saveName')}
              </Button>
            </form>
            {nameStatus === 'saved' && (
              <p className="mt-2 text-sm text-success" role="status" data-testid="profile-name-saved">
                {t('profile.nameSaved')}
              </p>
            )}
            {nameError && (
              <p className="mt-2 text-sm text-danger" role="alert" data-testid="profile-name-error">
                {nameError}
              </p>
            )}
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 border-t border-border pt-6">
            <h4 className="text-lg font-semibold text-text">{t('profile.passwordTitle')}</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-current-password" className="block text-sm font-medium text-text mb-1">
                  {t('profile.currentPassword')}
                </label>
                <input
                  id="profile-current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="ts-input"
                  data-testid="profile-current-password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <div>
                <label htmlFor="profile-new-password" className="block text-sm font-medium text-text mb-1">
                  {t('profile.newPassword')}
                </label>
                <input
                  id="profile-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="ts-input"
                  data-testid="profile-new-password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <p className="mt-1 text-xs text-text-muted">{t('profile.passwordHint')}</p>
              </div>
            </div>
            {passwordStatus === 'saved' && (
              <p className="text-sm text-success" role="status" data-testid="profile-password-saved">
                {t('profile.passwordSaved')}
              </p>
            )}
            {passwordError && (
              <p className="text-sm text-danger" role="alert" data-testid="profile-password-error">
                {passwordError}
              </p>
            )}
            <Button
              type="submit"
              variant="outline"
              disabled={passwordStatus === 'saving'}
              data-testid="profile-password-save"
            >
              {t('profile.savePassword')}
            </Button>
          </form>
        </section>

        <section className="ts-card p-6" aria-labelledby="roles-title">
          <h3 id="roles-title" className="text-xl font-bold text-heading mb-4">
            {t('account.rolesTitle')}
          </h3>
          <RoleSelector value={selected} onChange={setSelected} disabled={saving} testIdPrefix="account-role" />

          {saveError && (
            <p className="mt-3 text-sm text-danger" role="alert" data-testid="account-error">
              {saveError}
            </p>
          )}
          {saved && (
            <p className="mt-3 text-sm text-success" role="status" data-testid="account-saved">
              {t('account.saved')}
            </p>
          )}

          <Button
            className="mt-4"
            onClick={handleSave}
            disabled={saving || !changed || selected.length === 0}
            data-testid="save-roles-button"
          >
            {saving ? t('account.saving') : t('account.save')}
          </Button>
        </section>

        <section className="ts-card p-6" aria-labelledby="companies-title">
          <div className="flex items-center justify-between mb-4">
            <h3 id="companies-title" className="text-xl font-bold text-heading">
              {t('account.companiesTitle')}
            </h3>
            {hasRole('seller') && (
              <Link
                to="/companies/new"
                className="inline-flex items-center gap-2 text-sm font-medium text-heading hover:text-heading/80"
                data-testid="add-company-link"
              >
                <Building2 className="w-4 h-4" aria-hidden="true" />
                {t('account.addCompany')}
              </Link>
            )}
          </div>

          {loadError && (
            <p className="text-sm text-danger" role="alert">
              {loadError}
            </p>
          )}

          {!hasRole('seller') ? (
            <p className="text-sm text-text-muted" data-testid="companies-seller-only">
              {t('account.companiesSellerOnly')}
            </p>
          ) : companies.length === 0 ? (
            <p className="text-sm text-text-muted" data-testid="companies-empty">
              {t('account.companiesEmpty')}
            </p>
          ) : (
            <ul className="space-y-3" data-testid="companies-list">
              {companies.map((company) => (
                <li
                  key={company.id}
                  className="rounded-lg border border-border p-4"
                  data-testid={`company-${company.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">{company.tradeName || company.legalName}</p>
                      <p className="text-sm text-text-muted">
                        {formatCnpj(company.cnpj)} · {company.address.city}/{company.address.state}
                      </p>
                      {company.myRole && (
                        <p className="text-xs text-text-muted">
                          {t('account.memberRole', { role: t(`companyRoles.${company.myRole}`) })}
                        </p>
                      )}
                    </div>
                    <span
                      className={`ts-badge ${company.verified ? 'ts-badge--success' : 'ts-badge--warning'}`}
                      data-testid={`company-status-${company.id}`}
                    >
                      {company.verified ? t('account.verified') : t('account.pending')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {hasRole('admin') && (
          <section className="ts-card p-6" aria-labelledby="admin-title">
            <h3 id="admin-title" className="text-xl font-bold text-heading mb-4">
              {t('account.adminTitle')}
            </h3>
            <Link
              to="/admin/catalog"
              className="mr-6 inline-flex items-center gap-2 text-sm font-medium text-heading hover:text-heading/80"
              data-testid="admin-catalog-link"
            >
              <BookMarked className="w-4 h-4" aria-hidden="true" />
              {t('account.adminCatalog')}
            </Link>
            <Link
              to="/admin/marketplace"
              className="mr-6 inline-flex items-center gap-2 text-sm font-medium text-heading hover:text-heading/80"
              data-testid="admin-marketplace-link"
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              {t('account.adminMarket')}
            </Link>
            <Link
              to="/admin/users"
              className="mr-6 inline-flex items-center gap-2 text-sm font-medium text-heading hover:text-heading/80"
              data-testid="admin-users-link"
            >
              <Users className="w-4 h-4" aria-hidden="true" />
              {t('account.adminUsers')}
            </Link>
            <Link
              to="/admin/companies"
              className="inline-flex items-center gap-2 text-sm font-medium text-heading hover:text-heading/80"
              data-testid="admin-companies-link"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              {t('account.adminCompanies')}
            </Link>
          </section>
        )}
      </main>
    </div>
  )
}
