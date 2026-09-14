/**
 * @typedef {Object} WorkoutSet
 * @property {string} exercise - Name of the exercise
 * @property {PyramidRep} reps - Number of reps (15, 13, 11, 9, or 7)
 * @property {number} weight - Weight in kilograms
 */

/**
 * @typedef {Object} WorkoutSession
 * @property {string} id - UUID
 * @property {string} date - ISO date string (e.g. "2026-09-14")
 * @property {string} day - Day of the week (e.g. "Monday")
 * @property {WorkoutSet[]} sets - Array of sets completed
 */

/**
 * @typedef {Object} WorkoutData
 * @property {string[]} exercises - User-defined exercise names
 * @property {Record<string, string[]>} schedule - Day name -> exercise names
 * @property {WorkoutSession[]} sessions - All logged sessions
 */

/**
 * @typedef {15|13|11|9|7} PyramidRep
 */

/**
 * @typedef {'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'|'Sunday'} DayOfWeek
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} signedIn - Whether the user is signed in
 * @property {string|null} accessToken - Google OAuth access token
 */

export const PYRAMID_REPS = /** @type {const} */ ([15, 13, 11, 9, 7])

export const DAYS_OF_WEEK = /** @type {const} */ ([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
])

export const EMPTY_WORKOUT_DATA = /** @type {const} */ ({
  exercises: [],
  schedule: {},
  sessions: [],
})

/**
 * @param {unknown} value
 * @returns {value is WorkoutSet}
 */
export function isWorkoutSet(value) {
  if (typeof value !== 'object' || value === null) return false
  const obj = /** @type {Record<string, unknown>} */ (value)
  return (
    typeof obj.exercise === 'string' &&
    PYRAMID_REPS.includes(/** @type {PyramidRep} */ (obj.reps)) &&
    typeof obj.weight === 'number' &&
    obj.weight > 0
  )
}

/**
 * @param {unknown} value
 * @returns {value is WorkoutSession}
 */
export function isWorkoutSession(value) {
  if (typeof value !== 'object' || value === null) return false
  const obj = /** @type {Record<string, unknown>} */ (value)
  return (
    typeof obj.id === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.day === 'string' &&
    DAYS_OF_WEEK.includes(/** @type {DayOfWeek} */ (obj.day)) &&
    Array.isArray(obj.sets) &&
    obj.sets.every(isWorkoutSet)
  )
}

/**
 * @param {unknown} value
 * @returns {value is WorkoutData}
 */
export function isWorkoutData(value) {
  if (typeof value !== 'object' || value === null) return false
  const obj = /** @type {Record<string, unknown>} */ (value)
  return (
    Array.isArray(obj.exercises) &&
    obj.exercises.every((e) => typeof e === 'string') &&
    typeof obj.schedule === 'object' &&
    obj.schedule !== null &&
    Object.values(obj.schedule).every(
      (v) => Array.isArray(v) && v.every((e) => typeof e === 'string'),
    ) &&
    Array.isArray(obj.sessions) &&
    obj.sessions.every(isWorkoutSession)
  )
}
