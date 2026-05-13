const KEY = 'instasport_auth'
const TTL_MS = 30 * 24 * 60 * 60 * 1000

interface Stored {
  token: string
  expiresAt: number
}

export function saveToken(token: string) {
  const payload: Stored = { token, expiresAt: Date.now() + TTL_MS }
  localStorage.setItem(KEY, JSON.stringify(payload))
}

export function loadToken(): string | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const { token, expiresAt }: Stored = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      localStorage.removeItem(KEY)
      return null
    }
    return token
  } catch {
    return null
  }
}

export function clearToken() {
  localStorage.removeItem(KEY)
}
