// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'

afterEach(() => {
  localStorage.clear()
})

function renderWithLayout(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Layout />
    </MemoryRouter>,
  )
}

describe('Layout', () => {
  it('renders sidebar with 4 navigation links', () => {
    const { container } = renderWithLayout()
    const sidebar = container.querySelector('aside')
    expect(sidebar).not.toBeNull()
    const links = sidebar.querySelectorAll('a')
    expect(links).toHaveLength(4)
  })

  it('renders dashboard link with icon', () => {
    const { container } = renderWithLayout()
    const sidebar = container.querySelector('aside')
    const dashboardLink = sidebar.querySelector('a[href="/"]')
    expect(dashboardLink).not.toBeNull()
    expect(dashboardLink.textContent).toContain('Dashboard')
    const icon = dashboardLink.querySelector('svg')
    expect(icon).not.toBeNull()
  })

  it('renders log workout link with icon', () => {
    const { container } = renderWithLayout()
    const sidebar = container.querySelector('aside')
    const logLink = sidebar.querySelector('a[href="/log"]')
    expect(logLink).not.toBeNull()
    expect(logLink.textContent).toContain('Log Workout')
    const icon = logLink.querySelector('svg')
    expect(icon).not.toBeNull()
  })

  it('renders progress link with icon', () => {
    const { container } = renderWithLayout()
    const sidebar = container.querySelector('aside')
    const progressLink = sidebar.querySelector('a[href="/progress"]')
    expect(progressLink).not.toBeNull()
    expect(progressLink.textContent).toContain('Progress')
    const icon = progressLink.querySelector('svg')
    expect(icon).not.toBeNull()
  })

  it('renders settings link with icon', () => {
    const { container } = renderWithLayout()
    const sidebar = container.querySelector('aside')
    const settingsLink = sidebar.querySelector('a[href="/settings"]')
    expect(settingsLink).not.toBeNull()
    expect(settingsLink.textContent).toContain('Settings')
    const icon = settingsLink.querySelector('svg')
    expect(icon).not.toBeNull()
  })

  it('renders toggle sidebar button in header', () => {
    const { container } = renderWithLayout()
    const header = container.querySelector('header')
    const btn = header.querySelector('button')
    expect(btn).not.toBeNull()
    expect(btn.getAttribute('aria-label')).toBe('Toggle sidebar')
  })

  it('applies hover styles on sidebar links', () => {
    const { container } = renderWithLayout()
    const sidebar = container.querySelector('aside')
    const links = sidebar.querySelectorAll('a')
    expect(links).toHaveLength(4)
    links.forEach((link) => {
      expect(link.getAttribute('class')).toContain('hover:bg-accent/10')
    })
  })
})