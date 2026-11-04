import { useTranslation } from 'react-i18next'
import { SELF_SERVICE_ROLES } from '../lib/roles'
import type { SelfServiceRole } from '../types/auth'

type Variant = 'onLight' | 'onDark'

interface RoleSelectorProps {
  value: SelfServiceRole[]
  onChange: (roles: SelfServiceRole[]) => void
  variant?: Variant
  disabled?: boolean
  testIdPrefix?: string
}

const STYLES: Record<Variant, { option: string; active: string; hint: string; label: string }> = {
  onLight: {
    option: 'border-border bg-surface hover:border-accent',
    active: 'border-primary bg-primary/5',
    hint: 'text-text-muted',
    label: 'text-text',
  },
  onDark: {
    option: 'border-on-primary/30 bg-on-primary/10 hover:border-on-primary/60',
    active: 'border-on-primary bg-on-primary/25',
    hint: 'text-on-primary/70',
    label: 'text-on-primary',
  },
}

/** Combinable choices: library, buying and selling. Choosing seller implies buying. */
export function RoleSelector({
  value,
  onChange,
  variant = 'onLight',
  disabled,
  testIdPrefix = 'role',
}: RoleSelectorProps) {
  const { t } = useTranslation()
  const styles = STYLES[variant]

  const toggle = (role: SelfServiceRole) => {
    onChange(value.includes(role) ? value.filter((item) => item !== role) : [...value, role])
  }

  return (
    <div className="space-y-2">
      {SELF_SERVICE_ROLES.map((role) => {
        const checked = value.includes(role)
        return (
          <label
            key={role}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
              checked ? styles.active : styles.option
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(role)}
              disabled={disabled}
              data-testid={`${testIdPrefix}-${role}`}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className={`block text-sm font-medium ${styles.label}`}>{t(`roles.${role}`)}</span>
              <span className={`block text-xs ${styles.hint}`}>{t(`roles.${role}Hint`)}</span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
