import React, { useEffect, useState } from 'react'

function StatChangeAnimation({ x, y, statChangeText, onComplete }) {
  const [opacity, setOpacity] = useState(1)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1.2) // Start slightly larger for emphasis

  useEffect(() => {
    // Start animation after a brief delay
    const startAnimation = setTimeout(() => {
      setOpacity(0)
      setOffsetY(-80) // Float up by 80px (more prominent than item pickup)
      setScale(1) // Shrink to normal size
    }, 100)

    // Remove component after animation completes (1-2 seconds as per spec)
    const removeTimeout = setTimeout(() => {
      if (onComplete) onComplete()
    }, 1500) // 1.5s animation within the 1-2s requirement

    return () => {
      clearTimeout(startAnimation)
      clearTimeout(removeTimeout)
    }
  }, [onComplete])

  // Color based on stat type
  const getStatColor = () => {
    if (statChangeText.includes('ATK')) return '#FF6666' // Red for attack
    if (statChangeText.includes('DEF')) return '#6666FF' // Blue for defense
    if (statChangeText.includes('HP') || statChangeText.includes('Max HP')) return '#66FF66' // Green for health
    return '#FFD700' // Gold for other stats
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        color: getStatColor(),
        fontSize: '28px',
        fontWeight: 'bold',
        opacity: opacity,
        transform: `translateY(${offsetY}px) scale(${scale})`,
        transition: 'opacity 1.4s ease-out, transform 1.4s ease-out',
        pointerEvents: 'none',
        textShadow: '0 0 8px rgba(0, 0, 0, 0.9), 2px 2px 4px rgba(0, 0, 0, 0.8)',
        zIndex: 1001, // Above item pickups
        whiteSpace: 'nowrap',
        fontFamily: '"Press Start 2P", monospace, sans-serif'
      }}
    >
      {statChangeText}
    </div>
  )
}

export default StatChangeAnimation
