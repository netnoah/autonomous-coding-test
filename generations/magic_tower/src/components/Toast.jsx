import React, { useEffect, useState } from 'react'

/**
 * Toast notification component for displaying temporary messages
 * Used for errors, warnings, and success messages
 */
function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true)

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleDismiss = () => {
    setIsExiting(true)
    // Wait for exit animation to complete
    setTimeout(() => {
      onClose()
    }, 300)
  }

  // Get toast configuration based on type
  const getToastConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: '⚠️',
          bgColor: 'from-red-900 to-red-950',
          borderColor: 'border-red-500',
          textColor: 'text-red-100',
          iconColor: 'text-red-400',
          shadowColor: 'shadow-red-900/50'
        }
      case 'warning':
        return {
          icon: '⚡',
          bgColor: 'from-yellow-900 to-yellow-950',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-100',
          iconColor: 'text-yellow-400',
          shadowColor: 'shadow-yellow-900/50'
        }
      case 'success':
        return {
          icon: '✅',
          bgColor: 'from-green-900 to-green-950',
          borderColor: 'border-green-500',
          textColor: 'text-green-100',
          iconColor: 'text-green-400',
          shadowColor: 'shadow-green-900/50'
        }
      default:
        return {
          icon: 'ℹ️',
          bgColor: 'from-blue-900 to-blue-950',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-100',
          iconColor: 'text-blue-400',
          shadowColor: 'shadow-blue-900/50'
        }
    }
  }

  const config = getToastConfig()

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-md toast-container ${
        isVisible ? 'toast-visible' : ''
      } ${isExiting ? 'toast-exiting' : ''}`}
    >
      <div
        className={`
          relative bg-gradient-to-br ${config.bgColor}
          border-2 ${config.borderColor}
          rounded-xl shadow-2xl ${config.shadowColor}
          p-4 min-w-[300px] max-w-md
          toast-card
        `}
      >
        {/* Glow effect */}
        <div className={`absolute -inset-[1px] bg-gradient-to-r ${config.borderColor} rounded-xl blur-md opacity-40 toast-glow`}></div>

        {/* Content */}
        <div className="relative flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-2xl ${config.iconColor} toast-icon`}>
            {config.icon}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${config.textColor} toast-message`}>
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 ${config.textColor} hover:text-white transition-colors toast-close`}
            aria-label="Close notification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/20 to-white/10 rounded-b-xl overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${config.borderColor} toast-progress`}
            style={{
              animation: `toastProgress ${duration}ms linear forwards`
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

/**
 * ToastContainer component for managing multiple toasts
 */
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 toast-container-stack">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration || 3000}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

export default Toast
export { ToastContainer }
