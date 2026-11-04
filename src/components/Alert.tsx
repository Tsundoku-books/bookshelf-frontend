import type { ReactNode } from 'react'
import { AlertTriangle, XCircle } from 'lucide-react'

const TONES = {
  danger: { className: 'ts-alert--danger', Icon: XCircle },
  warning: { className: 'ts-alert--warning', Icon: AlertTriangle },
}

interface AlertProps {
  tone: keyof typeof TONES
  role?: 'alert' | 'status'
  testId?: string
  className?: string
  children: ReactNode
}

export function Alert({ tone, role, testId, className = '', children }: AlertProps) {
  const { className: toneClass, Icon } = TONES[tone]

  return (
    <div className={`ts-alert ${toneClass} ${className}`.trim()} role={role} data-testid={testId}>
      <Icon className="ts-alert__icon" aria-hidden="true" />
      <p>{children}</p>
    </div>
  )
}
