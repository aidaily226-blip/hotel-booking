'use client'
import ChatWindow from '@/components/chat/ChatWindow'
import Link from 'next/link'

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="px-8 py-4 flex items-center gap-6" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" className="text-sm transition-colors hover:opacity-70" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Back to Home
        </Link>
        <div className="w-px h-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <div>
          <p className="text-white font-serif text-sm font-medium">Spice Garden Reservations</p>
          <p className="text-xs" style={{ color: '#C4973A' }}>AI Assistant — Online</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-6">
        <ChatWindow />
      </div>
    </div>
  )
}
