export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
      {!isUser && (
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 text-xs font-semibold tracking-widest"
          style={{ backgroundColor: '#1a1a1a', color: '#C4973A', border: '1px solid #333' }}>SG</div>
      )}
      <div className="px-5 py-3.5 max-w-xs md:max-w-md text-sm leading-relaxed whitespace-pre-wrap"
        style={isUser
          ? { backgroundColor: '#1a1a1a', color: '#FAF7F2', borderRadius: '2px 2px 0 2px' }
          : { backgroundColor: '#FFFFFF', color: '#1a1a1a', border: '1px solid #E8E0D5', borderRadius: '2px 2px 2px 0' }}>
        {message.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 text-xs font-semibold"
          style={{ backgroundColor: '#C4973A', color: '#1a1a1a' }}>G</div>
      )}
    </div>
  )
}
