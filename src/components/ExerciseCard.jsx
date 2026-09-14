import { PYRAMID_REPS } from '../types'

function ExerciseCard() {
  return (
    <div className="space-y-2">
      {PYRAMID_REPS.map((reps) => (
        <div
          key={reps}
          className="flex items-center gap-2 px-4 py-2 border rounded-md"
        >
          <span className="font-medium text-lg">{reps}</span>
          <span className="text-sm text-gray-500">reps</span>
        </div>
      ))}
    </div>
  )
}

export default ExerciseCard