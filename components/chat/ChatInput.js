'use client'
import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || disabled) return
    onSend(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0" style={{ borderTop: '1px solid #E8E0D5' }}>
      <input type="text" value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) } }}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 px-6 py-4 text-sm focus:outline-none disabled:opacity-50"
        style={{ backgroundColor: '#FFFFFF', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }} />
      <button type="submit" disabled={disabled || !text.trim()}
        className="px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-all hover:opacity-80 disabled:opacity-30"
        style={{ backgroundColor: '#1a1a1a', color: '#FAF7F2', letterSpacing: '0.1em', minWidth: '100px' }}>
        Send
      </button>
    </form>
  )
}
