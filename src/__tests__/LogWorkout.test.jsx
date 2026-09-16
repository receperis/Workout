// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LogWorkout from '../pages/LogWorkout'
import { WorkoutProvider } from '../context/WorkoutContext'
import { DAYS_OF_WEEK } from '../types'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

function renderLogWorkout(route = '/log', schedule = {}) {
  localStorage.setItem(
    'workout-data',
    JSON.stringify({
      exercises: ['Bench Press', 'Squats'],
      schedule,
      sessions: [],
    })
  )
  return render(
    <MemoryRouter initialEntries={[route]}>
      <WorkoutProvider>
        <Routes>
          <Route path="/log" element={<LogWorkout />} />
          <Route path="/log/:day" element={<LogWorkout />} />
        </Routes>
      </WorkoutProvider>
    </MemoryRouter>
  )
}

describe('LogWorkout - Day Selector', () => {
  it('renders heading with current day by default', () => {
    renderLogWorkout()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Log Workout - ' + new Date().toLocaleString('en-US', { weekday: 'long' }))
  })

  it('day selector dropdown renders all 7 days', () => {
    renderLogWorkout()
    const select = screen.getByRole('combobox') || screen.getByRole('listbox') || screen.getByTagName('select')
    expect(select).toBeInTheDocument()
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(DAYS_OF_WEEK.length)
  })

  it('selecting a day updates the heading', () => {
    renderLogWorkout()
    const select = screen.getByRole('combobox') || screen.getByRole('listbox') || screen.getByTagName('select')
    fireEvent.change(select, { target: { value: 'Wednesday' } })
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Log Workout - Wednesday')
  })
})

describe('LogWorkout - Exercise Cards', () => {
  it('shows empty state when no exercises assigned to day', () => {
    renderLogWorkout('/log/Monday', {})
    expect(screen.getByText(/No exercises assigned/)).toBeInTheDocument()
  })

  it('renders exercise cards for assigned exercises', () => {
    renderLogWorkout('/log/Monday', { Monday: ['Bench Press', 'Squats'] })
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Squats')).toBeInTheDocument()
  })

  it('does not show save button when no weights entered', () => {
    renderLogWorkout('/log/Monday', { Monday: ['Bench Press'] })
    expect(screen.queryByText('Save Session')).not.toBeInTheDocument()
  })

  it('shows save button when weights are entered', () => {
    renderLogWorkout('/log/Monday', { Monday: ['Bench Press'] })
    const input = screen.getByRole('spinbutton', { name: 'Bench Press 15 reps weight' })
    fireEvent.change(input, { target: { value: '50' } })
    expect(screen.getByText('Save Session')).toBeInTheDocument()
  })

  it('displays grand total at the top', () => {
    renderLogWorkout('/log/Monday', { Monday: ['Bench Press'] })
    const input = screen.getByRole('spinbutton', { name: 'Bench Press 15 reps weight' })
    fireEvent.change(input, { target: { value: '20' } })
    // 15 * 20 = 300 - grand total appears at top
    const totals = screen.getAllByText('Total: 300 kg')
    expect(totals.length).toBe(2) // grand total + per-card total
    expect(totals[0].className).toContain('text-blue-600') // grand total
  })
})
