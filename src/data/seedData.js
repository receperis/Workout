const EXERCISES = ['Bench Press', 'Squats', 'Deadlift', 'Overhead Press']

const SCHEDULE = {
  Monday: ['Bench Press', 'Squats'],
  Wednesday: ['Deadlift', 'Overhead Press'],
  Friday: ['Bench Press', 'Squats'],
}

const PYRAMID_REPS = [15, 13, 11, 9, 7]

function dateStr(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

function dayName(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleString('en-US', { weekday: 'long' })
}

function makeSession(daysAgo, exerciseWeights) {
  const sets = []
  for (const [exercise, baseWeights] of Object.entries(exerciseWeights)) {
    for (let i = 0; i < PYRAMID_REPS.length; i++) {
      sets.push({
        exercise,
        reps: PYRAMID_REPS[i],
        weight: baseWeights[i],
      })
    }
  }
  return {
    id: `seed-${daysAgo}-${Math.random().toString(36).slice(2, 8)}`,
    date: dateStr(daysAgo),
    day: dayName(daysAgo),
    sets,
  }
}

export function generateSeedData() {
  const sessions = [
    // Week 1 - Monday (13 days ago)
    makeSession(13, {
      'Bench Press': [40, 45, 50, 55, 60],
      Squats: [60, 70, 80, 90, 100],
    }),
    // Week 1 - Wednesday (11 days ago)
    makeSession(11, {
      Deadlift: [80, 90, 100, 110, 120],
      'Overhead Press': [25, 30, 35, 40, 45],
    }),
    // Week 1 - Friday (9 days ago)
    makeSession(9, {
      'Bench Press': [42, 47, 52, 57, 62],
      Squats: [62, 72, 82, 92, 102],
    }),

    // Week 2 - Monday (6 days ago)
    makeSession(6, {
      'Bench Press': [45, 50, 55, 60, 65],
      Squats: [65, 75, 85, 95, 105],
    }),
    // Week 2 - Wednesday (4 days ago)
    makeSession(4, {
      Deadlift: [85, 95, 105, 115, 125],
      'Overhead Press': [27, 32, 37, 42, 47],
    }),
    // Week 2 - Friday (2 days ago)
    makeSession(2, {
      'Bench Press': [47, 52, 57, 62, 67],
      Squats: [67, 77, 87, 97, 107],
    }),
  ]

  return {
    exercises: EXERCISES,
    schedule: SCHEDULE,
    sessions,
  }
}
