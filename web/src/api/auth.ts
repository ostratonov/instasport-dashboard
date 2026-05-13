const BASE = `https://instasport.co/club/${import.meta.env.VITE_CLUB_CODE}/api/v1`

export interface LoginCredentials {
  email: string
  password: string
}

export async function login({ email, password }: LoginCredentials): Promise<string> {
  const body = new FormData()
  body.append('key', import.meta.env.VITE_CLUB_KEY)
  body.append('code', import.meta.env.VITE_CLUB_CODE)
  body.append('email', email)
  body.append('password', password)

  const res = await fetch(`${BASE}/email/login/`, { method: 'POST', body })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Login failed (${res.status})`)
  }

  const data = await res.json()

  if (!data.token) throw new Error('No token in response')

  return data.token
}
