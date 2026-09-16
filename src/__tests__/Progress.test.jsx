// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Progress from '../pages/Progress'
import { WorkoutProvider } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

function renderProgress(data = { exercises: [], schedule: {}, sessions: [] }) {
  localStorage.setItem('workout-data', JSON.stringify(data))
  return render(
    <WorkoutProvider>
      <Progress />
    </WorkoutProvider>
  )
}

describe('Progress - Day Tabs', () => {
  it('renders heading with "Progress"', () => {
    renderProgress()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Progress')
  })

  it('shows empty state when no schedule configured', () => {
    renderProgress({ exercises: ['Bench Press'], schedule: {}, sessions: [] })
    expect(screen.getByText(/No exercises scheduled yet/)).toBeInTheDocument()
  })

  it('renders day tabs for days with exercises in schedule', () => {
    renderProgress({
      exercises: ['Bench Press', 'Squats'],
      schedule: { Monday: ['Bench Press'], Wednesday: ['Squats'] },
      sessions: [],
    })
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Wednesday')).toBeInTheDocument()
    expect(screen.queryByText('Tuesday')).not.toBeInTheDocument()
  })

  it('defaults to today if today has exercises', () => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' })
    renderProgress({
      exercises: ['Bench Press'],
      schedule: { [today]: ['Bench Press'] },
      sessions: [],
    })
    const todayButton = screen.getByText(today)
    expect(todayButton.className).toContain('bg-blue-600')
  })

  it('switches tab on click', () => {
    renderProgress({
      exercises: ['Bench Press', 'Squats'],
      schedule: { Monday: ['Bench Press'], Wednesday: ['Squats'] },
      sessions: [],
    })
    fireEvent.click(screen.getByText('Wednesday'))
    expect(screen.getByText('Squats')).toBeInTheDocument()
    const wedButton = screen.getByText('Wednesday')
    expect(wedButton.className).toContain('bg-blue-600')
  })

  it('renders exercise names for the selected day', () => {
    renderProgress({
      exercises: ['Bench Press', 'Squats'],
      schedule: { Monday: ['Bench Press', 'Squats'] },
      sessions: [],
    })
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Squats')).toBeInTheDocument()
  })

  it('shows no session data message when no sessions', () => {
    renderProgress({
      exercises: ['Bench Press'],
      schedule: { Monday: ['Bench Press'] },
      sessions: [],
    })
    expect(screen.getByText(/No session data yet for Bench Press/)).toBeInTheDocument()
  })

  it('renders chart area when session data exists', () => {
    renderProgress({
      exercises: ['Bench Press'],
      schedule: { Monday: ['Bench Press'] },
      sessions: [
        {
          id: '1',
          date: '2026-09-10',
          day: 'Monday',
          sets: [{ exercise: 'Bench Press', reps: 15, weight: 80 }],
        },
      ],
    })
    expect(screen.queryByText(/No session data yet/)).not.toBeInTheDocument()
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
  })
})
