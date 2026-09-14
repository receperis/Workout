// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Settings from '../pages/Settings'
import { WorkoutProvider } from '../context/WorkoutContext'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

function renderSettings() {
  return render(
    <WorkoutProvider>
      <Settings />
    </WorkoutProvider>,
  )
}

function addExercise(name) {
  const input = screen.getByPlaceholderText('New exercise name')
  fireEvent.change(input, { target: { value: name } })
  fireEvent.click(screen.getByRole('button', { name: /add/i }))
}

describe('Settings - Exercise List', () => {
  it('renders empty state message', () => {
    renderSettings()
    expect(screen.getByText('No exercises yet.')).toBeInTheDocument()
  })

  it('adds an exercise', () => {
    renderSettings()
    addExercise('Bench Press')
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.queryByText('No exercises yet.')).not.toBeInTheDocument()
  })

  it('does not add duplicate exercise', () => {
    renderSettings()
    addExercise('Bench Press')
    addExercise('Bench Press')
    expect(screen.getAllByText('Bench Press')).toHaveLength(1)
  })

  it('does not add empty exercise', () => {
    renderSettings()
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('No exercises yet.')).toBeInTheDocument()
  })

  it('removes an exercise', () => {
    renderSettings()
    addExercise('Bench Press')
    act(() => {
      screen.getByText('Remove').click()
    })
    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument()
    expect(screen.getByText('No exercises yet.')).toBeInTheDocument()
  })

  it('renames an exercise', () => {
    renderSettings()
    addExercise('Bench Press')
    act(() => {
      screen.getByText('Rename').click()
    })
    const editInput = screen.getByDisplayValue('Bench Press')
    fireEvent.change(editInput, { target: { value: 'Chest Press' } })
    fireEvent.click(screen.getByText('Save'))
    expect(screen.getByText('Chest Press')).toBeInTheDocument()
    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument()
  })

  it('cancels rename on Escape', () => {
    renderSettings()
    addExercise('Bench Press')
    act(() => {
      screen.getByText('Rename').click()
    })
    const editInput = screen.getByDisplayValue('Bench Press')
    fireEvent.keyDown(editInput, { key: 'Escape' })
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Rename')).toBeInTheDocument()
  })

  it('renames via Enter key', () => {
    renderSettings()
    addExercise('Bench Press')
    act(() => {
      screen.getByText('Rename').click()
    })
    const editInput = screen.getByDisplayValue('Bench Press')
    fireEvent.change(editInput, { target: { value: 'Chest Press' } })
    fireEvent.keyDown(editInput, { key: 'Enter' })
    expect(screen.getByText('Chest Press')).toBeInTheDocument()
    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument()
  })
})
