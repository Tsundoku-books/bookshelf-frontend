import { useTranslation } from 'react-i18next'
import type { OrderStatus } from '../types/marketplace'

const COLORS: Record<OrderStatus, string> = {
  awaiting_payment: 'ts-badge--warning',
  paid: 'ts-badge--info',
  shipped: 'border-primary bg-primary/10 text-heading',
  delivered: 'ts-badge--success',
  cancelled: 'ts-badge--danger',
}

export function OrderStatusBadge({ status, testId }: { status: OrderStatus; testId?: string }) {
  const { t } = useTranslation()

  return (
    <span className={`ts-badge ${COLORS[status]}`} data-testid={testId}>
      {t(`orderStatus.${status}`)}
    </span>
  )
}
