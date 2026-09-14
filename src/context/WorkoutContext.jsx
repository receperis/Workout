import { createContext, useContext, useReducer, useEffect } from 'react'
import { EMPTY_WORKOUT_DATA } from '../types'
import { loadData, saveData } from '../storage'

const WorkoutContext = createContext(/** @type {import('react').Context<WorkoutContextValue | null>} */ (null))

/**
 * @typedef {'ADD_EXERCISE' | 'REMOVE_EXERCISE' | 'LOG_SESSION' | 'SET_SCHEDULE' | 'LOAD_DATA'} WorkoutActionType
 */

/**
 * @typedef {Object} WorkoutAction
 * @property {WorkoutActionType} type
 * @property {*} [payload]
 */

/**
 * @typedef {Object} WorkoutContextValue
 * @property {import('../types').WorkoutData} state
 * @property {React.Dispatch<WorkoutAction>} dispatch
 */

/**
 * @param {import('../types').WorkoutData} state
 * @param {WorkoutAction} action
 * @returns {import('../types').WorkoutData}
 */
function workoutReducer(state, action) {
  switch (action.type) {
    case 'ADD_EXERCISE':
      return {
        ...state,
        exercises: [...state.exercises, action.payload],
      }

    case 'REMOVE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.filter((e) => e !== action.payload),
      }

    case 'LOG_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
      }

    case 'SET_SCHEDULE':
      return {
        ...state,
        schedule: action.payload,
      }

    case 'LOAD_DATA':
      return action.payload

    default:
      return state
  }
}

/**
 * @param {{ children: React.ReactNode }} props
 */
export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, EMPTY_WORKOUT_DATA, loadData)

  useEffect(() => {
    saveData(state)
  }, [state])

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (context === null) {
    throw new Error('useWorkout must be used within a WorkoutProvider')
  }
  return context
}
