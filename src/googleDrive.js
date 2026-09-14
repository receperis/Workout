const GIS_URL = 'https://accounts.google.com/gsi/client'
const GAPI_URL = 'https://apis.google.com/js/api.js'

function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error(`Failed to load ${url}`))
    document.head.appendChild(script)
  })
}

export function loadGIS() {
  return loadScript(GIS_URL)
}

export function loadGapi() {
  return new Promise((resolve, reject) => {
    loadScript(GAPI_URL)
      .then(() => {
        if (window.gapi) {
          window.gapi.load('client:picker', { onerror: reject, ontimeout: reject, callback: resolve })
        } else {
          reject(new Error('gapi not available after script load'))
        }
      })
      .catch(reject)
  })
}

export async function loadGoogleScripts() {
  await Promise.all([loadGIS(), loadGapi()])
}
