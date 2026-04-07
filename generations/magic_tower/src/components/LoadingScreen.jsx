import React, { useEffect, useState } from 'react'

/**
 * LoadingScreen Component
 *
 * Displays a smooth loading animation when the application starts.
 * Shows the game title with animated effects and progress indicator.
 *
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether loading screen is visible
 * @param {Function} props.onComplete - Callback when loading completes
 */
function LoadingScreen({ isVisible, onComplete }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    // Simulate loading progress
    const duration = 2000 // 2 seconds
    const interval = 20 // Update every 20ms
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const newProgress = (currentStep / steps) * 100
      setProgress(newProgress)

      if (currentStep >= steps) {
        clearInterval(timer)
        // Start fade out
        setFadeOut(true)
        setTimeout(() => {
          if (onComplete) onComplete()
        }, 500) // Wait for fade out animation
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, onComplete])

  if (!isVisible && !fadeOut) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)'
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Game Title */}
        <div className="mb-12">
          <h1
            className="font-pixel text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 mb-4 tracking-wider"
            style={{
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.8)',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            魔塔
          </h1>
          <h2 className="font-pixel text-xl md:text-2xl text-blue-300 tracking-widest">
            MAGIC TOWER
          </h2>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="mb-3 flex justify-between items-center">
            <span className="text-gray-300 text-sm">Loading...</span>
            <span className="text-yellow-400 text-sm font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 transition-all duration-20 ease-out"
              style={{
                width: `${progress}%`,
                transition: 'width 0.02s linear'
              }}
            />
          </div>
        </div>

        {/* Loading tips */}
        <div className="mt-12 text-gray-400 text-sm max-w-md">
          {progress < 25 && "Preparing your adventure..."}
          {progress >= 25 && progress < 50 && "Loading tower maps..."}
          {progress >= 50 && progress < 75 && "Summoning monsters..."}
          {progress >= 75 && progress < 100 && "Almost ready..."}
          {progress === 100 && "Welcome, brave adventurer!"}
        </div>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)'
        }}
      />

      {/* Add custom animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
