// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { WorkoutProvider } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
})

function renderWithRouter(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </MemoryRouter>,
  )
}

describe('React Router setup', () => {
  it('renders Dashboard on /', () => {
    renderWithRouter('/')
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('renders LogWorkout on /log', () => {
    renderWithRouter('/log')
    expect(screen.getByRole('heading', { name: /log workout/i })).toBeInTheDocument()
  })

  it('renders Progress on /progress', () => {
    renderWithRouter('/progress')
    expect(screen.getByRole('heading', { name: /progress/i })).toBeInTheDocument()
  })

  it('renders Settings on /settings', () => {
    renderWithRouter('/settings')
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter('/')
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /log workout/i })).toHaveAttribute('href', '/log')
    expect(screen.getByRole('link', { name: /progress/i })).toHaveAttribute('href', '/progress')
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
  })
})
