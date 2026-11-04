import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { AppHeader } from '../components/AppHeader'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { PaymentPanel } from '../components/PaymentPanel'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../lib/apiError'
import { formatBRL } from '../lib/money'
import { marketplaceService } from '../services/marketplace.service'
import type { Order } from '../types/marketplace'

interface Loaded {
  id: string
  order: Order | null
  error: string
}

export function OrderPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const { user } = useAuth()

  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [tracking, setTracking] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let cancelled = false
    marketplaceService
      .getOrder(id)
      .then((order) => {
        if (!cancelled) setLoaded({ id, order, error: '' })
      })
      .catch((err) => {
        if (!cancelled) setLoaded({ id, order: null, error: getApiErrorMessage(err, 'order.notFound') })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const order = loaded?.id === id ? loaded.order : null
  const isSeller = !!order && order.seller.id === user?.id
  const isBuyer = !!order && order.buyer.id === user?.id

  const act = async (action: () => Promise<Order>) => {
    setBusy(true)
    setActionError('')
    try {
      setLoaded({ id, order: await action(), error: '' })
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'order.actionError'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background" data-testid="order-page">
      <AppHeader />

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {loaded?.error && (
          <p className="text-sm text-danger" role="alert" data-testid="order-error">
            {loaded.error}
          </p>
        )}

        {order && (
          <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-heading">{t('order.title', { id: order.id.slice(0, 8) })}</h2>
              <OrderStatusBadge status={order.status} testId="order-status" />
            </div>

            <section className="ts-card space-y-3 p-4">
              <h3 className="font-semibold text-heading">{t('order.items')}</h3>
              <ul className="divide-y divide-border" data-testid="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 py-2 text-sm">
                    <span>
                      {item.quantity}× {item.title}
                    </span>
                    <span>{formatBRL(item.unitPriceCents * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>{t('order.subtotal')}</dt>
                  <dd>{formatBRL(order.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t('order.shipping')}</dt>
                  <dd>{order.shippingCents === 0 ? t('cart.free') : formatBRL(order.shippingCents)}</dd>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <dt>{t('order.total')}</dt>
                  <dd data-testid="order-total">{formatBRL(order.totalCents)}</dd>
                </div>
              </dl>
            </section>

            <section className="ts-card space-y-1 p-4 text-sm">
              <p>
                {t('order.seller')}: {order.seller.name}
              </p>
              <p>
                {t('order.buyer')}: {order.buyer.name}
              </p>
              {order.shippingMethod === 'pickup' ? (
                <p>{t('order.pickupNote')}</p>
              ) : (
                order.shippingAddress && (
                  <p data-testid="order-address">
                    {t('order.shippingTo')}: {order.shippingAddress.recipient}, {order.shippingAddress.street},{' '}
                    {order.shippingAddress.number} — {order.shippingAddress.city}/{order.shippingAddress.state}
                  </p>
                )
              )}
              {order.trackingCode && (
                <p data-testid="order-tracking">{t('order.tracking', { code: order.trackingCode })}</p>
              )}
              {order.cancelReason && (
                <p className="text-text-muted" data-testid="order-cancel-reason">
                  {t(order.cancelReason === 'buyer' ? 'order.cancelReasonBuyer' : 'order.cancelReasonExpired')}
                </p>
              )}
              {order.payment?.status === 'paid' && (
                <p className="text-success" data-testid="order-paid-note">
                  {t('payment.approved')}
                  {order.payment.card ? ` — ${t('payment.cardInfo', { brand: order.payment.card.brand ?? '', last4: order.payment.card.last4 })}` : ' — Pix'}
                </p>
              )}
            </section>

            {isBuyer && order.status === 'awaiting_payment' && (
              <>
                <PaymentPanel order={order} onChange={(next) => setLoaded({ id, order: next, error: '' })} />
                <Button variant="outline" size="sm" onClick={() => act(() => marketplaceService.cancel(order.id))} disabled={busy} data-testid="cancel-order-button">
                  {t('order.cancel')}
                </Button>
              </>
            )}

            {isSeller && order.status === 'paid' && order.shippingMethod === 'ship' && (
              <form
                className="ts-card flex flex-col gap-2 p-4 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  act(() => marketplaceService.ship(order.id, tracking.trim()))
                }}
              >
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder={t('order.trackingLabel')}
                  aria-label={t('order.trackingLabel')}
                  className="ts-input flex-1"
                  data-testid="tracking-input"
                />
                <Button type="submit" size="sm" disabled={busy || tracking.trim().length < 3} data-testid="ship-button">
                  {t('order.ship')}
                </Button>
              </form>
            )}

            {isSeller && order.status === 'paid' && order.shippingMethod === 'pickup' && (
              <Button size="sm" onClick={() => act(() => marketplaceService.deliver(order.id))} disabled={busy} data-testid="handover-button">
                {t('order.handOver')}
              </Button>
            )}

            {isBuyer && order.status === 'shipped' && (
              <Button size="sm" onClick={() => act(() => marketplaceService.deliver(order.id))} disabled={busy} data-testid="confirm-delivery-button">
                {t('order.confirmDelivery')}
              </Button>
            )}

            {actionError && (
              <p className="text-sm text-danger" role="alert" data-testid="order-action-error">
                {actionError}
              </p>
            )}
          </>
        )}

        <Link to={isSeller ? '/sales' : '/orders'} className="text-sm font-medium text-heading hover:underline">
          {t('order.back')}
        </Link>
      </main>
    </div>
  )
}
