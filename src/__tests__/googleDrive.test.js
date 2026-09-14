// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loadGIS, loadGapi, loadGoogleScripts } from '../googleDrive'

const GIS_URL = 'https://accounts.google.com/gsi/client'
const GAPI_URL = 'https://apis.google.com/js/api.js'

const flush = () => new Promise((r) => setTimeout(r, 0))

beforeEach(() => {
  document.head.innerHTML = ''
  delete window.gapi
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('loadGIS', () => {
  it('appends GIS script to document head', async () => {
    const loadPromise = loadGIS()
    const script = document.querySelector(`script[src="${GIS_URL}"]`)
    expect(script).not.toBeNull()
    expect(script.async).toBe(true)
    script.onload()
    await loadPromise
  })

  it('resolves immediately if script already exists', async () => {
    const existing = document.createElement('script')
    existing.src = GIS_URL
    document.head.appendChild(existing)
    await loadGIS()
    expect(document.querySelectorAll(`script[src="${GIS_URL}"]`).length).toBe(1)
  })

  it('rejects on script load error', async () => {
    const loadPromise = loadGIS()
    const script = document.querySelector(`script[src="${GIS_URL}"]`)
    script.onerror()
    await expect(loadPromise).rejects.toThrow(`Failed to load ${GIS_URL}`)
  })
})

describe('loadGapi', () => {
  it('loads gapi script and calls gapi.load', async () => {
    let gapiLoadCallback
    window.gapi = {
      load: vi.fn((_, opts) => {
        gapiLoadCallback = opts.callback
      }),
    }
    const loadPromise = loadGapi()
    const script = document.querySelector(`script[src="${GAPI_URL}"]`)
    expect(script).not.toBeNull()
    script.onload()
    await flush()
    gapiLoadCallback()
    await loadPromise
    expect(window.gapi.load).toHaveBeenCalledWith('client:picker', expect.any(Object))
  })

  it('rejects when gapi.load reports an error', async () => {
    window.gapi = {
      load: vi.fn((_, opts) => {
        opts.onerror()
      }),
    }
    const loadPromise = loadGapi()
    const script = document.querySelector(`script[src="${GAPI_URL}"]`)
    script.onload()
    await expect(loadPromise).rejects.toThrow()
  })

  it('rejects when gapi.load reports a timeout', async () => {
    window.gapi = {
      load: vi.fn((_, opts) => {
        opts.ontimeout()
      }),
    }
    const loadPromise = loadGapi()
    const script = document.querySelector(`script[src="${GAPI_URL}"]`)
    script.onload()
    await expect(loadPromise).rejects.toThrow()
  })

  it('rejects when gapi is not available after script load', async () => {
    const loadPromise = loadGapi()
    const script = document.querySelector(`script[src="${GAPI_URL}"]`)
    script.onload()
    await expect(loadPromise).rejects.toThrow('gapi not available after script load')
  })
})

describe('loadGoogleScripts', () => {
  it('loads both GIS and gapi in parallel', async () => {
    let gapiLoadCallback
    window.gapi = {
      load: vi.fn((_, opts) => {
        gapiLoadCallback = opts.callback
      }),
    }
    const promise = loadGoogleScripts()
    const scripts = document.querySelectorAll('script')
    expect(scripts.length).toBe(2)

    const gisScript = document.querySelector(`script[src="${GIS_URL}"]`)
    const gapiScript = document.querySelector(`script[src="${GAPI_URL}"]`)
    expect(gisScript).not.toBeNull()
    expect(gapiScript).not.toBeNull()

    gisScript.onload()
    gapiScript.onload()
    await flush()
    gapiLoadCallback()
    await promise
  })
})
