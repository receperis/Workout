import { useWorkout } from '../context/WorkoutContext'

function Progress() {
  const { state: { exercises, sessions } } = useWorkout()

  return (
    <div>
      <h1>Progress</h1>
      <select
        className="border rounded px-2 py-1"
      >
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))
        ) : (
          <option>No exercises added yet</option>
        )}
      </select>
      {exercises.length > 0 && sessions.length > 0 ? (
        <div className="mt-4">
          <h2>Last progress</h2>
          {exercises.map((exercise) => {
            const lastSet = sessions
              .slice()
              .reverse()
              .find((s) => s.sets.some((set) => set.exercise === exercise))
            const lastWeight = lastSet
              ?.sets.find((set) => set.exercise === exercise)
              ?.weight

            return lastWeight !== undefined ? (
              <p key={exercise}>
                {exercise}: {lastWeight} kg
              </p>
            ) : null
          })}
        </div>
      ) : null}
    </div>
  )
}

export default Progress
