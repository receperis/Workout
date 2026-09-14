import { useState } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { DAYS_OF_WEEK } from '../types'

function Settings() {
  const { state, dispatch, signedIn, signIn, signOut, syncStatus } = useWorkout()
  const [newExercise, setNewExercise] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [editValue, setEditValue] = useState('')
  const [clientId, setClientId] = useState(() => localStorage.getItem('google-drive-client-id') || '')

  function handleAdd(e) {
    e.preventDefault()
    const name = newExercise.trim()
    if (!name || state.exercises.includes(name)) return
    dispatch({ type: 'ADD_EXERCISE', payload: name })
    setNewExercise('')
  }

  function handleRemove(name) {
    dispatch({ type: 'REMOVE_EXERCISE', payload: name })
  }

  function startRename(index) {
    setEditingIndex(index)
    setEditValue(state.exercises[index])
  }

  function handleRename(index) {
    const oldName = state.exercises[index]
    const newName = editValue.trim()
    if (!newName || newName === oldName || state.exercises.includes(newName)) {
      setEditingIndex(-1)
      return
    }
    dispatch({ type: 'RENAME_EXERCISE', payload: { oldName, newName } })
    setEditingIndex(-1)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Exercises</h2>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="New exercise name"
            className="border rounded px-3 py-1 flex-1"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
            Add
          </button>
        </form>

        <ul className="divide-y border rounded">
          {state.exercises.length === 0 && (
            <li className="px-3 py-2 text-gray-500">No exercises yet.</li>
          )}
          {state.exercises.map((name, index) => (
            <li key={name} className="flex items-center gap-2 px-3 py-2">
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(index)
                      if (e.key === 'Escape') setEditingIndex(-1)
                    }}
                    className="border rounded px-2 py-1 flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => handleRename(index)}
                    className="text-green-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(-1)}
                    className="text-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">{name}</span>
                  <button
                    onClick={() => startRename(index)}
                    className="text-blue-500 text-sm"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleRemove(name)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Schedule</h2>
        {state.exercises.length === 0 ? (
          <p className="text-gray-500">Add exercises first to set a schedule.</p>
        ) : (
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day}>
                <h3 className="font-medium mb-1">{day}</h3>
                <div className="flex flex-wrap gap-2">
                  {state.exercises.map((exercise) => {
                    const checked = (state.schedule[day] || []).includes(exercise)
                    return (
                      <label
                        key={exercise}
                        className="flex items-center gap-1 text-sm border rounded px-2 py-1 cursor-pointer select-none"
                        style={checked ? { backgroundColor: '#dbeafe', borderColor: '#93c5fd' } : {}}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = state.schedule[day] || []
                            const next = checked
                              ? current.filter((e) => e !== exercise)
                              : [...current, exercise]
                            dispatch({ type: 'SET_SCHEDULE', payload: { ...state.schedule, [day]: next } })
                          }}
                        />
                        {exercise}
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Google Drive</h2>
        {signedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Disconnect Google Drive
            </button>
            <span className="text-sm text-gray-600">Connected</span>
            <span
              className="text-sm font-medium"
              style={syncStatus === 'syncing' ? { color: 'green' } : {}}
              data-testid="syncStatus"
            >
              {syncStatus}
            </span>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Google Client ID"
              aria-label="Google Client ID"
              className="border rounded px-2 py-1 text-sm w-32"
            />
            <button
              onClick={() => signIn(clientId || '')}
              className="bg-green-500 text-white px-4 py-1 rounded text-sm ml-1"
            >
              Connect Google Drive
            </button>
          </>
        )}
      </section>
    </div>
  )
}

export default Settings
