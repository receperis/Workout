import { describe, it, expect } from 'vitest'

describe('installed dependencies', () => {
  it('react-router-dom exports expected APIs', async () => {
    const mod = await import('react-router-dom')
    expect(mod.BrowserRouter).toBeDefined()
    expect(mod.Routes).toBeDefined()
    expect(mod.Route).toBeDefined()
    expect(mod.Link).toBeDefined()
    expect(mod.useNavigate).toBeDefined()
  })

  it('recharts exports expected components', async () => {
    const mod = await import('recharts')
    expect(mod.LineChart).toBeDefined()
    expect(mod.Line).toBeDefined()
    expect(mod.XAxis).toBeDefined()
    expect(mod.YAxis).toBeDefined()
    expect(mod.CartesianGrid).toBeDefined()
    expect(mod.Tooltip).toBeDefined()
    expect(mod.Legend).toBeDefined()
    expect(mod.ResponsiveContainer).toBeDefined()
  })

  it('uuid exports v4 generator', async () => {
    const { v4 } = await import('uuid')
    expect(typeof v4).toBe('function')
    const id = v4()
    expect(typeof id).toBe('string')
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    )
  })

  it('tailwindcss is installed', async () => {
    const pkg = await import('tailwindcss/package.json', { with: { type: 'json' } })
    expect(pkg.default.version).toBeDefined()
  })
})
