import { describe, expect, it } from 'vitest'
import { buildQuery, mapOpenLibraryDoc, mapVolume } from './googleBooks.service'

describe('buildQuery', () => {
  it('searches ISBN-looking input as an ISBN, ignoring hyphens and spaces', () => {
    expect(buildQuery('978-85-359-1484-9')).toBe('isbn:9788535914849')
    expect(buildQuery(' 8535914846 ')).toBe('isbn:8535914846')
  })

  it('keeps free text as is', () => {
    expect(buildQuery('  Dom Casmurro ')).toBe('Dom Casmurro')
    expect(buildQuery('1984')).toBe('1984')
  })
})

describe('mapVolume', () => {
  it('maps a full volume', () => {
    const suggestion = mapVolume({
      id: 'vol1',
      volumeInfo: {
        title: 'Dom Casmurro',
        authors: ['Machado de Assis', 'Outro Autor'],
        publisher: 'Companhia das Letras',
        publishedDate: '2016-03-01',
        description: '<p>Um <b>clássico</b>.</p>',
        pageCount: 256,
        language: 'pt',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '8535914846' },
          { type: 'ISBN_13', identifier: '9788535914849' },
        ],
        imageLinks: { thumbnail: 'http://books.google.com/cover.jpg' },
      },
    })

    expect(suggestion).toEqual({
      id: 'vol1',
      title: 'Dom Casmurro',
      author: 'Machado de Assis, Outro Autor',
      isbn: '9788535914849',
      publisher: 'Companhia das Letras',
      publishedYear: 2016,
      pages: 256,
      language: 'pt',
      description: 'Um clássico .',
      coverUrl: 'https://books.google.com/cover.jpg',
    })
  })

  it('falls back to ISBN-10 and tolerates missing fields', () => {
    const suggestion = mapVolume({
      id: 'vol2',
      volumeInfo: {
        title: 'Sem Detalhes',
        publishedDate: 'abcd',
        pageCount: 0,
        industryIdentifiers: [{ type: 'ISBN_10', identifier: '8535914846' }],
      },
    })

    expect(suggestion).toMatchObject({ title: 'Sem Detalhes', author: '', isbn: '8535914846' })
    expect(suggestion?.publishedYear).toBeUndefined()
    expect(suggestion?.pages).toBeUndefined()
    expect(suggestion?.coverUrl).toBeUndefined()
  })

  it('drops volumes without a title', () => {
    expect(mapVolume({ id: 'vol3', volumeInfo: {} })).toBeNull()
    expect(mapVolume({ id: 'vol4' })).toBeNull()
  })
})

describe('mapOpenLibraryDoc', () => {
  it('maps a document, preferring ISBN-13 and translating the language code', () => {
    expect(
      mapOpenLibraryDoc({
        key: '/works/OL1W',
        title: 'Dom Casmurro',
        author_name: ['Machado de Assis'],
        isbn: ['8575201174', '9788575201176'],
        publisher: ['Ática'],
        first_publish_year: 1899,
        number_of_pages_median: 269,
        language: ['xxx', 'por'],
        cover_i: 647501,
      }),
    ).toEqual({
      id: '/works/OL1W',
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      isbn: '9788575201176',
      publisher: 'Ática',
      publishedYear: 1899,
      pages: 269,
      language: 'pt',
      coverUrl: 'https://covers.openlibrary.org/b/id/647501-M.jpg',
    })
  })

  it('drops documents without a title', () => {
    expect(mapOpenLibraryDoc({ key: '/works/OL2W' })).toBeNull()
  })
})
