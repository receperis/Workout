import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '../..')

describe('Tailwind CSS configuration', () => {
  it('@tailwindcss/vite is installed', () => {
    const pkg = JSON.parse(readFileSync(resolve(root, 'node_modules/@tailwindcss/vite/package.json'), 'utf-8'))
    expect(pkg.version).toBeDefined()
  })

  it('vite.config.js includes the tailwindcss plugin', () => {
    const config = readFileSync(resolve(root, 'vite.config.js'), 'utf-8')
    expect(config).toContain('@tailwindcss/vite')
    expect(config).toContain('tailwindcss()')
  })

  it('src/index.css imports tailwindcss', () => {
    const css = readFileSync(resolve(root, 'src/index.css'), 'utf-8')
    expect(css).toContain('@import "tailwindcss"')
  })
})
