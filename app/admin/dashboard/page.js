'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/admin/Sidebar'

export default function DashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
    const interval = setInterval(fetchBookings, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchBookings() {
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch { } finally {
      setLoading(false)
    }
  }

  const newBookings = bookings.filter(b => b.isNew)

  const stats = [
    { label: 'Total Reservations', value: bookings.length },
    { label: 'New Today', value: newBookings.length },
    { label: 'Tables Available', value: 8 },
    { label: 'Menu Items', value: 18 },
  ]

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-white mb-1">Dashboard</h1>
            <p className="text-sm" style={{ color: '#6B6560' }}>Welcome back, Administrator</p>
          </div>
          <button onClick={fetchBookings}
            className="px-5 py-2.5 text-xs font-medium tracking-widest uppercase transition-all hover:opacity-80"
            style={{ border: '1px solid #333', color: '#6B6560', letterSpacing: '0.1em' }}>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(stat => (
            <div key={stat.label} className="p-6" style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
              <p className="font-serif text-4xl font-semibold text-white mb-2">{stat.value}</p>
              <p className="text-xs tracking-widest uppercase" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Reservations */}
        <div className="mb-8" style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
          <div className="flex justify-between items-center px-6 py-5" style={{ borderBottom: '1px solid #222' }}>
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Recent Reservations</h2>
              {newBookings.length > 0 && (
                <p className="text-xs mt-1" style={{ color: '#C4973A' }}>{newBookings.length} new reservation{newBookings.length > 1 ? 's' : ''} received</p>
              )}
            </div>
            <a href="/admin/dashboard/bookings" className="text-xs tracking-widest uppercase" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>
              View All
            </a>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm" style={{ color: '#3a3a3a' }}>Loading reservations...</div>
          ) : bookings.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm" style={{ color: '#3a3a3a' }}>No reservations yet. They will appear here when customers book via the AI assistant.</div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#1f1f1f' }}>
              {bookings.slice(0, 6).map(b => (
                <div key={b.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    {b.isNew && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C4973A' }} />}
                    <div>
                      <p className="text-sm font-medium text-white">{b.guest}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6560' }}>Table {b.table} · {b.date} at {b.time} · {b.guests} guests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xs" style={{ color: '#6B6560' }}>{b.phone}</p>
                    <span className="text-xs px-3 py-1 font-medium" style={{
                      backgroundColor: b.status === 'Confirmed' ? '#0f1f0f' : '#1f1a0f',
                      color: b.status === 'Confirmed' ? '#4CAF50' : '#FFC107',
                      border: `1px solid ${b.status === 'Confirmed' ? '#1a3a1a' : '#3a2f0a'}`
                    }}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { href: '/admin/dashboard/dishes', label: 'Manage Menu', desc: 'Add, edit and remove dishes' },
            { href: '/admin/dashboard/tables', label: 'Manage Tables', desc: 'Update table availability' },
            { href: '/admin/dashboard/settings', label: 'AI Instructions', desc: 'Customize chatbot behavior' },
          ].map(action => (
            <a key={action.href} href={action.href}
              className="p-6 transition-all hover:border-opacity-60"
              style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
              <p className="text-sm font-semibold text-white mb-1">{action.label}</p>
              <p className="text-xs" style={{ color: '#6B6560' }}>{action.desc}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
