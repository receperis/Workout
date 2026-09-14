// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Progress from '../pages/Progress'
import { WorkoutProvider } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

describe('Progress - Exercise Selector', () => {
  it('renders heading with "Progress"', () => {
    const { container } = render(
      <WorkoutProvider>
        <Progress />
      </WorkoutProvider>,
    )
    const heading = container.querySelector('h1')
    expect(heading).toHaveTextContent('Progress')
  })

  it('renders "No exercises added yet" when no exercises in context', () => {
    const { container } = render(
      <WorkoutProvider>
        <Progress />
      </WorkoutProvider>,
    )
    const select = container.querySelector('select')
    expect(select).toBeInTheDocument()
    const option = select.querySelector('option')
    expect(option.textContent).toBe('No exercises added yet')
  })

  it('renders dropdown with exercises from localStorage', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press', 'Squat'],
        schedule: {},
        sessions: [],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <Progress />
      </WorkoutProvider>,
    )

    const select = container.querySelector('select')
    expect(select).toBeInTheDocument()
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(2)
    expect(options[0].value).toBe('Bench Press')
    expect(options[0].textContent).toBe('Bench Press')
    expect(options[1].value).toBe('Squat')
    expect(options[1].textContent).toBe('Squat')
  })

  it('shows last progress weight when exercise selected with sessions in localStorage', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: ['Bench Press', 'Squat'],
        schedule: {},
        sessions: [
          {
            id: '1',
            date: '2026-09-15',
            day: 'Monday',
            sets: [
              { exercise: 'Bench Press', reps: 15, weight: 100 },
              { exercise: 'Squat', reps: 15, weight: 150 },
            ],
          },
        ],
      }),
    )

    const { container } = render(
      <WorkoutProvider>
        <Progress />
      </WorkoutProvider>,
    )

    const select = container.querySelector('select')
    fireEvent.change(select, { target: { value: 'Bench Press' } })

    // After selecting Bench Press, the progress should show 100 kg
    // The component re-renders based on the select change
    const progressParagraphs = container.querySelectorAll('p')
    expect(progressParagraphs.length).toBeGreaterThan(0)
    const benchPressProgress = Array.from(progressParagraphs).find(
      (p) => p.textContent.includes('Bench Press'),
    )
    expect(benchPressProgress).toBeInTheDocument()
    expect(benchPressProgress.textContent).toContain('100 kg')
  })
})