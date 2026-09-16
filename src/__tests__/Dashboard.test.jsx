// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Dashboard from '../pages/Dashboard'
import { WorkoutProvider } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

function renderDashboard(data = { exercises: [], schedule: {}, sessions: [] }) {
  localStorage.setItem('workout-data', JSON.stringify(data))
  return render(
    <WorkoutProvider>
      <Dashboard />
    </WorkoutProvider>
  )
}

describe('Dashboard', () => {
  it('renders Dashboard heading', () => {
    renderDashboard()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
  })

  it('shows today day name', () => {
    renderDashboard()
    const today = new Date().toLocaleString('en-US', { weekday: 'long' })
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2).toHaveTextContent(today)
  })

  it('shows empty state when no exercises scheduled for today', () => {
    renderDashboard({
      exercises: ['Bench Press'],
      schedule: { Tuesday: ['Bench Press'] },
      sessions: [],
    })
    expect(screen.getByText(/No exercises scheduled for today/)).toBeInTheDocument()
  })

  it('shows exercise names for today', () => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' })
    renderDashboard({
      exercises: ['Bench Press', 'Squats'],
      schedule: { [today]: ['Bench Press', 'Squats'] },
      sessions: [],
    })
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Squats')).toBeInTheDocument()
  })

  it('shows no session data message when no sessions', () => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' })
    renderDashboard({
      exercises: ['Bench Press'],
      schedule: { [today]: ['Bench Press'] },
      sessions: [],
    })
    expect(screen.getByText(/No session data yet for Bench Press/)).toBeInTheDocument()
  })

  it('renders chart when session data exists', () => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' })
    renderDashboard({
      exercises: ['Bench Press'],
      schedule: { [today]: ['Bench Press'] },
      sessions: [
        {
          id: '1',
          date: '2026-09-10',
          day: today,
          sets: [
            { exercise: 'Bench Press', reps: 15, weight: 50 },
            { exercise: 'Bench Press', reps: 13, weight: 55 },
          ],
        },
      ],
    })
    expect(screen.queryByText(/No session data yet/)).not.toBeInTheDocument()
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
  })
})
