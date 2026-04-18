'use client'
import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

const welcome = {
  role: 'assistant',
  content: "Good day. Welcome to Spice Garden.\n\nI am your reservation assistant. I can help you with:\n\n  Browse our menu\n  Check table availability\n  Make a reservation\n  Answer any questions\n\nHow may I assist you today?",
}

export default function ChatWindow() {
  const [messages, setMessages] = useState([welcome])
  const [loading, setLoading] = useState(false)
  const [bookingDone, setBookingDone] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text) {
    if (!text.trim()) return
    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      let reply = data.reply

      if (data.booking) {
        try {
          const saveRes = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.booking),
          })
          const saveData = await saveRes.json()
          if (saveData.success) {
            setBookingDone(saveData.booking)
            if (saveData.tableChanged) {
              reply += `\n\nPlease note: Table ${saveData.originalTable} was unavailable at that time. You have been assigned Table ${saveData.assignedTable} instead.`
            }
          } else if (saveData.conflict) {
            reply = `We apologize — all tables are fully booked for that date and time.\n\n${saveData.message}\n\nWould you like to consider a different time slot?`
          }
        } catch (e) {
          console.error('Booking save failed', e)
        }
      }

      setMessages([...updated, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...updated, { role: 'assistant', content: "We apologize for the inconvenience. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const quickReplies = ['View the menu', 'Make a reservation', 'Vegetarian options', 'Check availability']

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: '75vh', border: '1px solid #E8E0D5' }}>

      {/* Booking Banner */}
      {bookingDone && (
        <div className="px-6 py-3 text-sm text-center font-medium" style={{ backgroundColor: '#1a1a1a', color: '#C4973A', letterSpacing: '0.03em' }}>
          Reservation confirmed — {bookingDone.guest} · Table {bookingDone.table} · {bookingDone.date} at {bookingDone.time}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-5 chat-scroll">
        {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}
        {loading && (
          <div className="flex gap-1.5 items-center px-5 py-3.5" style={{ backgroundColor: '#F5EFE6', width: 'fit-content', border: '1px solid #E8E0D5' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: '#C4973A' }} />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: '#C4973A', animationDelay: '0.15s' }} />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: '#C4973A', animationDelay: '0.3s' }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-6 py-3 flex gap-2 flex-wrap" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
        {quickReplies.map(q => (
          <button key={q} onClick={() => handleSend(q)}
            className="px-4 py-1.5 text-xs font-medium tracking-wide transition-all hover:bg-primary hover:text-white"
            style={{ border: '1px solid #E8E0D5', color: '#6B6560', letterSpacing: '0.03em' }}>
            {q}
          </button>
        ))}
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
