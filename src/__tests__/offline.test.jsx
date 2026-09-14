// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext'
import { EMPTY_WORKOUT_DATA } from '../types'
import * as storage from '../storage'

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

const flush = () => new Promise((r) => setTimeout(r, 0))

function TestComponent() {
  const { state, dispatch, signIn, signOut, syncStatus, signedIn, online, pendingSync } = useWorkout()
  return (
    <div>
      <span data-testid="exercises">{JSON.stringify(state.exercises)}</span>
      <span data-testid="syncStatus">{syncStatus}</span>
      <span data-testid="signedIn">{String(signedIn)}</span>
      <span data-testid="online">{String(online)}</span>
      <span data-testid="pendingSync">{String(pendingSync)}</span>
      <button onClick={() => dispatch({ type: 'ADD_EXERCISE', payload: 'Bench Press' })}>
        Add Exercise
      </button>
      <button onClick={() => signIn('test-client-id')}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
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

beforeEach(() => {
  localStorage.clear()
  mockSignedIn = false
  mockSignIn.mockReset()
  mockSignOut.mockReset()
  mockFindOrCreateFile.mockReset()
  mockLoadFromDrive.mockReset()
  mockSaveToDrive.mockReset()
  mockSaveToDrive.mockResolvedValue({})
  Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true })
})

afterEach(() => {
  cleanup()
})

describe('offline queue storage', () => {
  it('savePendingSync sets flag in localStorage', () => {
    storage.savePendingSync()
    expect(localStorage.getItem('workout-pending-sync')).toBe('true')
  })

  it('loadPendingSync returns false when not set', () => {
    expect(storage.loadPendingSync()).toBe(false)
  })

  it('loadPendingSync returns true after save', () => {
    storage.savePendingSync()
    expect(storage.loadPendingSync()).toBe(true)
  })

  it('clearPendingSync removes the flag', () => {
    storage.savePendingSync()
    storage.clearPendingSync()
    expect(storage.loadPendingSync()).toBe(false)
  })
})

describe('offline detection', () => {
  it('initializes online state from navigator.onLine', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })
    renderWithProvider()
    expect(screen.getByTestId('online')).toHaveTextContent('false')
  })

  it('sets online to false on offline event', async () => {
    renderWithProvider()
    expect(screen.getByTestId('online')).toHaveTextContent('true')

    await act(async () => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByTestId('online')).toHaveTextContent('false')
  })

  it('sets online to true on online event', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })
    renderWithProvider()
    expect(screen.getByTestId('online')).toHaveTextContent('false')

    await act(async () => {
      window.dispatchEvent(new Event('online'))
    })

    expect(screen.getByTestId('online')).toHaveTextContent('true')
  })
})

describe('sync queuing when offline', () => {
  it('queues changes and sets error status when offline while signed in', async () => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true })
    mockSignedIn = true
    mockFindOrCreateFile.mockResolvedValue({ folderId: 'f1', fileId: 'file1' })
    mockLoadFromDrive.mockResolvedValue(EMPTY_WORKOUT_DATA)

    renderWithProvider()

    await act(async () => {
      screen.getByText('Sign In').click()
      await flush()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('false')

    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })

    await act(async () => {
      screen.getByText('Add Exercise').click()
      await flush()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('true')
    expect(screen.getByTestId('syncStatus')).toHaveTextContent('error')
    expect(mockSaveToDrive).not.toHaveBeenCalled()
  })

  it('queues changes when Drive sync fails', async () => {
    mockSignedIn = true
    mockFindOrCreateFile.mockResolvedValue({ folderId: 'f1', fileId: 'file1' })
    mockLoadFromDrive.mockResolvedValue(EMPTY_WORKOUT_DATA)

    renderWithProvider()

    await act(async () => {
      screen.getByText('Sign In').click()
      await flush()
    })

    mockSaveToDrive.mockRejectedValueOnce(new Error('Network error'))

    await act(async () => {
      screen.getByText('Add Exercise').click()
      await flush()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('true')
    expect(screen.getByTestId('syncStatus')).toHaveTextContent('error')
    expect(localStorage.getItem('workout-pending-sync')).toBe('true')
  })
})

describe('sync flush on reconnect', () => {
  it('flushes pending sync when coming back online', async () => {
    mockSignedIn = true
    mockFindOrCreateFile.mockResolvedValue({ folderId: 'f1', fileId: 'file1' })
    mockLoadFromDrive.mockResolvedValue(EMPTY_WORKOUT_DATA)

    renderWithProvider()

    await act(async () => {
      screen.getByText('Sign In').click()
      await flush()
    })

    mockSaveToDrive.mockRejectedValueOnce(new Error('Network error'))

    await act(async () => {
      screen.getByText('Add Exercise').click()
      await flush()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('true')

    mockSaveToDrive.mockResolvedValueOnce({})

    await act(async () => {
      window.dispatchEvent(new Event('online'))
      await flush()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('false')
    expect(screen.getByTestId('syncStatus')).toHaveTextContent('idle')
    expect(mockSaveToDrive).toHaveBeenCalledWith('file1', expect.objectContaining({
      exercises: ['Bench Press'],
    }))
  })

  it('does not flush when not signed in', async () => {
    storage.savePendingSync()

    renderWithProvider()

    await act(async () => {
      window.dispatchEvent(new Event('online'))
      await flush()
    })

    expect(mockSaveToDrive).not.toHaveBeenCalled()
  })

  it('does not flush when online event fires but no pending sync', async () => {
    mockSignedIn = true
    mockFindOrCreateFile.mockResolvedValue({ folderId: 'f1', fileId: 'file1' })
    mockLoadFromDrive.mockResolvedValue(EMPTY_WORKOUT_DATA)

    renderWithProvider()

    await act(async () => {
      screen.getByText('Sign In').click()
      await flush()
    })

    mockSaveToDrive.mockClear()

    await act(async () => {
      window.dispatchEvent(new Event('online'))
      await flush()
    })

    expect(mockSaveToDrive).not.toHaveBeenCalled()
  })
})

describe('signOut clears pending sync', () => {
  it('clears pending sync flag on sign out', async () => {
    mockSignedIn = true
    mockFindOrCreateFile.mockResolvedValue({ folderId: 'f1', fileId: 'file1' })
    mockLoadFromDrive.mockResolvedValue(EMPTY_WORKOUT_DATA)

    renderWithProvider()

    await act(async () => {
      screen.getByText('Sign In').click()
      await flush()
    })

    mockSaveToDrive.mockRejectedValueOnce(new Error('fail'))

    await act(async () => {
      screen.getByText('Add Exercise').click()
      await flush()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('true')

    mockSignedIn = false
    await act(async () => {
      screen.getByText('Sign Out').click()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('false')
    expect(localStorage.getItem('workout-pending-sync')).toBeNull()
  })
})

describe('signIn clears pending sync', () => {
  it('clears pending sync after successful sign in and merge', async () => {
    storage.savePendingSync()

    mockSignedIn = true
    mockFindOrCreateFile.mockResolvedValue({ folderId: 'f1', fileId: 'file1' })
    mockLoadFromDrive.mockResolvedValue({
      exercises: ['Squats'],
      schedule: {},
      sessions: [],
    })

    renderWithProvider()

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('true')

    await act(async () => {
      screen.getByText('Sign In').click()
      await flush()
    })

    expect(screen.getByTestId('pendingSync')).toHaveTextContent('false')
  })
})
