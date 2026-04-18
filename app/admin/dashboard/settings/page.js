'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/admin/Sidebar'

const defaultInstructions = `- Always greet customers formally and warmly
- Recommend our signature Butter Chicken and Paneer Tikka Masala
- We are open 12:00 PM to 11:00 PM every day
- Last reservation accepted at 9:30 PM
- For groups of 8 or more, mention our 10% group discount
- Always confirm all booking details before finalizing
- Minimum advance booking is 30 minutes before dining time`

export default function SettingsPage() {
  const [instructions, setInstructions] = useState(defaultInstructions)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { if (d.instructions) setInstructions(d.instructions) }).catch(() => {})
  }, [])

  async function handleSave() {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions }),
      })
      const data = await res.json()
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
      else setError('Failed to save. Please try again.')
    } catch { setError('Connection error. Please try again.') }
    finally { setSaving(false) }
  }

  const quickAdd = [
    { label: 'Live Music', text: 'We have live music every Friday and Saturday from 7 PM to 10 PM. Inform customers about this.' },
    { label: 'Birthday Offer', text: 'For birthday bookings, offer a complimentary dessert. Ask if celebrating any occasion.' },
    { label: 'Closed Day', text: 'We are closed every Tuesday. Inform customers politely if they request Tuesday.' },
    { label: 'Spice Preference', text: 'Always ask customers their preferred spice level: mild, medium, or extra spicy.' },
    { label: 'Parking', text: 'Free parking is available behind the restaurant for up to 2 hours.' },
    { label: 'Payment', text: 'We accept cash, all major cards, UPI, and online payments.' },
  ]

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <Sidebar />
      <main className="flex-1 p-10 max-w-4xl">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-semibold text-white mb-1">AI Assistant Instructions</h1>
          <p className="text-sm" style={{ color: '#6B6560' }}>Define how the AI chatbot should behave and what information it should share with customers</p>
        </div>

        <div className="mb-6 p-6" style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-white tracking-wide">Current Instructions</h2>
            <span className="text-xs" style={{ color: '#6B6560' }}>{instructions.split('\n').filter(l => l.trim()).length} active instructions</span>
          </div>
          <p className="text-xs mb-4" style={{ color: '#3a3a3a' }}>Each line beginning with a dash (-) is a single instruction. The AI will follow all instructions listed here.</p>
          <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={14}
            className="w-full px-4 py-3 text-sm focus:outline-none font-mono"
            style={{ backgroundColor: '#0d0d0d', border: '1px solid #333', color: '#C4C4C4', lineHeight: '1.8', fontFamily: 'monospace' }}
            placeholder="Enter instructions here..." />
          {error && <p className="text-xs mt-2" style={{ color: '#EF5350' }}>{error}</p>}
          <button onClick={handleSave} disabled={saving}
            className="mt-4 w-full py-3.5 text-xs font-medium tracking-widest uppercase transition-all hover:opacity-80 disabled:opacity-40"
            style={{ backgroundColor: '#C4973A', color: '#1a1a1a', letterSpacing: '0.15em' }}>
            {saving ? 'Saving...' : saved ? 'Saved — Chatbot Updated' : 'Save & Update Chatbot'}
          </button>
        </div>

        <div className="mb-6 p-6" style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
          <h2 className="text-sm font-semibold text-white mb-1">Quick Add</h2>
          <p className="text-xs mb-4" style={{ color: '#6B6560' }}>Click to add a common instruction</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickAdd.map(ex => (
              <button key={ex.label} onClick={() => setInstructions(prev => prev + '\n- ' + ex.text)}
                className="px-4 py-3 text-left text-xs font-medium transition-all hover:border-opacity-80"
                style={{ border: '1px solid #333', color: '#9E9890' }}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6" style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Writing Effective Instructions</h2>
          <div className="space-y-2 text-xs" style={{ color: '#6B6560', lineHeight: '1.8' }}>
            <p>Be specific — "Recommend Butter Chicken to every customer" works better than "recommend dishes"</p>
            <p>Use plain language — the AI understands straightforward instructions best</p>
            <p>Start each instruction with a dash (-) on a new line</p>
            <p>Include operational details: hours, special events, pricing policies</p>
            <p>Avoid contradictory instructions such as "always open" and "closed Tuesdays"</p>
          </div>
        </div>
      </main>
    </div>
  )
}
