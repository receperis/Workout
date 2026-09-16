import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LogWorkout from './pages/LogWorkout'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import { Layout } from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogWorkout />} />
        <Route path="/log/:day" element={<LogWorkout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
