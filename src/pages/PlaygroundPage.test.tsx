import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PlaygroundPage } from './PlaygroundPage'
import { PlaygroundProvider } from '../contexts/PlaygroundContext'
import { BookCover } from '../components/BookCover'
import { playgroundService } from '../services/playground.service'
import type { PlaygroundBug } from '../types/playground'

vi.mock('../services/playground.service', () => ({
  playgroundService: { list: vi.fn(), setEnabled: vi.fn() },
}))

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', name: 'Ana', email: 'ana@test.com', roles: ['reader'] },
    roles: ['reader'],
    hasRole: () => true,
    isAuthenticated: true,
    logout: vi.fn(),
  }),
}))

const service = vi.mocked(playgroundService)

const catalog = (enabled: string[] = []): PlaygroundBug[] =>
  [
    { id: 'api-create-book-status-200', layer: 'api', area: 'books' },
    { id: 'ui-cover-without-alt', layer: 'ui', area: 'books' },
  ].map((bug) => ({ ...bug, layer: bug.layer as 'api' | 'ui', enabled: enabled.includes(bug.id) }))

const renderPage = () =>
  render(
    <MemoryRouter>
      <PlaygroundProvider>
        <PlaygroundPage />
      </PlaygroundProvider>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.clearAllMocks()
  service.list.mockResolvedValue(catalog())
  service.setEnabled.mockImplementation(async (ids) => catalog(ids))
})

describe('PlaygroundPage', () => {
  it('lists the bugs with their layer and a hint that does not give the answer away', async () => {
    renderPage()

    expect(await screen.findByTestId('bug-api-create-book-status-200')).toHaveTextContent('Cadastro de livros')
    expect(screen.getByTestId('bug-layer-ui-cover-without-alt')).toHaveTextContent('Interface')
    expect(screen.getByTestId('playground-notice')).toBeInTheDocument()
    expect(screen.queryByTestId('bugs-banner')).not.toBeInTheDocument()
  })

  it('switches a bug on, saving the whole set, and shows the banner', async () => {
    renderPage()

    await userEvent.click(await screen.findByTestId('bug-toggle-api-create-book-status-200'))

    expect(service.setEnabled).toHaveBeenCalledWith(['api-create-book-status-200'])
    expect(await screen.findByTestId('bugs-banner')).toBeInTheDocument()
    expect(screen.getByTestId('playground-active-count')).toHaveTextContent('1 bug ativo')
    expect(screen.getByTestId('bug-toggle-api-create-book-status-200')).toBeChecked()
  })

  it('switches everything off at once', async () => {
    service.list.mockResolvedValue(catalog(['api-create-book-status-200', 'ui-cover-without-alt']))
    renderPage()

    await userEvent.click(await screen.findByTestId('playground-clear'))

    expect(service.setEnabled).toHaveBeenCalledWith([])
    await waitFor(() => expect(screen.queryByTestId('bugs-banner')).not.toBeInTheDocument())
  })

  it('shows an error when saving fails', async () => {
    service.setEnabled.mockRejectedValue(new Error('boom'))
    renderPage()

    await userEvent.click(await screen.findByTestId('bug-toggle-ui-cover-without-alt'))

    expect(await screen.findByTestId('error-message')).toBeInTheDocument()
  })

  it('removes the alt text of the covers while that bug is on', async () => {
    service.list.mockResolvedValue(catalog(['ui-cover-without-alt']))
    render(
      <MemoryRouter>
        <PlaygroundProvider>
          <BookCover url="https://placehold.co/c.png" alt="Capa de Dom Casmurro" testId="cover" />
        </PlaygroundProvider>
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByTestId('cover')).toHaveAttribute('alt', ''))
  })
})
