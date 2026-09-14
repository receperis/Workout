// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { loadData, saveData, savePendingSync, loadPendingSync, clearPendingSync } from '../storage'
import { EMPTY_WORKOUT_DATA } from '../types'

beforeEach(() => {
  localStorage.clear()
})

describe('loadData', () => {
  it('returns empty data when nothing is stored', () => {
    expect(loadData()).toEqual(EMPTY_WORKOUT_DATA)
  })

  it('returns stored valid workout data', () => {
    const data = {
      exercises: ['Bench Press'],
      schedule: { Monday: ['Bench Press'] },
      sessions: [
        {
          id: 'abc-123',
          date: '2026-09-14',
          day: 'Monday',
          sets: [{ exercise: 'Bench Press', reps: 15, weight: 60 }],
        },
      ],
    }
    localStorage.setItem('workout-data', JSON.stringify(data))
    expect(loadData()).toEqual(data)
  })

  it('returns empty data when stored JSON is invalid', () => {
    localStorage.setItem('workout-data', 'not-json')
    expect(loadData()).toEqual(EMPTY_WORKOUT_DATA)
  })

  it('returns empty data when stored data fails validation', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({ exercises: 'not-array', schedule: {}, sessions: [] }),
    )
    expect(loadData()).toEqual(EMPTY_WORKOUT_DATA)
  })

  it('returns empty data when stored data has invalid session', () => {
    localStorage.setItem(
      'workout-data',
      JSON.stringify({
        exercises: [],
        schedule: {},
        sessions: [{ id: 123, date: 'x', day: 'x', sets: 'y' }],
      }),
    )
    expect(loadData()).toEqual(EMPTY_WORKOUT_DATA)
  })
})

describe('saveData', () => {
  it('saves data to localStorage', () => {
    const data = {
      exercises: ['Squats'],
      schedule: {},
      sessions: [],
    }
    saveData(data)
    expect(JSON.parse(localStorage.getItem('workout-data'))).toEqual(data)
  })

  it('overwrites existing data', () => {
    const data1 = {
      exercises: ['Bench Press'],
      schedule: {},
      sessions: [],
    }
    const data2 = {
      exercises: ['Squats'],
      schedule: { Friday: ['Squats'] },
      sessions: [],
    }
    saveData(data1)
    saveData(data2)
    expect(JSON.parse(localStorage.getItem('workout-data'))).toEqual(data2)
  })

  it('saves empty workout data', () => {
    saveData(EMPTY_WORKOUT_DATA)
    expect(JSON.parse(localStorage.getItem('workout-data'))).toEqual(
      EMPTY_WORKOUT_DATA,
    )
  })
})

describe('roundtrip', () => {
  it('save then load returns same data', () => {
    const data = {
      exercises: ['Bench Press', 'Squats'],
      schedule: { Monday: ['Bench Press'], Wednesday: ['Squats'] },
      sessions: [
        {
          id: 'test-id',
          date: '2026-09-14',
          day: 'Monday',
          sets: [
            { exercise: 'Bench Press', reps: 15, weight: 60 },
            { exercise: 'Bench Press', reps: 13, weight: 65 },
          ],
        },
      ],
    }
    saveData(data)
    expect(loadData()).toEqual(data)
  })
})

describe('savePendingSync', () => {
  it('sets pending sync flag in localStorage', () => {
    savePendingSync()
    expect(localStorage.getItem('workout-pending-sync')).toBe('true')
  })
})

describe('loadPendingSync', () => {
  it('returns false when no pending sync', () => {
    expect(loadPendingSync()).toBe(false)
  })

  it('returns true after savePendingSync', () => {
    savePendingSync()
    expect(loadPendingSync()).toBe(true)
  })
})

describe('clearPendingSync', () => {
  it('removes pending sync flag', () => {
    savePendingSync()
    expect(loadPendingSync()).toBe(true)
    clearPendingSync()
    expect(loadPendingSync()).toBe(false)
  })
})
