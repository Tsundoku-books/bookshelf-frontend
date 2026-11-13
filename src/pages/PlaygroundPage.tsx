import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bug, FlaskConical } from 'lucide-react'
import { AppHeader } from '../components/AppHeader'
import { Button } from '../components/ui/button'
import { usePlayground } from '../contexts/PlaygroundContext'
import { getApiErrorMessage } from '../lib/apiError'
import type { BugArea, BugId } from '../lib/playground'

export function PlaygroundPage() {
  const { t } = useTranslation()
  const { bugs, activeCount, setEnabled } = usePlayground()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async (ids: string[]) => {
    setError('')
    setSaving(true)
    try {
      await setEnabled(ids)
    } catch (err) {
      setError(getApiErrorMessage(err, 'playground.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const toggle = (id: string) => {
    const on = bugs.filter((bug) => bug.enabled).map((bug) => bug.id)
    return save(on.includes(id) ? on.filter((item) => item !== id) : [...on, id])
  }

  return (
    <div className="min-h-screen bg-background" data-testid="playground-page">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-heading">
          <FlaskConical className="h-6 w-6" aria-hidden="true" />
          {t('playground.title')}
        </h2>
        <p className="mb-4 text-text-muted">{t('playground.intro')}</p>
        <div
          role="note"
          className="mb-6 rounded-lg border border-info bg-info-subtle p-3 text-sm text-info"
          data-testid="playground-notice"
        >
          {t('playground.notice')}
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-danger bg-danger-subtle p-3 text-sm text-danger" data-testid="error-message">
            {error}
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-text-muted" data-testid="playground-active-count">
            {t('playground.activeCount', { count: activeCount })}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={saving || activeCount === 0}
            onClick={() => save([])}
            data-testid="playground-clear"
          >
            {t('playground.clear')}
          </Button>
        </div>

        <ul className="space-y-3" data-testid="playground-list">
          {bugs.map((bug) => (
            <li key={bug.id}>
              <label className="ts-card flex cursor-pointer items-start gap-3" data-testid={`bug-${bug.id}`}>
                <input
                  type="checkbox"
                  checked={bug.enabled}
                  disabled={saving}
                  onChange={() => toggle(bug.id)}
                  className="mt-1 h-4 w-4"
                  data-testid={`bug-toggle-${bug.id}`}
                />
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <Bug className="h-4 w-4 text-text-muted" aria-hidden="true" />
                    <span className="font-semibold text-text">{t(`playground.bugs.${bug.id as BugId}.title`)}</span>
                    <span className="ts-badge" data-testid={`bug-layer-${bug.id}`}>
                      {t(`playground.layers.${bug.layer}`)}
                    </span>
                    <span className="ts-badge">{t(`playground.areas.${bug.area as BugArea}`)}</span>
                  </span>
                  <span className="mt-1 block text-sm text-text-muted">{t(`playground.bugs.${bug.id as BugId}.hint`)}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        {bugs.length === 0 && (
          <p className="text-text-muted" data-testid="playground-empty">
            {t('playground.empty')}
          </p>
        )}
      </main>
    </div>
  )
}
