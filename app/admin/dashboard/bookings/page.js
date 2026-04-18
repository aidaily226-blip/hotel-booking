'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/admin/Sidebar'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.bookings || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-semibold text-white mb-1">Reservations</h1>
          <p className="text-sm" style={{ color: '#6B6560' }}>All table reservations made through the AI assistant</p>
        </div>

        <div className="flex gap-3 mb-6">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-5 py-2 text-xs font-medium tracking-widest uppercase transition-all"
              style={filter === f
                ? { backgroundColor: '#C4973A', color: '#1a1a1a', letterSpacing: '0.1em' }
                : { border: '1px solid #333', color: '#6B6560', letterSpacing: '0.1em' }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Guest', 'Contact', 'Table', 'Date', 'Time', 'Guests', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#1f1f1f' }}>
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm" style={{ color: '#3a3a3a' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm" style={{ color: '#3a3a3a' }}>No reservations found.</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} style={{ borderColor: '#1f1f1f' }}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{b.guest}</p>
                    {b.isNew && <span className="text-xs" style={{ color: '#C4973A' }}>New</span>}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6B6560' }}>{b.phone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">{b.table}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6B6560' }}>{b.date}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6B6560' }}>{b.time}</td>
                  <td className="px-6 py-4 text-sm text-center text-white">{b.guests}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1" style={{
                      backgroundColor: b.status === 'Confirmed' ? '#0f1f0f' : b.status === 'Pending' ? '#1f1a0f' : '#1f0f0f',
                      color: b.status === 'Confirmed' ? '#4CAF50' : b.status === 'Pending' ? '#FFC107' : '#EF5350',
                      border: `1px solid ${b.status === 'Confirmed' ? '#1a3a1a' : b.status === 'Pending' ? '#3a2f0a' : '#3a1a1a'}`
                    }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
