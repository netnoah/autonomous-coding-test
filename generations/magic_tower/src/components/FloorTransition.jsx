import React, { useState, useEffect } from 'react'

/**
 * FloorTransition Component
 *
 * Handles the fade in/out animation when transitioning between floors.
 * Shows a full-screen overlay with the floor number during transition.
 *
 * @param {Object} props
 * @param {boolean} props.isActive - Whether transition is active
 * @param {number} props.fromFloor - Source floor number
 * @param {number} props.toFloor - Destination floor number
 * @param {string} props.direction - 'up' or 'down'
 * @param {Function} props.onComplete - Callback when transition completes
 */
function FloorTransition({ isActive, fromFloor, toFloor, direction, onComplete }) {
  const [opacity, setOpacity] = useState(0)
  const [showFloorNumber, setShowFloorNumber] = useState(false)
  const [phase, setPhase] = useState('idle') // idle, fading-out, showing-floor, fading-in

  useEffect(() => {
    if (isActive && phase === 'idle') {
      // Start transition sequence
      setPhase('fading-out')

      // Phase 1: Fade out (fade to black)
      const fadeOutStart = Date.now()
      const fadeOutDuration = 150 // ms

      const fadeOut = () => {
        const elapsed = Date.now() - fadeOutStart
        const progress = Math.min(elapsed / fadeOutDuration, 1)

        setOpacity(progress)

        if (progress < 1) {
          requestAnimationFrame(fadeOut)
        } else {
          // Phase 2: Show floor number briefly
          setShowFloorNumber(true)
          setPhase('showing-floor')

          setTimeout(() => {
            // Phase 3: Start fading in
            setShowFloorNumber(false)
            setPhase('fading-in')

            const fadeInStart = Date.now()
            const fadeInDuration = 150 // ms

            const fadeIn = () => {
              const elapsed = Date.now() - fadeInStart
              const progress = Math.min(elapsed / fadeInDuration, 1)

              setOpacity(1 - progress)

              if (progress < 1) {
                requestAnimationFrame(fadeIn)
              } else {
                // Transition complete
                setPhase('idle')
                setOpacity(0)
                if (onComplete) {
                  onComplete()
                }
              }
            }

            requestAnimationFrame(fadeIn)
          }, 200) // Show floor number for 200ms
        }
      }

      requestAnimationFrame(fadeOut)
    }
  }, [isActive, phase, onComplete])

  // Don't render anything if not active
  if (!isActive && opacity === 0) {
    return null
  }

  const directionText = direction === 'up' ? '▲' : '▼'
  const floorName = toFloor === 0 ? 'Ground Floor' : `Floor ${toFloor}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-none"
      style={{
        opacity: opacity,
        transition: 'opacity 0.15s ease-in-out'
      }}
    >
      {showFloorNumber && (
        <div className="text-center">
          <div className="text-6xl mb-4 text-white font-bold">
            {directionText}
          </div>
          <div className="text-4xl text-yellow-400 font-bold mb-2">
            {floorName}
          </div>
          <div className="text-lg text-gray-400">
            {fromFloor === 0 ? 'Ground Floor' : `Floor ${fromFloor}`} → {floorName}
          </div>
        </div>
      )}
    </div>
  )
}

export default FloorTransition
