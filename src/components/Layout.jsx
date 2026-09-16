import React from 'react'
import { Link } from 'react-router-dom'

function HomeIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

function LogIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v3h2V4h4v16h4V10h2l3 3v7h2l-3 3h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM16 6H8c-1.1 0-2 .9-2 2v3h2v6h2v-6h2v3h2v-3h2v-6h2z" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M3 12a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-14a1 1 0 0 1-1-1v-5zM3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H3z" />
    </svg>
  )
}

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <div className="min-h-screen bg-background">
      <aside
        className="fixed left-0 top-0 h-full w-64 bg-sidebar text-sidebar-ink transition-transform duration-300 rtl:transition-transform rtl:transform-rtl"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="p-4 border-b border-border">
          <h2 className="font-medium text-lg text-sidebar-title">Workout Tracker</h2>
        </div>
        <nav className="flex flex-col py-4 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent/10 transition-colors"
            data-testid="dashboard-link"
          >
            <HomeIcon />
            Dashboard
          </Link>
          <Link
            to="/log"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent/10 transition-colors"
            data-testid="log-link"
          >
            <LogIcon />
            Log Workout
          </Link>
          <Link
            to="/progress"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent/10 transition-colors"
            data-testid="progress-link"
          >
            <ChartIcon />
            Progress
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent/10 transition-colors"
            data-testid="settings-link"
          >
            <SettingsIcon />
            Settings
          </Link>
        </nav>
      </aside>

      <main
        className="ml-64 pt-16 min-h-[calc(100vh_-_64px)] transition-all duration-300 rtl:ml-0 rtl:-mr-64"
        style={{ marginLeft: sidebarOpen ? '64px' : '0' }}
      >
        <header
          className="hidden @md:flex items-center justify-between border-b border-border px-6 py-3 bg-background"
        >
          <h1 className="font-semibold text-lg text-text-h">Workout Tracker</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center gap-2 p-1 rounded-md hover:bg-accent/10"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 18l7-7 7 7M5 6h14M5 12h14M5 18h14" />
            </svg>
          </button>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}