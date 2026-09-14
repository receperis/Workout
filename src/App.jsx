import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LogWorkout from './pages/LogWorkout'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/log">Log Workout</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogWorkout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  )
}

export default App
