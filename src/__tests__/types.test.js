import { describe, it, expect } from 'vitest'
import {
  PYRAMID_REPS,
  DAYS_OF_WEEK,
  EMPTY_WORKOUT_DATA,
  isWorkoutSet,
  isWorkoutSession,
  isWorkoutData,
} from '../types'

describe('constants', () => {
  it('PYRAMID_REPS contains exactly 15, 13, 11, 9, 7', () => {
    expect(PYRAMID_REPS).toEqual([15, 13, 11, 9, 7])
  })

  it('DAYS_OF_WEEK has all 7 days in order', () => {
    expect(DAYS_OF_WEEK).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ])
  })

  it('EMPTY_WORKOUT_DATA has empty exercises, schedule, and sessions', () => {
    expect(EMPTY_WORKOUT_DATA).toEqual({
      exercises: [],
      schedule: {},
      sessions: [],
    })
  })
})

describe('isWorkoutSet', () => {
  it('returns true for a valid set', () => {
    expect(
      isWorkoutSet({ exercise: 'Bench Press', reps: 15, weight: 60 }),
    ).toBe(true)
  })

  it('returns true for each valid pyramid rep', () => {
    for (const reps of PYRAMID_REPS) {
      expect(isWorkoutSet({ exercise: 'Squat', reps, weight: 100 })).toBe(true)
    }
  })

  it('returns false for invalid reps', () => {
    expect(
      isWorkoutSet({ exercise: 'Squat', reps: 10, weight: 100 }),
    ).toBe(false)
  })

  it('returns false for negative weight', () => {
    expect(
      isWorkoutSet({ exercise: 'Squat', reps: 15, weight: -10 }),
    ).toBe(false)
  })

  it('returns false for zero weight', () => {
    expect(isWorkoutSet({ exercise: 'Squat', reps: 15, weight: 0 })).toBe(
      false,
    )
  })

  it('returns false for non-object inputs', () => {
    expect(isWorkoutSet(null)).toBe(false)
    expect(isWorkoutSet(undefined)).toBe(false)
    expect(isWorkoutSet('string')).toBe(false)
    expect(isWorkoutSet(42)).toBe(false)
  })

  it('returns false when exercise is missing', () => {
    expect(isWorkoutSet({ reps: 15, weight: 60 })).toBe(false)
  })

  it('returns false when reps is missing', () => {
    expect(isWorkoutSet({ exercise: 'Bench Press', weight: 60 })).toBe(false)
  })

  it('returns false when weight is missing', () => {
    expect(isWorkoutSet({ exercise: 'Bench Press', reps: 15 })).toBe(false)
  })
})

describe('isWorkoutSession', () => {
  const validSession = {
    id: 'abc-123',
    date: '2026-09-14',
    day: 'Monday',
    sets: [{ exercise: 'Bench Press', reps: 15, weight: 60 }],
  }

  it('returns true for a valid session', () => {
    expect(isWorkoutSession(validSession)).toBe(true)
  })

  it('returns true for a session with empty sets', () => {
    expect(isWorkoutSession({ ...validSession, sets: [] })).toBe(true)
  })

  it('returns true for all days of the week', () => {
    for (const day of DAYS_OF_WEEK) {
      expect(isWorkoutSession({ ...validSession, day })).toBe(true)
    }
  })

  it('returns false for an invalid day', () => {
    expect(isWorkoutSession({ ...validSession, day: 'Funday' })).toBe(false)
  })

  it('returns false when id is missing', () => {
    const { id: _, ...rest } = validSession
    expect(isWorkoutSession(rest)).toBe(false)
  })

  it('returns false when date is missing', () => {
    const { date: _, ...rest } = validSession
    expect(isWorkoutSession(rest)).toBe(false)
  })

  it('returns false when day is missing', () => {
    const { day: _, ...rest } = validSession
    expect(isWorkoutSession(rest)).toBe(false)
  })

  it('returns false when sets is not an array', () => {
    expect(isWorkoutSession({ ...validSession, sets: 'not array' })).toBe(false)
  })

  it('returns false when sets contains an invalid set', () => {
    expect(
      isWorkoutSession({
        ...validSession,
        sets: [{ exercise: 'Bench', reps: 10, weight: 60 }],
      }),
    ).toBe(false)
  })

  it('returns false for non-object inputs', () => {
    expect(isWorkoutSession(null)).toBe(false)
    expect(isWorkoutSession(undefined)).toBe(false)
  })
})

describe('isWorkoutData', () => {
  const validData = {
    exercises: ['Bench Press', 'Squat'],
    schedule: {
      Monday: ['Bench Press'],
      Wednesday: ['Squat'],
    },
    sessions: [
      {
        id: 'abc-123',
        date: '2026-09-14',
        day: 'Monday',
        sets: [{ exercise: 'Bench Press', reps: 15, weight: 60 }],
      },
    ],
  }

  it('returns true for valid workout data', () => {
    expect(isWorkoutData(validData)).toBe(true)
  })

  it('returns true for empty data', () => {
    expect(isWorkoutData(EMPTY_WORKOUT_DATA)).toBe(true)
  })

  it('returns false when exercises is not an array', () => {
    expect(isWorkoutData({ ...validData, exercises: 'not array' })).toBe(false)
  })

  it('returns false when exercises contains non-strings', () => {
    expect(isWorkoutData({ ...validData, exercises: [123] })).toBe(false)
  })

  it('returns false when schedule is not an object', () => {
    expect(isWorkoutData({ ...validData, schedule: 'not object' })).toBe(false)
  })

  it('returns false when schedule values are not string arrays', () => {
    expect(
      isWorkoutData({ ...validData, schedule: { Monday: [123] } }),
    ).toBe(false)
  })

  it('returns false when sessions is not an array', () => {
    expect(isWorkoutData({ ...validData, sessions: 'not array' })).toBe(false)
  })

  it('returns false when sessions contains an invalid session', () => {
    expect(
      isWorkoutData({
        ...validData,
        sessions: [{ id: 123, date: 'x', day: 'x', sets: 'y' }],
      }),
    ).toBe(false)
  })

  it('returns false for non-object inputs', () => {
    expect(isWorkoutData(null)).toBe(false)
    expect(isWorkoutData(undefined)).toBe(false)
  })
})
