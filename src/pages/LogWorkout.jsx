import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { DAYS_OF_WEEK } from '../types'
import { useWorkout } from '../context/WorkoutContext'
import ExerciseCard from '../components/ExerciseCard'

function LogWorkout() {
  const { day } = useParams()
  const { state, dispatch } = useWorkout()
  const [selectedDay, setSelectedDay] = useState(
    day || new Date().toLocaleString('en-US', { weekday: 'long' }),
  )
  const [exerciseSets, setExerciseSets] = useState({})
  const [saved, setSaved] = useState(false)

  const exercisesForDay = state.schedule[selectedDay] || []

  const handleExerciseChange = (exerciseName, sets) => {
    setExerciseSets((prev) => ({ ...prev, [exerciseName]: sets }))
    setSaved(false)
  }

  const grandTotal = exercisesForDay.reduce((sum, exercise) => {
    const sets = exerciseSets[exercise] || []
    return sum + sets.reduce((s, set) => s + set.reps * set.weight, 0)
  }, 0)

  const hasAnyWeights = Object.values(exerciseSets).some((sets) =>
    sets.some((s) => s.weight > 0),
  )

  const handleSave = () => {
    const allSets = exercisesForDay.flatMap((exercise) => {
      const sets = exerciseSets[exercise] || []
      return sets.filter((s) => s.weight > 0)
    })

    if (allSets.length === 0) return

    dispatch({
      type: 'LOG_SESSION',
      payload: {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        day: selectedDay,
        sets: allSets,
      },
    })

    setSaved(true)
    setExerciseSets({})
  }

  return (
    <div className="space-y-5">
      <h1 style={{ color: 'var(--text-heading)' }}>Log Workout</h1>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {DAYS_OF_WEEK.map((d) => {
          const active = d === selectedDay
          return (
            <button
              key={d}
              onClick={() => { setSelectedDay(d); setSaved(false) }}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: active ? 'var(--accent)' : 'var(--surface)',
                color: active ? '#fff' : 'var(--text)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {d.slice(0, 3)}
            </button>
          )
        })}
      </div>

      {exercisesForDay.length === 0 ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p style={{ color: 'var(--text-muted)' }}>
            No exercises assigned to this day. Go to Settings to set up your schedule.
          </p>
        </div>
      ) : (
        <>
          {grandTotal > 0 && (
            <div
              className="flex items-center justify-between rounded-xl px-5 py-3"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <span className="text-sm font-medium opacity-90">Session Total</span>
              <span className="text-xl font-bold tabular-nums">{grandTotal.toLocaleString()} kg</span>
            </div>
          )}

          <div className="space-y-4">
            {exercisesForDay.map((exercise) => (
              <ExerciseCard
                key={exercise}
                exerciseName={exercise}
                onChange={(sets) => handleExerciseChange(exercise, sets)}
              />
            ))}
          </div>

          {hasAnyWeights && (
            <button
              onClick={handleSave}
              className="w-full rounded-xl py-4 text-base font-semibold transition-colors"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(232, 93, 42, 0.3)',
              }}
            >
              Save Session
            </button>
          )}

          {saved && (
            <div
              className="rounded-xl px-4 py-3 text-center font-medium text-sm"
              style={{ background: '#d1fae5', color: '#065f46' }}
            >
              Session saved!
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LogWorkout
