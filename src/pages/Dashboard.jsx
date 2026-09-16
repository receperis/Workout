import { Link } from 'react-router-dom'
import { useWorkout } from '../context/WorkoutContext'
import WeightProgression from '../components/WeightProgression'

function Dashboard() {
  const { state: { schedule, sessions } } = useWorkout()

  const today = new Date().toLocaleString('en-US', { weekday: 'long' })
  const todaySlug = today.toLowerCase()
  const exercisesForToday = schedule[today] || []

  const hasExerciseData = (exercise) =>
    sessions.some((s) => s.sets.some((set) => set.exercise === exercise))

  return (
    <div className="space-y-5">
      <div>
        <h1 style={{ color: 'var(--text-heading)' }}>{today}</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
          {exercisesForToday.length === 0
            ? 'No exercises scheduled today'
            : `${exercisesForToday.length} exercise${exercisesForToday.length > 1 ? 's' : ''} today`}
        </p>
      </div>

      {exercisesForToday.length === 0 ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p style={{ color: 'var(--text-muted)' }}>
            No exercises scheduled for today. Go to Settings to set up your schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {exercisesForToday.map((exercise) => (
            <div
              key={exercise}
              className="rounded-xl p-4"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <h3
                className="mb-3"
                style={{ color: 'var(--text-heading)', fontSize: '16px', fontWeight: 600 }}
              >
                {exercise}
              </h3>
              {hasExerciseData(exercise) ? (
                <WeightProgression exercise={exercise} compact />
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No session data yet for {exercise}.
                </p>
              )}
            </div>
          ))}

          <Link
            to={`/log/${todaySlug}`}
            className="flex items-center justify-center w-full rounded-xl py-3.5 text-base font-semibold transition-colors"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(232, 93, 42, 0.3)',
            }}
          >
            Log Today
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
