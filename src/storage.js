import { EMPTY_WORKOUT_DATA, isWorkoutData } from './types'

const STORAGE_KEY = 'workout-data'
const PENDING_SYNC_KEY = 'workout-pending-sync'

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

/**
 * Mark that there are unsynced changes pending Drive upload.
 */
export function savePendingSync() {
  try {
    localStorage.setItem(PENDING_SYNC_KEY, 'true')
  } catch {
    // Silently fail
  }
}

/**
 * @returns {boolean}
 */
export function loadPendingSync() {
  try {
    return localStorage.getItem(PENDING_SYNC_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Clear the pending sync flag after successful upload.
 */
export function clearPendingSync() {
  try {
    localStorage.removeItem(PENDING_SYNC_KEY)
  } catch {
    // Silently fail
  }
}
