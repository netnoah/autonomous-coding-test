import React, { useRef, useEffect } from 'react'

function MessageLog({ messages }) {
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getMessageColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      case 'info':
        return 'text-blue-400'
      case 'warning':
        return 'text-yellow-400'
      default:
        return 'text-gray-300'
    }
  }

  return (
    <div className="message-log bg-gray-800 rounded-lg p-4 shadow-lg flex-1 overflow-hidden flex flex-col">
      <h2 className="font-pixel text-lg text-yellow-400 mb-2">Log</h2>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-1"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">No messages yet</div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`text-sm ${getMessageColor(message.type)} break-words`}
              >
                {message.text}
              </div>
            ))}
            {/* Invisible element for scroll targeting */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  )
}

export default MessageLog
