// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, act, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Settings from '../pages/Settings'
import { WorkoutProvider } from '../context/WorkoutContext'
import { EMPTY_WORKOUT_DATA } from '../types'

const mockSignIn = vi.fn()
const mockSignOut = vi.fn()
const mockFindOrCreateFile = vi.fn()
const mockLoadFromDrive = vi.fn()
const mockSaveToDrive = vi.fn()
let mockSignedIn = false

vi.mock('../googleDrive', () => ({
  isSignedIn: () => mockSignedIn,
  signIn: (...args) => mockSignIn(...args),
  signOut: (...args) => mockSignOut(...args),
  findOrCreateFile: (...args) => mockFindOrCreateFile(...args),
  loadFromDrive: (...args) => mockLoadFromDrive(...args),
  saveToDrive: (...args) => mockSaveToDrive(...args),
}))

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
  mockSignedIn = false
  mockSignIn.mockReset()
  mockSignOut.mockReset()
  mockFindOrCreateFile.mockReset()
  mockLoadFromDrive.mockReset()
  mockSaveToDrive.mockReset()
  mockSaveToDrive.mockResolvedValue({})
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

function getExercisesSection() {
  return screen.getByText('Exercises').closest('section')
}

describe('Settings - Exercise List', () => {
  it('renders empty state message', () => {
    renderSettings()
    expect(screen.getByText('No exercises yet.')).toBeInTheDocument()
  })

  it('adds an exercise', () => {
    renderSettings()
    addExercise('Bench Press')
    expect(within(getExercisesSection()).getByText('Bench Press')).toBeInTheDocument()
    expect(screen.queryByText('No exercises yet.')).not.toBeInTheDocument()
  })

  it('does not add duplicate exercise', () => {
    renderSettings()
    addExercise('Bench Press')
    addExercise('Bench Press')
    const exercisesList = screen.getByText('Exercises').closest('section').querySelector('ul')
    expect(within(exercisesList).getAllByText('Bench Press')).toHaveLength(1)
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
    expect(within(getExercisesSection()).getByText('Chest Press')).toBeInTheDocument()
    expect(within(getExercisesSection()).queryByText('Bench Press')).not.toBeInTheDocument()
  })

  it('cancels rename on Escape', () => {
    renderSettings()
    addExercise('Bench Press')
    act(() => {
      screen.getByText('Rename').click()
    })
    const editInput = screen.getByDisplayValue('Bench Press')
    fireEvent.keyDown(editInput, { key: 'Escape' })
    expect(within(getExercisesSection()).getByText('Bench Press')).toBeInTheDocument()
    expect(within(getExercisesSection()).getByText('Rename')).toBeInTheDocument()
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
    expect(within(getExercisesSection()).getByText('Chest Press')).toBeInTheDocument()
    expect(within(getExercisesSection()).queryByText('Bench Press')).not.toBeInTheDocument()
  })
})

describe('Settings - Schedule Editor', () => {
  it('shows empty state when no exercises exist', () => {
    renderSettings()
    expect(screen.getByText('Add exercises first to set a schedule.')).toBeInTheDocument()
  })

  it('shows day headings when exercises exist', () => {
    renderSettings()
    addExercise('Bench Press')
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Sunday')).toBeInTheDocument()
  })

  it('shows checkboxes for each exercise under each day', () => {
    renderSettings()
    addExercise('Bench Press')
    addExercise('Squats')
    const scheduleSection = screen.getByText('Schedule').closest('section')
    const checkboxes = within(scheduleSection).getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(14)
  })

  it('assigns exercise to a day on toggle', () => {
    renderSettings()
    addExercise('Bench Press')
    const mondaySection = screen.getByText('Monday').closest('div')
    const checkbox = within(mondaySection).getByRole('checkbox')
    act(() => {
      fireEvent.click(checkbox)
    })
    expect(checkbox).toBeChecked()
  })

  it('unassigns exercise from a day on second toggle', () => {
    renderSettings()
    addExercise('Bench Press')
    const mondaySection = screen.getByText('Monday').closest('div')
    const checkbox = within(mondaySection).getByRole('checkbox')
    act(() => {
      fireEvent.click(checkbox)
    })
    expect(checkbox).toBeChecked()
    act(() => {
      fireEvent.click(checkbox)
    })
    expect(checkbox).not.toBeChecked()
  })

  it('can assign multiple exercises to a day', () => {
    renderSettings()
    addExercise('Bench Press')
    addExercise('Squats')
    const mondaySection = screen.getByText('Monday').closest('div')
    const checkboxes = within(mondaySection).getAllByRole('checkbox')
    act(() => {
      fireEvent.click(checkboxes[0])
    })
    act(() => {
      fireEvent.click(checkboxes[1])
    })
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })

  it('does not show schedule when exercises list is empty after removal', () => {
    renderSettings()
    addExercise('Bench Press')
    expect(screen.queryByText('Add exercises first to set a schedule.')).not.toBeInTheDocument()
    act(() => {
      screen.getByText('Remove').click()
    })
    expect(screen.getByText('Add exercises first to set a schedule.')).toBeInTheDocument()
  })
})

describe('Settings - Sample Data', () => {
  it('renders Load Sample Data button', () => {
    renderSettings()
    expect(screen.getByText('Load Sample Data')).toBeInTheDocument()
  })

  it('loads sample data on click', () => {
    renderSettings()
    act(() => {
      screen.getByText('Load Sample Data').click()
    })
    expect(screen.getByText('Sample data loaded!')).toBeInTheDocument()
    expect(screen.getAllByText('Bench Press').length).toBeGreaterThan(1)
    expect(screen.getAllByText('Squats').length).toBeGreaterThan(1)
  })
})

describe('Google Drive connection', () => {
  it('shows Connect Google Drive button when not signed in', () => {
    renderSettings()
    expect(screen.getByText('Connect Google Drive')).toBeInTheDocument()
    expect(screen.queryByText('Disconnect')).not.toBeInTheDocument()
  })

  it('shows connected status and Disconnect button when signed in', () => {
    mockSignedIn = true
    renderSettings()
    expect(screen.getByText('Disconnect Google Drive')).toBeInTheDocument()
    expect(screen.getByText('Connected')).toBeInTheDocument()
    expect(screen.queryByText('Connect Google Drive')).not.toBeInTheDocument()
  })

  it('shows sync status when connected', () => {
    mockSignedIn = true
    mockFindOrCreateFile.mockResolvedValue({ folderId: 'f1', fileId: 'file1' })
    mockLoadFromDrive.mockResolvedValue(EMPTY_WORKOUT_DATA)

    renderSettings()

    expect(screen.getByTestId('syncStatus')).toHaveTextContent('idle')
  })

  it('allows entering Google Client ID', () => {
    renderSettings()
    const clientIdInput = screen.getByLabelText('Google Client ID')
    expect(clientIdInput).toBeInTheDocument()
    fireEvent.change(clientIdInput, { target: { value: 'test-client-123' } })
    expect(screen.getByLabelText('Google Client ID')).toHaveValue('test-client-123')
  })
})