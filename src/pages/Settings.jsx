import { useState } from 'react'
import { useWorkout } from '../context/WorkoutContext'

function Settings() {
  const { state, dispatch } = useWorkout()
  const [newExercise, setNewExercise] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [editValue, setEditValue] = useState('')

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
    </div>
  )
}

export default Settings
