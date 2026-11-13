import { Alert } from '../components/Alert'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, BookMarked, TrendingUp, BookOpenCheck, SearchX } from 'lucide-react'
import { Button } from '../components/ui/button'
import { AppHeader } from '../components/AppHeader'
import { BookModal } from '../components/BookModal'
import { BookCard } from '../components/BookCard'
import { BookFilters } from '../components/BookFilters'
import { Pagination } from '../components/Pagination'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { useBookLibrary } from '../hooks/useBookLibrary'
import { booksService } from '../services/books.service'
import { usePlayground } from '../contexts/PlaygroundContext'
import { getApiErrorMessage } from '../lib/apiError'
import { SORT_OPTIONS, type SortKey } from '../lib/bookOptions'
import type { Book, BookStatus } from '../types/book'

const PAGE_SIZE = 9
const SEARCH_DEBOUNCE_MS = 300

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isOn } = usePlayground()

  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [pendingNotice, setPendingNotice] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BookStatus | ''>('')
  const [rating, setRating] = useState<number | ''>('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)

  // Only a real change of the search text may reset the page; otherwise the debounce
  // timer that fires right after mount would undo a quick page change.
  const appliedSearch = useRef('')
  useEffect(() => {
    const id = setTimeout(() => {
      const next = searchInput.trim()
      if (next === appliedSearch.current) return
      appliedSearch.current = next
      setSearch(next)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [searchInput])

  const { books, pagination, stats, loading, initialLoading, error, reload, changeStatus } =
    useBookLibrary({
      page,
      limit: PAGE_SIZE,
      status: status || undefined,
      rating: rating || undefined,
      search: search || undefined,
      ...SORT_OPTIONS[sort],
    })

  const hasActiveFilters = searchInput !== '' || status !== '' || rating !== ''
  const libraryEmpty = (stats?.total ?? 0) === 0

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    appliedSearch.current = ''
    setStatus('')
    setRating('')
    setPage(1)
  }

  const handleAddBook = () => {
    setPendingNotice(false)
    setBookToEdit(null)
    setShowAddBookModal(true)
  }

  const handleEditBook = (book: Book) => {
    setBookToEdit(book)
    setShowAddBookModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return

    try {
      setDeleteLoading(true)
      setDeleteError('')
      await booksService.deleteBook(bookToDelete.id)
      // Deleting the last book of a page would leave it empty; step back.
      if (books.length === 1 && page > 1) setPage(page - 1)
      reload()
      setBookToDelete(null)
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'dashboard.deleteError'))
    } finally {
      setDeleteLoading(false)
    }
  }

  const visibleError = error || deleteError

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard-page">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-heading mb-2">
            {t('dashboard.greeting', { name: user?.name || t('dashboard.greetingFallbackName') })}
          </h2>
          <p className="text-text-muted">{t('dashboard.subtitle')}</p>
        </div>

        {visibleError && (
          <Alert tone="danger" role="alert" testId="dashboard-error" className="mb-6">
            {visibleError}
          </Alert>
        )}

        {pendingNotice && (
          <Alert tone="warning" role="status" testId="edit-pending-notice" className="mb-6">
            {t('pendingEdit.notice')}
          </Alert>
        )}

        {initialLoading ? (
          <div className="text-center py-12">
            <p className="text-text-muted">{t('dashboard.loading')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                className="ts-card p-6 hover:shadow-md transition-all border border-border group cursor-pointer"
                data-testid="stats-total"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-muted text-sm font-medium">{t('dashboard.stats.totalLabel')}</p>
                  <div className="p-2 bg-background rounded-lg group-hover:bg-primary/5 transition-colors">
                    <BookOpen className="w-5 h-5 text-text-muted group-hover:text-heading transition-colors" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{stats?.total || 0}</p>
                <p className="text-xs text-text-muted">{t('dashboard.stats.totalCaption')}</p>
              </div>

              <div
                className="ts-card p-6 hover:shadow-md transition-all group cursor-pointer"
                data-testid="stats-to-read"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-muted text-sm font-medium">{t('dashboard.stats.toReadLabel')}</p>
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <BookMarked className="w-5 h-5 text-heading group-hover:text-heading/80 transition-colors" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{stats?.byStatus.toRead || 0}</p>
                <p className="text-xs text-text-muted">{t('dashboard.stats.toReadCaption')}</p>
              </div>

              <div
                className="ts-card p-6 hover:shadow-md transition-all group cursor-pointer"
                data-testid="stats-reading"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-muted text-sm font-medium">{t('dashboard.stats.readingLabel')}</p>
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <BookOpenCheck className="w-5 h-5 text-heading group-hover:text-heading/80 transition-colors" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{stats?.byStatus.reading || 0}</p>
                <p className="text-xs text-text-muted">{t('dashboard.stats.readingCaption')}</p>
              </div>

              <div
                className="ts-card p-6 hover:shadow-md transition-all group cursor-pointer"
                data-testid="stats-read"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-muted text-sm font-medium">{t('dashboard.stats.readLabel')}</p>
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-5 h-5 text-heading group-hover:text-heading/80 transition-colors" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{stats?.byStatus.read || 0}</p>
                <p className="text-xs text-text-muted">{t('dashboard.stats.readCaption')}</p>
              </div>
            </div>

            <div className="bg-hero border border-on-hero/15 p-8 rounded-2xl shadow-xl text-on-hero mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">
                    {libraryEmpty ? t('dashboard.cta.titleEmpty') : t('dashboard.cta.titleMore')}
                  </h3>
                  <p className="text-on-hero/90 mb-4">
                    {libraryEmpty
                      ? t('dashboard.cta.subtitleEmpty')
                      : t('dashboard.cta.subtitleMore')}
                  </p>
                  <Button
                    onClick={handleAddBook}
                    variant="cta" className="shadow-lg"
                    data-testid="add-book-button"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {libraryEmpty
                      ? t('dashboard.cta.buttonEmpty')
                      : t('dashboard.cta.buttonMore')}
                  </Button>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-on-hero/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-16 h-16 text-on-hero" />
                  </div>
                </div>
              </div>
            </div>

            {libraryEmpty ? (
              <div className="ts-card p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-text-muted" />
                  </div>
                  <h3 className="text-xl font-semibold text-heading mb-2">{t('dashboard.empty.title')}</h3>
                  <p className="text-text-muted mb-6">{t('dashboard.empty.description')}</p>
                </div>
              </div>
            ) : (
              <div className="ts-card p-6">
                <h3 className="text-xl font-bold text-heading mb-4" data-testid="book-list-heading">{isOn('ui-dashboard-title-typo') ? t('playground.typo.dashboardHeading') : t('dashboard.bookList.heading')}</h3>

                <BookFilters
                  search={searchInput}
                  status={status}
                  rating={rating}
                  sort={sort}
                  hasActiveFilters={hasActiveFilters}
                  onSearchChange={setSearchInput}
                  onStatusChange={(value) => {
                    setStatus(value)
                    setPage(1)
                  }}
                  onRatingChange={(value) => {
                    setRating(value)
                    setPage(1)
                  }}
                  onSortChange={(value) => {
                    setSort(value)
                    setPage(1)
                  }}
                  onClear={clearFilters}
                />

                {pagination && (
                  <p className="mb-4 text-sm text-text-muted" data-testid="book-results-count" aria-live="polite">
                    {t('dashboard.bookList.resultsCount', { count: pagination.total })}
                  </p>
                )}

                {!loading && books.length === 0 ? (
                  <div className="py-12 text-center" data-testid="book-no-results">
                    <SearchX className="mx-auto mb-3 h-10 w-10 text-text-muted" aria-hidden="true" />
                    <h4 className="text-lg font-semibold text-text">{t('dashboard.filters.noResultsTitle')}</h4>
                    <p className="text-text-muted">{t('dashboard.filters.noResultsDescription')}</p>
                  </div>
                ) : (
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${
                      loading ? 'opacity-60' : ''
                    }`}
                    aria-busy={loading}
                    data-testid="book-list"
                  >
                    {books.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onEdit={handleEditBook}
                        onDelete={(book) => {
                          setDeleteError('')
                          setBookToDelete(book)
                        }}
                        onStatusChange={changeStatus}
                      />
                    ))}
                  </div>
                )}

                <Pagination
                  page={pagination?.page ?? page}
                  totalPages={pagination?.totalPages ?? 1}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <BookModal
        isOpen={showAddBookModal}
        onClose={() => {
          setShowAddBookModal(false)
          setBookToEdit(null)
        }}
        bookToEdit={bookToEdit}
        onSuccess={({ pending }) => {
          setPendingNotice(pending)
          reload()
        }}
      />

      <DeleteConfirmModal
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleDeleteConfirm}
        bookTitle={bookToDelete?.title || ''}
        loading={deleteLoading}
      />
    </div>
  )
}
