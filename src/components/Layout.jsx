import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    testId: 'dashboard-link',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    to: '/log',
    label: 'Log',
    testId: 'log-link',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v3h2V4h4v16h4V10h2l3 3v7h2l-3 3h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM16 6H8c-1.1 0-2 .9-2 2v3h2v6h2v-6h2v3h2v-3h2v-6h2z" />
      </svg>
    ),
  },
  {
    to: '/progress',
    label: 'Progress',
    testId: 'progress-link',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17l4-4 4 4 8-8M3 12l4-4 4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    testId: 'settings-link',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7zm7.43-2.53l1.57-.91-1-1.73-1.82.53a7.1 7.1 0 0 0-1.23-.71l-.28-1.92h-2l-.28 1.92a7.1 7.1 0 0 0-1.23.71l-1.82-.53-1 1.73 1.57.91c-.06.37-.09.75-.09 1.13s.03.76.09 1.13l-1.57.91 1 1.73 1.82-.53c.38.28.79.5 1.23.71l.28 1.92h2l.28-1.92c.44-.21.85-.43 1.23-.71l1.82.53 1-1.73-1.57-.91c.06-.37.09-.75.09-1.13s-.03-.76-.09-1.13z" />
      </svg>
    ),
  },
]

function BottomTabBar() {
  const location = useLocation()

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              data-testid={item.testId}
              className="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
              style={{
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                minWidth: 0,
              }}
            >
              {item.icon}
              <span className="text-xs mt-0.5 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function Sidebar({ open, onClose }) {
  const location = useLocation()

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className="fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 md:translate-x-0 md:z-30"
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 style={{ color: 'var(--text-heading)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Workout Tracker
          </h1>
        </div>
        <nav className="flex flex-col py-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                data-testid={item.testId}
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors"
                style={{
                  color: active ? 'var(--accent)' : 'var(--text)',
                  background: active ? 'var(--accent)' + '10' : 'transparent',
                }}
              >
                {item.icon}
                {item.label === 'Log' ? 'Log Workout' : item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-64">
        <header
          className="hidden md:flex items-center justify-between px-6 py-3"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text)' }}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Workout Tracker</h1>
          <div className="w-9" />
        </header>

        <main className="p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </main>
      </div>

      <BottomTabBar />
    </div>
  )
}
