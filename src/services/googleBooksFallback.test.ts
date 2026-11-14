import { beforeEach, describe, expect, it, vi } from 'vitest'

const google = vi.hoisted(() => ({ get: vi.fn() }))
const openLibrary = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('axios', () => ({
  default: {
    create: ({ baseURL }: { baseURL: string }) => (baseURL.includes('googleapis') ? google : openLibrary),
  },
}))

import { googleBooksService } from './googleBooks.service'

beforeEach(() => {
  google.get.mockReset()
  openLibrary.get.mockReset()
})

describe('googleBooksService.search', () => {
  it('uses Google Books when it answers', async () => {
    google.get.mockResolvedValue({ data: { items: [{ id: 'g1', volumeInfo: { title: 'Dom Casmurro' } }] } })

    const result = await googleBooksService.search('dom casmurro')

    expect(result.map((item) => item.id)).toEqual(['g1'])
    expect(openLibrary.get).not.toHaveBeenCalled()
  })

  it('falls back to Open Library when the Google quota is exhausted', async () => {
    google.get.mockRejectedValue({ response: { status: 429 } })
    openLibrary.get.mockResolvedValue({ data: { docs: [{ key: '/works/OL1W', title: 'Dom Casmurro' }] } })

    const result = await googleBooksService.search('dom casmurro')

    expect(result.map((item) => item.id)).toEqual(['/works/OL1W'])
    expect(openLibrary.get).toHaveBeenCalledWith(
      '/search.json',
      expect.objectContaining({ params: expect.objectContaining({ q: 'dom casmurro' }) }),
    )
  })
})
