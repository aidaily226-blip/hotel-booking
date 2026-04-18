'use client'
import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'

const initialTables = [
  { id: 'T1', capacity: 2, location: 'Window', status: 'Available' },
  { id: 'T2', capacity: 2, location: 'Indoor', status: 'Occupied' },
  { id: 'T3', capacity: 4, location: 'Indoor', status: 'Available' },
  { id: 'T4', capacity: 4, location: 'Outdoor', status: 'Reserved' },
  { id: 'T5', capacity: 6, location: 'Indoor', status: 'Available' },
  { id: 'T6', capacity: 6, location: 'Outdoor', status: 'Available' },
  { id: 'T7', capacity: 2, location: 'Window', status: 'Available' },
  { id: 'T8', capacity: 8, location: 'Private Room', status: 'Available' },
]

const statusStyle = {
  Available: { bg: '#0f1f0f', color: '#4CAF50', border: '#1a3a1a' },
  Occupied: { bg: '#1f0f0f', color: '#EF5350', border: '#3a1a1a' },
  Reserved: { bg: '#1f1a0f', color: '#FFC107', border: '#3a2f0a' },
  Maintenance: { bg: '#1a1a1a', color: '#9E9E9E', border: '#333' },
}

export default function TablesPage() {
  const [tables, setTables] = useState(initialTables)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ id: '', capacity: 2, location: 'Indoor', status: 'Available' })

  function handleStatusChange(id, status) { setTables(tables.map(t => t.id === id ? { ...t, status } : t)) }
  function handleAdd() { setTables([...tables, { ...form }]); setShowForm(false) }
  function handleDelete(id) { if (confirm('Remove this table?')) setTables(tables.filter(t => t.id !== id)) }

  const available = tables.filter(t => t.status === 'Available').length

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-white mb-1">Table Management</h1>
            <p className="text-sm" style={{ color: '#6B6560' }}>{available} of {tables.length} tables currently available</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="px-6 py-2.5 text-xs font-medium tracking-widest uppercase transition-all hover:opacity-80"
            style={{ backgroundColor: '#C4973A', color: '#1a1a1a', letterSpacing: '0.1em' }}>
            Add Table
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="w-full max-w-md mx-4 p-8" style={{ backgroundColor: '#161616', border: '1px solid #333' }}>
              <h2 className="font-serif text-2xl font-semibold text-white mb-6">Add New Table</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Table ID</label>
                  <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })}
                    className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="T9"
                    style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontFamily: 'DM Sans, sans-serif' }} />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Capacity</label>
                  <select value={form.capacity} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 text-sm focus:outline-none"
                    style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                    {[2, 4, 6, 8, 10].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Location</label>
                  <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 text-sm focus:outline-none"
                    style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                    {['Indoor', 'Outdoor', 'Window', 'Private Room'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-sm" style={{ border: '1px solid #333', color: '#6B6560' }}>Cancel</button>
                  <button onClick={handleAdd} className="flex-1 py-3 text-sm hover:opacity-80" style={{ backgroundColor: '#C4973A', color: '#1a1a1a' }}>Add Table</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tables.map(table => {
            const s = statusStyle[table.status] || statusStyle.Available
            return (
              <div key={table.id} className="p-5 text-center" style={{ backgroundColor: '#161616', border: `1px solid ${s.border}` }}>
                <p className="font-serif text-2xl font-semibold text-white mb-1">{table.id}</p>
                <p className="text-xs mb-3" style={{ color: '#6B6560' }}>{table.capacity} seats · {table.location}</p>
                <select value={table.status} onChange={e => handleStatusChange(table.id, e.target.value)}
                  className="w-full text-xs px-2 py-1.5 focus:outline-none text-center"
                  style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: 'DM Sans, sans-serif' }}>
                  {['Available', 'Occupied', 'Reserved', 'Maintenance'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )
          })}
        </div>

        {/* Table List */}
        <div style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Table', 'Capacity', 'Location', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#1f1f1f' }}>
              {tables.map(table => {
                const s = statusStyle[table.status] || statusStyle.Available
                return (
                  <tr key={table.id} style={{ borderColor: '#1f1f1f' }}>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{table.id}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6B6560' }}>{table.capacity} guests</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6B6560' }}>{table.location}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-3 py-1" style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        {table.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(table.id)} className="text-xs transition-colors" style={{ color: '#EF5350' }}>Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
