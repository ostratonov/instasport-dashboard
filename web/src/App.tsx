import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { EyeIcon } from './components/icons/EyeIcon'
import { login } from './api/auth'
import { saveToken, loadToken, clearToken } from './utils/token'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [authed, setAuthed] = useState(() => !!loadToken())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleLogout() {
    clearToken()
    setAuthed(false)
  }

  if (authed) return <Dashboard onLogout={handleLogout} />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const token = await login({ email, password })
      saveToken(token)
      setAuthed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setAuthed(true) // for testing
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="brand-header">
        <img src='../public/kult.svg' alt='kult' width={100} height={100}></img>
        <span className="brand-name">Kult</span>
      </div>

      <div className="card">
        <h1 className="card-title">Sign In</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="vovanchik@blackbelt.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <div className="label-row">
              <label className="label" htmlFor="password">Password</label>
              <a href="#" className="forgot">Forgot password?</a>
            </div>
            <div className="input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={e => setKeepLoggedIn(e.target.checked)}
            />
            Keep me logged in
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In  →'}
          </button>
        </form>

        <hr className="divider" />

        <p className="contact-text">
          Don't have an account?{' '}
          <a href="#">Contact Administration</a>
        </p>
      </div>

      <footer className="footer">
        <a href="#">Help Center</a>
        <span>|</span>
        <a href="#">Privacy Policy</a>
      </footer>
    </div>
  )
}
