'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-16" style={{ backgroundColor: '#111111', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <p className="font-serif text-2xl text-white font-semibold">Spice Garden</p>
          <p className="text-xs tracking-widest uppercase mt-1" style={{ color: '#C4973A', letterSpacing: '0.2em' }}>Management Portal</p>
        </div>
        <div>
          <h2 className="font-serif text-5xl font-semibold text-white leading-tight mb-6">
            Restaurant<br />Management<br />System
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6B6560' }}>
            Manage reservations, menu, tables, and your AI assistant from one central dashboard.
          </p>
        </div>
        <p className="text-xs" style={{ color: '#3a3a3a' }}>© 2026 Spice Garden</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <p className="font-serif text-3xl font-semibold text-white mb-2">Sign In</p>
          <p className="text-sm mb-10" style={{ color: '#6B6560' }}>Enter your credentials to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="admin" required
                className="w-full px-4 py-3.5 text-sm focus:outline-none"
                style={{ backgroundColor: '#242424', border: '1px solid #333', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3.5 text-sm focus:outline-none"
                style={{ backgroundColor: '#242424', border: '1px solid #333', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            {error && <p className="text-xs" style={{ color: '#E57373' }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-4 text-sm font-medium tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ backgroundColor: '#C4973A', color: '#1a1a1a', letterSpacing: '0.15em' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-xs mt-8 text-center" style={{ color: '#3a3a3a' }}>Default: admin / admin</p>
        </div>
      </div>
    </div>
  )
}
