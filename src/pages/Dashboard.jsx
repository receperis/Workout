import { useWorkout } from '../context/WorkoutContext'

function Dashboard() {
  const { state: { exercises, sessions } } = useWorkout()

  const uniqueExercises = [...new Set(exercises)]

  const lastWeightPerExercise = uniqueExercises.reduce((acc, exercise) => {
    for (let i = sessions.length - 1; i >= 0; i--) {
      const sets = sessions[i].sets
      const set = sets.find((s) => s.exercise === exercise)
      if (set) {
        acc[exercise] = set.weight
        break
      }
    }
    return acc
  }, {})

  const hasExercises = uniqueExercises.length > 0
  const hasSessions = sessions.length > 0

  return (
    <div>
      <h1>Dashboard</h1>
      {!hasExercises ? (
        <p className="text-gray-500 mb-4">No exercises yet.</p>
      ) : hasExercises && !hasSessions ? (
        <p className="text-gray-500 mb-4">No sessions yet.</p>
      ) : (
        <div>
          <h2>Last weight per exercise</h2>
          <ul>
            {uniqueExercises.map((exercise) => {
              const weight = lastWeightPerExercise[exercise]
              return weight !== undefined ? (
                <li key={exercise}>
                  {exercise}: {weight} kg
                </li>
              ) : null
            })}
          </ul>
          {!hasSessions && (
            <p className="text-gray-500 mt-2">No sessions yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
