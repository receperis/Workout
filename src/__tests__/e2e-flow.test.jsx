// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import Progress from '../pages/Progress'
import { WorkoutProvider } from '../context/WorkoutContext'
import '@testing-library/jest-dom/vitest'

describe('E2E Flow - Create exercises → Schedule → Log → Chart', () => {
  it('displays day tabs and exercise names from localStorage', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press', 'Squat'],
        schedule: { Monday: ['Bench Press'], Wednesday: ['Squat'] },
        sessions: [
          {
            id: '1',
            date: '2026-09-14',
            day: 'Monday',
            sets: [
              { exercise: 'Bench Press', reps: 15, weight: 100 },
            ],
          },
          {
            id: '2',
            date: '2026-09-14',
            day: 'Wednesday',
            sets: [
              { exercise: 'Squat', reps: 15, weight: 150 },
            ],
          },
        ],
      }),
    )

    render(<WorkoutProvider><Progress /></WorkoutProvider>)

    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Wednesday')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Monday'))
    expect(screen.getByText('Bench Press')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Wednesday'))
    expect(screen.getByText('Squat')).toBeInTheDocument()
  })
})
