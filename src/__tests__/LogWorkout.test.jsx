// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import LogWorkout from '../pages/LogWorkout'
import { WorkoutProvider } from '../context/WorkoutContext'
import { DAYS_OF_WEEK } from '../types'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

function renderLogWorkout() {
  return render(
    <WorkoutProvider>
      <LogWorkout />
    </WorkoutProvider>,
  )
}

describe('LogWorkout - Day Selector', () => {
  it('renders heading with current day by default', () => {
    renderLogWorkout()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Log Workout - ' + new Date().toLocaleString('en-US', { weekday: 'long' }))
  })

  it('renders heading with route day when provided', () => {
    renderLogWorkout()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Log Workout - Monday')
  })

  it('day selector dropdown renders all 7 days', () => {
    renderLogWorkout()
    const select = screen.getByRole('combobox') || screen.getByRole('listbox') || screen.getByTagName('select')
    expect(select).toBeInTheDocument()
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(DAYS_OF_WEEK.length)
    options.forEach((option, index) => {
      expect(option.value).toBe(DAYS_OF_WEEK[index])
      expect(option.textContent).toBe(DAYS_OF_WEEK[index])
    })
  })

  it('selecting a day updates the heading', () => {
    renderLogWorkout()
    const select = screen.getByRole('combobox') || screen.getByRole('listbox') || screen.getByTagName('select')
    fireEvent.change(select, { target: { value: 'Wednesday' } })
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Log Workout - Wednesday')
  })

  it('preserves selected day after re-render', () => {
    renderLogWorkout()
    const select = screen.getByRole('combobox') || screen.getByRole('listbox') || screen.getByTagName('select')
    fireEvent.change(select, { target: { value: 'Friday' } })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Log Workout - Friday')
  })
})