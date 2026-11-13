import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AboutPage } from './AboutPage'

const auth = { isAuthenticated: false, roles: ['reader'] }

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => auth,
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  )

beforeEach(() => {
  auth.isAuthenticated = false
})

describe('AboutPage', () => {
  it('explains the project with a single h1 and a section per topic', () => {
    renderPage()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByTestId('about-title')).toHaveTextContent('Sobre o Tsundoku')
    for (const key of ['name', 'what', 'features', 'qa', 'data']) {
      expect(screen.getByTestId(`about-section-${key}`)).toBeInTheDocument()
    }
  })

  it('invites a visitor to create an account', () => {
    renderPage()

    expect(screen.getByTestId('about-register-button')).toHaveAttribute('href', '/register')
    expect(screen.getByTestId('about-back-link')).toHaveAttribute('href', '/login')
  })

  it('hides the sign-up call for someone already signed in and goes back to the app', () => {
    auth.isAuthenticated = true
    renderPage()

    expect(screen.queryByTestId('about-cta')).not.toBeInTheDocument()
    expect(screen.getByTestId('about-back-link')).toHaveAttribute('href', '/dashboard')
  })

  it('links to the terms and opens the code safely', () => {
    renderPage()

    expect(screen.getByTestId('about-terms-link')).toHaveAttribute('href', '/terms')
    expect(screen.getByTestId('about-github-link')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has the About link, the footer and its note', () => {
    renderPage()

    expect(screen.getByTestId('about-link')).toHaveAttribute('href', '/about')
    expect(screen.getByTestId('footer-note')).toHaveTextContent('Todos os dados são fictícios')
  })
})
