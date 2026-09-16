// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Dashboard from '../pages/Dashboard'
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function TestComponent() {
  const { state, dispatch } = useWorkout()
  return (
    <div>
      <Dashboard />
      <button
        onClick={() =>
          dispatch({
            type: 'ADD_EXERCISE',
            payload: 'Bench Press',
          })
        }
      >
        Add Bench Press
      </button>
      <button
        onClick={() =>
          dispatch({
            type: 'ADD_EXERCISE',
            payload: 'Squat',
          })
        }
      >
        Add Squat
      </button>
      <button
        onClick={() =>
          dispatch({
            type: 'LOG_SESSION',
            payload: {
              id: '1',
              date: '2026-09-14',
              day: 'Monday',
              sets: [
                { exercise: 'Bench Press', reps: 15, weight: 50 },
                { exercise: 'Squat', reps: 15, weight: 80 },
              ],
            },
          })
        }
      >
        Log Session
      </button>
      <span data-testid="exercises">{JSON.stringify(state.exercises)}</span>
      <span data-testid="sessions">{JSON.stringify(state.sessions)}</span>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <WorkoutProvider>
      <TestComponent />
    </WorkoutProvider>,
  )
}

describe('Dashboard', () => {
  it('renders Dashboard heading', () => {
    renderWithProvider()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Dashboard')
  })

  it('shows last weight per exercise when sessions exist', () => {
    renderWithProvider()
    act(() => {
      screen.getByText('Add Bench Press').click()
      screen.getByText('Add Squat').click()
      screen.getByText('Log Session').click()
    })
    expect(screen.getByText('Bench Press: 50 kg')).toBeInTheDocument()
    expect(screen.getByText('Squat: 80 kg')).toBeInTheDocument()
  })

  it('shows nothing when no sessions exist', () => {
    renderWithProvider()
    const summary = screen.queryByText('Last weight per exercise')
    expect(summary).not.toBeInTheDocument()
  })

  it('shows last weight per exercise from most recent session', () => {
    renderWithProvider()
    act(() => {
      screen.getByText('Add Bench Press').click()
      screen.getByText('Add Squat').click()
      screen.getByText('Log Session').click()
    })
    expect(screen.getByText('Bench Press: 50 kg')).toBeInTheDocument()
    expect(screen.getByText('Squat: 80 kg')).toBeInTheDocument()
  })
})