// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
})

function TestComponent() {
  const { state, dispatch } = useWorkout()
  return (
    <div>
      <span data-testid="exercises">{JSON.stringify(state.exercises)}</span>
      <span data-testid="schedule">{JSON.stringify(state.schedule)}</span>
      <span data-testid="sessions">{JSON.stringify(state.sessions)}</span>
      <button onClick={() => dispatch({ type: 'ADD_EXERCISE', payload: 'Bench Press' })}>
        Add Exercise
      </button>
      <button onClick={() => dispatch({ type: 'REMOVE_EXERCISE', payload: 'Bench Press' })}>
        Remove Exercise
      </button>
      <button
        onClick={() =>
          dispatch({
            type: 'LOG_SESSION',
            payload: {
              id: 'test-id',
              date: '2026-09-14',
              day: 'Monday',
              sets: [{ exercise: 'Bench Press', reps: 15, weight: 50 }],
            },
          })
        }
      >
        Log Session
      </button>
      <button
        onClick={() =>
          dispatch({
            type: 'SET_SCHEDULE',
            payload: { Monday: ['Bench Press'], Wednesday: ['Squats'] },
          })
        }
      >
        Set Schedule
      </button>
      <button
        onClick={() =>
          dispatch({
            type: 'LOAD_DATA',
            payload: {
              exercises: ['Squats'],
              schedule: { Friday: ['Squats'] },
              sessions: [],
            },
          })
        }
      >
        Load Data
      </button>
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

describe('WorkoutContext', () => {
  it('provides initial empty state', () => {
    renderWithProvider()
    expect(screen.getByTestId('exercises')).toHaveTextContent('[]')
    expect(screen.getByTestId('schedule')).toHaveTextContent('{}')
    expect(screen.getByTestId('sessions')).toHaveTextContent('[]')
  })

  it('handles ADD_EXERCISE', () => {
    renderWithProvider()
    act(() => {
      screen.getByText('Add Exercise').click()
    })
    expect(screen.getByTestId('exercises')).toHaveTextContent('["Bench Press"]')
  })

  it('handles REMOVE_EXERCISE', () => {
    renderWithProvider()
    act(() => {
      screen.getByText('Add Exercise').click()
    })
    act(() => {
      screen.getByText('Remove Exercise').click()
    })
    expect(screen.getByTestId('exercises')).toHaveTextContent('[]')
  })

  it('handles LOG_SESSION', () => {
    renderWithProvider()
    act(() => {
      screen.getByText('Log Session').click()
    })
    expect(screen.getByTestId('sessions')).toHaveTextContent(
      '[{"id":"test-id","date":"2026-09-14","day":"Monday","sets":[{"exercise":"Bench Press","reps":15,"weight":50}]}]',
    )
  })

  it('handles SET_SCHEDULE', () => {
    renderWithProvider()
    act(() => {
      screen.getByText('Set Schedule').click()
    })
    expect(screen.getByTestId('schedule')).toHaveTextContent(
      '{"Monday":["Bench Press"],"Wednesday":["Squats"]}',
    )
  })

  it('handles LOAD_DATA', () => {
    renderWithProvider()
    act(() => {
      screen.getByText('Load Data').click()
    })
    expect(screen.getByTestId('exercises')).toHaveTextContent('["Squats"]')
    expect(screen.getByTestId('schedule')).toHaveTextContent('{"Friday":["Squats"]}')
    expect(screen.getByTestId('sessions')).toHaveTextContent('[]')
  })

  it('throws when useWorkout is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useWorkout must be used within a WorkoutProvider')
    consoleSpy.mockRestore()
  })
})
