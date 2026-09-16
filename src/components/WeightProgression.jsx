import React from 'react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

import { useWorkout } from '../context/WorkoutContext'

function WeightProgression({ exercise }) {
  const { state: { sessions } } = useWorkout()
  const [dateRange, setDateRange] = React.useState('all')

  const now = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(now.getDate() - 30)
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(now.getDate() - 90)

  const cutoffDate = dateRange === '30d' ? thirtyDaysAgo : dateRange === '90d' ? ninetyDaysAgo : null

  const filteredSessions = sessions.filter((session) => {
    if (!cutoffDate) return session.sets.some((set) => set.exercise === exercise)
    const sessionDate = new Date(session.date)
    return sessionDate >= cutoffDate && session.sets.some((set) => set.exercise === exercise)
  })

  const data = filteredSessions
    .map((session) => ({
      date: session.date,
      weight: session.sets.find((set) => set.exercise === exercise)?.weight,
    }))
    .filter(
      (item) => item.date !== undefined && item.weight !== undefined && item.weight > 0,
    )

  return (
    <div style={{ width: '100%', height: 400 }}>
      <div className="mb-3">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All time</option>
          <option value="30d">30d</option>
          <option value="90d">90d</option>
        </select>
      </div>
      <LineChart data={data} width={400} height={400}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label="Weight (kg)" />
        <Tooltip
          content={({ activeItems }) => {
            if (!activeItems || activeItems.length === 0) return null
            const item = activeItems[0]
            const { payload } = item
            const date = payload && (payload.name || payload.x || payload.date)
            const weight = payload && (payload.value || payload.y || payload.weight)
            return (
              <div style={{ fontSize: 12, padding: 8, background: 'white', borderRadius: 4 }}>
                <span>Date: {date}</span>
                <span>Weight: {weight}kg</span>
              </div>
            )
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={true}
        />
      </LineChart>
    </div>
  )
}

export default WeightProgression
