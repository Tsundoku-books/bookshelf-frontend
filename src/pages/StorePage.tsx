import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { AppHeader } from '../components/AppHeader'
import { BookCover } from '../components/BookCover'
import { Pagination } from '../components/Pagination'
import { useCart } from '../contexts/CartContext'
import { getApiErrorMessage } from '../lib/apiError'
import { formatBRL } from '../lib/money'
import { marketplaceService } from '../services/marketplace.service'
import { LISTING_CONDITIONS, type Listing, type ListingCondition, type ListingsQuery } from '../types/marketplace'
import type { Paginated } from '../types/catalog'

const PAGE_SIZE = 12
const FIELD =
  'ts-input w-auto'

interface Loaded {
  key: string
  listings: Listing[]
  pagination: Paginated | null
  error: string
}

export function StorePage() {
  const { t } = useTranslation()
  const cart = useCart()

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [condition, setCondition] = useState<ListingCondition | ''>('')
  const [sort, setSort] = useState<NonNullable<ListingsQuery['sort']>>('newest')
  const [page, setPage] = useState(1)
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  const appliedSearch = useRef('')
  useEffect(() => {
    const id = setTimeout(() => {
      const next = searchInput.trim()
      if (next === appliedSearch.current) return
      appliedSearch.current = next
      setSearch(next)
      setPage(1)
    }, 300)
    return () => clearTimeout(id)
  }, [searchInput])

  const key = JSON.stringify({ search, condition, sort, page })
  useEffect(() => {
    let cancelled = false
    marketplaceService
      .browse({ search: search || undefined, condition: condition || undefined, sort, page, limit: PAGE_SIZE })
      .then((data) => {
        if (!cancelled) setLoaded({ key, listings: data.listings, pagination: data.pagination, error: '' })
      })
      .catch((err) => {
        if (!cancelled) setLoaded({ key, listings: [], pagination: null, error: getApiErrorMessage(err, 'store.loadError') })
      })
    return () => {
      cancelled = true
    }
  }, [key, search, condition, sort, page])

  const loading = loaded?.key !== key
  const listings = loaded?.listings ?? []

  return (
    <div className="min-h-screen bg-background" data-testid="store-page">
      <AppHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h2 className="mb-1 text-3xl font-bold text-heading">{t('store.title')}</h2>
          <p className="text-text-muted">{t('store.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1" role="search">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('store.searchPlaceholder')}
              aria-label={t('store.searchPlaceholder')}
              className={`${FIELD} w-full pl-9`}
              data-testid="store-search"
            />
          </div>
          <span className="ts-select"><select
            value={condition}
            onChange={(e) => {
              setCondition(e.target.value as ListingCondition | '')
              setPage(1)
            }}
            aria-label={t('sell.condition')}
            className={FIELD}
            data-testid="store-condition"
          >
            <option value="">{t('store.allConditions')}</option>
            {LISTING_CONDITIONS.map((value) => (
              <option key={value} value={value}>
                {t(`listingCondition.${value}`)}
              </option>
            ))}
          </select></span>
          <span className="ts-select"><select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as NonNullable<ListingsQuery['sort']>)
              setPage(1)
            }}
            aria-label={t('store.sortNewest')}
            className={FIELD}
            data-testid="store-sort"
          >
            <option value="newest">{t('store.sortNewest')}</option>
            <option value="price_asc">{t('store.sortPriceAsc')}</option>
            <option value="price_desc">{t('store.sortPriceDesc')}</option>
          </select></span>
        </div>

        {loaded?.error && (
          <p className="text-sm text-danger" role="alert" data-testid="store-error">
            {loaded.error}
          </p>
        )}

        {!loading && !loaded?.error && listings.length === 0 && (
          <p className="text-text-muted" data-testid="store-empty">
            {t('store.empty')}
          </p>
        )}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="store-list">
          {listings.map((listing) => {
            const inCart = cart.lines.find((line) => line.listing.id === listing.id)?.quantity ?? 0
            return (
              <li
                key={listing.id}
                className="ts-card flex flex-col gap-3 p-4"
                data-testid={`listing-card-${listing.id}`}
              >
                <div className="flex gap-3">
                  {listing.book.coverUrl && (
                    <BookCover url={listing.book.coverUrl} alt={listing.book.title} testId={`listing-cover-${listing.id}`} />
                  )}
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-text">{listing.book.title}</p>
                    <p className="text-sm text-text-muted">{listing.book.author}</p>
                    <p className="text-xs text-text-muted">
                      {t(`listingCondition.${listing.condition}`)} · {t('store.stock', { count: listing.quantity })}
                    </p>
                    <p className="text-xs text-text-muted">
                      {t('store.soldBy', { seller: listing.seller.name })}
                      {listing.seller.company ? ` · ${t('store.company')}` : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xl font-bold text-text" data-testid={`listing-price-${listing.id}`}>
                      {formatBRL(listing.priceCents)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {t('store.shipping', { price: formatBRL(listing.shippingFeeCents) })}
                      {listing.pickupAvailable ? ` · ${t('store.pickup')}` : ''}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => cart.add(listing)}
                    disabled={inCart >= listing.quantity}
                    data-testid={`add-to-cart-${listing.id}`}
                  >
                    {t('store.addToCart')}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>

        <Pagination page={page} totalPages={loaded?.pagination?.totalPages ?? 1} onPageChange={setPage} />
      </main>
    </div>
  )
}
