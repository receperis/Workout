const GIS_URL = 'https://accounts.google.com/gsi/client'
const GAPI_URL = 'https://apis.google.com/js/api.js'

let currentAccessToken = null
let tokenClient = null

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

export function initTokenClient(clientId) {
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services not loaded')
  }
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/drive.file',
    callback: () => {},
  })
  return tokenClient
}

export function signIn(clientId) {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services not loaded'))
      return
    }

    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: () => {},
      })
    }

    tokenClient.callback = (response) => {
      if (response.error) {
        reject(new Error(response.error))
        return
      }
      currentAccessToken = response.access_token
      resolve(response.access_token)
    }

    tokenClient.requestAccessToken({ prompt: '' })
  })
}

export async function signOut() {
  if (currentAccessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(currentAccessToken)
  }
  currentAccessToken = null
}

export function getAccessToken() {
  return currentAccessToken
}

export function isSignedIn() {
  return currentAccessToken !== null
}

export function resetAuth() {
  currentAccessToken = null
  tokenClient = null
}
