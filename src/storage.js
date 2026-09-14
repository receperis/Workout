import { EMPTY_WORKOUT_DATA, isWorkoutData } from './types'

const STORAGE_KEY = 'workout-data'

/**
 * @returns {import('./types').WorkoutData}
 */
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return EMPTY_WORKOUT_DATA
    const parsed = JSON.parse(raw)
    if (!isWorkoutData(parsed)) return EMPTY_WORKOUT_DATA
    return parsed
  } catch {
    return EMPTY_WORKOUT_DATA
  }
}

/**
 * @param {import('./types').WorkoutData} data
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}
