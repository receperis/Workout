// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import WeightProgression from '../components/WeightProgression'
import { WorkoutProvider } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

beforeEach(() => {
  localStorage.clear()
})

describe('WeightProgression - Recharts LineChart', () => {
  it('renders chart container when no data', () => {
    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )
    const chartDiv = container.querySelector('div')
    expect(chartDiv).toBeInTheDocument()
  })

  it('renders chart with data from localStorage', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press', 'Squat'],
        schedule: {},
        sessions: [
          {
            id: '1',
            date: '2026-09-10',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 80 }],
          },
          {
            id: '2',
            date: '2026-09-12',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 85 }],
          },
          {
            id: '3',
            date: '2026-09-14',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 90 }],
          },
        ],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('filters data for the selected exercise', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press', 'Squat'],
        schedule: {},
        sessions: [
          {
            id: '1',
            date: '2026-09-10',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 80 }],
          },
          {
            id: '2',
            date: '2026-09-12',
            day: 'Monday',
            sets: [{ exercise: 'Squat', reps: 15, weight: 140 }],
          },
        ],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('handles exercise with no matching sessions', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press'],
        schedule: {},
        sessions: [
          {
            id: '1',
            date: '2026-09-10',
            day: 'Monday',
            sets: [{ exercise: 'Squat', reps: 15, weight: 140 }],
          },
        ],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders date range selector', () => {
    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )

    const select = container.querySelector('select')
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('all')
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(3)
    expect(options[0].value).toBe('all')
    expect(options[0].textContent).toBe('All time')
    expect(options[1].value).toBe('30d')
    expect(options[1].textContent).toBe('30d')
    expect(options[2].value).toBe('90d')
    expect(options[2].textContent).toBe('90d')
  })

  it('filters data for 30d date range', () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press'],
        schedule: {},
        sessions: [
          {
            id: '1',
            date: thirtyDaysAgoStr,
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 80 }],
          },
          {
            id: '2',
            date: '2026-09-12',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 85 }],
          },
        ],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )

    const select = container.querySelector('select')
    fireEvent.change(select, { target: { value: '30d' } })

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('filters data for 90d date range', () => {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split('T')[0]

    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press'],
        schedule: {},
        sessions: [
          {
            id: '1',
            date: ninetyDaysAgoStr,
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 80 }],
          },
          {
            id: '2',
            date: '2026-09-12',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 85 }],
          },
        ],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )

    const select = container.querySelector('select')
    fireEvent.change(select, { target: { value: '90d' } })

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('all time shows all sessions', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press'],
        schedule: {},
        sessions: [
          {
            id: '1',
            date: '2026-08-01',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 80 }],
          },
          {
            id: '2',
            date: '2026-09-12',
            day: 'Monday',
            sets: [{ exercise: 'Bench Press', reps: 15, weight: 85 }],
          },
        ],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <WeightProgression exercise="Bench Press" />
      </WorkoutProvider>,
    )

    const select = container.querySelector('select')
    fireEvent.change(select, { target: { value: 'all' } })

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})