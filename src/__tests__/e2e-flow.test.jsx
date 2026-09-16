// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Progress from '../pages/Progress'
import { WorkoutProvider } from '../context/WorkoutContext'
import '@testing-library/jest-dom/vitest'

describe('E2E Flow - Create exercises → Schedule → Log → Chart', () => {
  it('displays progress weights from localStorage', () => {
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
              { exercise: 'Squat', reps: 15, weight: 150 },
            ],
          },
        ],
      }),
    )

    const { container } = render(<WorkoutProvider><Progress /></WorkoutProvider>)
    const select = container.querySelector('select')
    fireEvent.change(select, { target: { value: 'Bench Press' } })

    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBeGreaterThan(0)
    const bench = Array.from(paragraphs).find(p => p.textContent.includes('Bench Press'))
    expect(bench).toBeInTheDocument()
    expect(bench.textContent).toContain('100 kg')

    fireEvent.change(select, { target: { value: 'Squat' } })

    const paragraphsAfter = container.querySelectorAll('p')
    const squat = Array.from(paragraphsAfter).find(p => p.textContent.includes('Squat'))
    expect(squat).toBeInTheDocument()
    expect(squat.textContent).toContain('150 kg')
  })
})