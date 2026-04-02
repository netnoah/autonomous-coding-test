import React, { useEffect, useState } from 'react'

function DamageNumber({ x, y, damage, type, onComplete }) {
  const [opacity, setOpacity] = useState(1)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    // Start animation after a small delay
    const startAnimation = setTimeout(() => {
      setOpacity(0)
      setOffsetY(-40) // Float up by 40px
    }, 50)

    // Remove component after animation completes
    const removeTimeout = setTimeout(() => {
      if (onComplete) onComplete()
    }, 1000) // 1 second animation

    return () => {
      clearTimeout(startAnimation)
      clearTimeout(removeTimeout)
    }
  }, [onComplete])

  const getColor = () => {
    switch (type) {
      case 'player-dealt':
        return '#FFD700' // Gold for player damage
      case 'player-taken':
        return '#FF4444' // Red for damage taken
      case 'critical':
        return '#FF6B6B' // Bright red for critical hits
      default:
        return '#FFFFFF'
    }
  }

  const getFontSize = () => {
    return type === 'critical' ? '20px' : '16px'
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        color: getColor(),
        fontSize: getFontSize(),
        fontWeight: 'bold',
        opacity: opacity,
        transform: `translateY(${offsetY}px)`,
        transition: 'opacity 0.95s ease-out, transform 0.95s ease-out',
        pointerEvents: 'none',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        fontFamily: "'Press Start 2P', monospace"
      }}
    >
      {damage > 0 ? `-${damage}` : '0'}
    </div>
  )
}

export default DamageNumber
