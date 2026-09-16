import { useState } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { DAYS_OF_WEEK } from '../types'
import { generateSeedData } from '../data/seedData'

function SectionCard({ title, children }) {
  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div
        className="px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h2 style={{ color: 'var(--text-heading)', fontSize: '17px', fontWeight: 600 }}>
          {title}
        </h2>
      </div>
      <div className="px-5 py-4">
        {children}
      </div>
    </section>
  )
}

function Settings() {
  const { state, dispatch, signedIn, signIn, signOut, syncStatus } = useWorkout()
  const [newExercise, setNewExercise] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [editValue, setEditValue] = useState('')
  const [clientId, setClientId] = useState(() => localStorage.getItem('google-drive-client-id') || '')
  const [seedLoaded, setSeedLoaded] = useState(false)
  const [expandedDay, setExpandedDay] = useState(null)

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

  function handleLoadSampleData() {
    const data = generateSeedData()
    dispatch({ type: 'LOAD_DATA', payload: data })
    setSeedLoaded(true)
  }

  return (
    <div className="space-y-4">
      <h1 style={{ color: 'var(--text-heading)' }}>Settings</h1>

      <SectionCard title="Exercises">
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="New exercise name"
            className="flex-1 rounded-lg px-3 py-2.5 text-sm"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              color: 'var(--text-heading)',
            }}
          />
          <button
            type="submit"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Add
          </button>
        </form>

        {state.exercises.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No exercises yet.</p>
        ) : (
          <div className="space-y-2">
            {state.exercises.map((name, index) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                style={{ background: 'var(--surface-raised)' }}
              >
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
                      className="flex-1 rounded-lg px-3 py-2 text-sm"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-heading)',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => handleRename(index)}
                      className="text-sm font-medium px-3 py-1.5 rounded-lg"
                      style={{ color: '#059669' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(-1)}
                      className="text-sm font-medium px-3 py-1.5 rounded-lg"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm" style={{ color: 'var(--text-heading)' }}>{name}</span>
                    <button
                      onClick={() => startRename(index)}
                      className="text-sm font-medium px-3 py-1.5 rounded-lg"
                      style={{ color: 'var(--accent)' }}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleRemove(name)}
                      className="text-sm font-medium px-3 py-1.5 rounded-lg"
                      style={{ color: '#ef4444' }}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Schedule">
        {state.exercises.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Add exercises first to set a schedule.
          </p>
        ) : (
          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const dayExercises = state.schedule[day] || []
              const expanded = expandedDay === day
              return (
                <div
                  key={day}
                  className="rounded-lg overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <button
                    onClick={() => setExpandedDay(expanded ? null : day)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                    style={{ background: 'var(--surface-raised)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                        {day}
                      </span>
                      {dayExercises.length > 0 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'var(--accent)', color: '#fff' }}
                        >
                          {dayExercises.length}
                        </span>
                      )}
                    </div>
                    <svg
                      className="w-4 h-4 transition-transform"
                      style={{
                        color: 'var(--text-muted)',
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>

                  {expanded && (
                    <div className="p-3 flex flex-wrap gap-2" style={{ background: 'var(--surface)' }}>
                      {state.exercises.map((exercise) => {
                        const checked = dayExercises.includes(exercise)
                        return (
                          <label
                            key={exercise}
                            className="flex items-center gap-1.5 text-sm rounded-lg px-3 py-2 cursor-pointer select-none transition-colors"
                            style={{
                              background: checked ? 'var(--accent)' + '15' : 'var(--surface-raised)',
                              border: `1px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                              color: checked ? 'var(--accent)' : 'var(--text)',
                            }}
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
                              className="sr-only"
                            />
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center"
                              style={{
                                background: checked ? 'var(--accent)' : 'transparent',
                                border: `2px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                              }}
                            >
                              {checked && (
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                                  <path d="M5 12l5 5L20 7" />
                                </svg>
                              )}
                            </div>
                            {exercise}
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Sample Data">
        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Load 2 weeks of sample workout data to see how charts and progress tracking work.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadSampleData}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold"
            style={{
              background: 'var(--surface-raised)',
              color: 'var(--text-heading)',
              border: '1px solid var(--border)',
            }}
          >
            Load Sample Data
          </button>
          {seedLoaded && (
            <span className="text-sm font-medium" style={{ color: '#059669' }}>Loaded!</span>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Google Drive">
        {signedIn ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut()}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold"
              style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}
            >
              Disconnect
            </button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Connected</span>
            <span
              className="text-sm font-medium"
              style={{ color: syncStatus === 'syncing' ? '#059669' : 'var(--text-muted)' }}
              data-testid="syncStatus"
            >
              {syncStatus}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Google Client ID"
              aria-label="Google Client ID"
              className="w-full rounded-lg px-3 py-2.5 text-sm"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text-heading)',
              }}
            />
            <button
              onClick={() => signIn(clientId || '')}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold"
              style={{ background: '#059669', color: '#fff' }}
            >
              Connect Google Drive
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

export default Settings
