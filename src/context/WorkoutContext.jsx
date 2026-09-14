import { createContext, useContext, useReducer, useEffect, useRef, useCallback, useState } from 'react'
import { EMPTY_WORKOUT_DATA } from '../types'
import { loadData, saveData } from '../storage'
import {
  isSignedIn,
  signIn as driveSignIn,
  signOut as driveSignOut,
  findOrCreateFile,
  loadFromDrive,
  saveToDrive,
} from '../googleDrive'

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
 * @typedef {'idle' | 'syncing' | 'error'} SyncStatus
 */

/**
 * @typedef {Object} WorkoutContextValue
 * @property {import('../types').WorkoutData} state
 * @property {React.Dispatch<WorkoutAction>} dispatch
 * @property {(clientId: string) => Promise<void>} signIn
 * @property {() => void} signOut
 * @property {SyncStatus} syncStatus
 * @property {boolean} signedIn
 */

/**
 * @param {import('../types').WorkoutData} local
 * @param {import('../types').WorkoutData} remote
 * @returns {import('../types').WorkoutData}
 */
export function mergeData(local, remote) {
  const exercises = [...local.exercises]
  for (const e of remote.exercises) {
    if (!exercises.includes(e)) exercises.push(e)
  }

  const schedule = { ...remote.schedule, ...local.schedule }

  const sessionMap = new Map()
  for (const s of remote.sessions) sessionMap.set(s.id, s)
  for (const s of local.sessions) sessionMap.set(s.id, s)
  const sessions = [...sessionMap.values()]

  return { exercises, schedule, sessions }
}

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
  const fileIdRef = useRef(null)
  const stateRef = useRef(state)
  const [syncStatus, setSyncStatus] = useState(/** @type {SyncStatus} */ ('idle'))
  const [signedIn, setSignedIn] = useState(() => isSignedIn())
  const skipSyncRef = useRef(false)

  stateRef.current = state

  useEffect(() => {
    saveData(state)
  }, [state])

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }
    if (!isSignedIn() || !fileIdRef.current) return
    setSyncStatus('syncing')
    saveToDrive(fileIdRef.current, state)
      .then(() => setSyncStatus('idle'))
      .catch(() => setSyncStatus('error'))
  }, [state])

  const signIn = useCallback(async (/** @type {string} */ clientId) => {
    await driveSignIn(clientId)
    setSignedIn(true)
    const { fileId } = await findOrCreateFile()
    fileIdRef.current = fileId
    const driveData = await loadFromDrive(fileId)
    const merged = mergeData(stateRef.current, driveData)
    skipSyncRef.current = true
    dispatch({ type: 'LOAD_DATA', payload: merged })
  }, [])

  const signOut = useCallback(() => {
    driveSignOut()
    fileIdRef.current = null
    setSignedIn(false)
    setSyncStatus('idle')
  }, [])

  return (
    <WorkoutContext.Provider
      value={{ state, dispatch, signIn, signOut, syncStatus, signedIn }}
    >
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
