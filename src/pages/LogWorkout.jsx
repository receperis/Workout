import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { DAYS_OF_WEEK } from '../types'

function LogWorkout() {
  const { day } = useParams()
  const [selectedDay, setSelectedDay] = useState(
    day || new Date().toLocaleString('en-US', { weekday: 'long' })
  )

  return (
    <div>
      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {DAYS_OF_WEEK.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <h1>Log Workout - {selectedDay}</h1>
    </div>
  )
}

export default LogWorkout
