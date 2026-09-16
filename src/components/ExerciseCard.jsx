import { useState, useEffect } from 'react'
import { PYRAMID_REPS } from '../types'

const REP_ACCENT = {
  15: 'var(--rep-15)',
  13: 'var(--rep-13)',
  11: 'var(--rep-11)',
  9: 'var(--rep-9)',
  7: 'var(--rep-7)',
}

function ExerciseCard({ exerciseName, onChange, initialSets }) {
  const [weights, setWeights] = useState(() =>
    PYRAMID_REPS.map((reps) => {
      const existing = initialSets?.find((s) => s.reps === reps)
      return existing?.weight || ''
    }),
  )

  useEffect(() => {
    const sets = PYRAMID_REPS.map((reps, i) => ({
      exercise: exerciseName,
      reps,
      weight: weights[i] === '' ? 0 : Number(weights[i]),
    }))
    onChange(sets)
  }, [weights, exerciseName])

  const total = weights.reduce((sum, w, i) => {
    const weight = w === '' ? 0 : Number(w)
    return sum + PYRAMID_REPS[i] * weight
  }, 0)

  const handleChange = (index, value) => {
    setWeights((prev) => {
      const next = [...prev]
      next[index] = value === '' ? '' : Math.max(0, Number(value))
      return next
    })
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--accent)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="px-5 pt-4 pb-2">
        <h3 style={{ color: 'var(--text-heading)', fontSize: '17px', fontWeight: 600 }}>
          {exerciseName}
        </h3>
      </div>

      <div className="px-5 pb-3 space-y-2">
        {PYRAMID_REPS.map((reps, i) => (
          <div
            key={reps}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            style={{ background: 'var(--surface-raised)' }}
          >
            <span
              className="text-lg font-bold w-8 text-right shrink-0 tabular-nums"
              style={{ color: REP_ACCENT[reps] }}
            >
              {reps}
            </span>
            <input
              type="number"
              min="0"
              className="flex-1 rounded-lg px-3 py-2.5 text-base tabular-nums outline-none"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-heading)',
              }}
              aria-label={`${exerciseName} ${reps} reps weight`}
              value={weights[i]}
              onChange={(e) => handleChange(i, e.target.value)}
            />
            <span className="text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>kg</span>
          </div>
        ))}
      </div>

      <div
        className="px-5 py-3 text-right font-semibold text-base"
        style={{
          background: 'var(--surface-raised)',
          borderTop: '1px solid var(--border)',
          color: total > 0 ? 'var(--accent)' : 'var(--text-muted)',
        }}
      >
        Total: {total.toLocaleString()} kg
      </div>
    </div>
  )
}

export default ExerciseCard
