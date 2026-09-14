// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

beforeEach(() => {
  localStorage.clear()
})

function TestComponent() {
  const { state, dispatch } = useWorkout()
  return (
    <div>
      <span data-testid="exercises">{JSON.stringify(state.exercises)}</span>
      <button onClick={() => dispatch({ type: 'ADD_EXERCISE', payload: 'Squats' })}>
        Add Exercise
      </button>
    </div>
  )
}

describe('WorkoutProvider localStorage integration', () => {
  it('loads initial state from localStorage', () => {
    const savedData = {
      exercises: ['Bench Press', 'Squats'],
      schedule: { Monday: ['Bench Press'] },
      sessions: [],
    }
    localStorage.setItem('workout-data', JSON.stringify(savedData))

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>,
    )

    expect(screen.getByTestId('exercises')).toHaveTextContent('["Bench Press","Squats"]')
  })

  it('falls back to empty state when localStorage is invalid', () => {
    localStorage.setItem('workout-data', JSON.stringify({ invalid: true }))

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>,
    )

    expect(screen.getByTestId('exercises')).toHaveTextContent('[]')
  })

  it('falls back to empty state when localStorage is empty', () => {
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>,
    )

    expect(screen.getByTestId('exercises')).toHaveTextContent('[]')
  })

  it('persists state changes to localStorage', () => {
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>,
    )

    act(() => {
      screen.getByText('Add Exercise').click()
    })

    const saved = JSON.parse(localStorage.getItem('workout-data'))
    expect(saved.exercises).toEqual(['Squats'])
  })

  it('saves valid WorkoutData structure', () => {
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>,
    )

    act(() => {
      screen.getByText('Add Exercise').click()
    })

    const saved = JSON.parse(localStorage.getItem('workout-data'))
    expect(saved).toHaveProperty('exercises')
    expect(saved).toHaveProperty('schedule')
    expect(saved).toHaveProperty('sessions')
  })
})
