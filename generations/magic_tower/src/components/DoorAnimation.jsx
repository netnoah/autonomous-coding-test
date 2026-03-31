import React, { useEffect, useState } from 'react'

function DoorAnimation({ x, y, doorType, onComplete }) {
  const [scaleX, setScaleX] = useState(1)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    // Start animation after a short delay
    const startAnimation = setTimeout(() => {
      // Slide door open by reducing width (scaleX) and fading out
      setScaleX(0)
      setOpacity(0)
    }, 50)

    // Remove component after animation completes
    const removeTimeout = setTimeout(() => {
      if (onComplete) onComplete()
    }, 400) // 400ms animation for smooth slide effect

    return () => {
      clearTimeout(startAnimation)
      clearTimeout(removeTimeout)
    }
  }, [onComplete])

  const getDoorColor = () => {
    switch (doorType) {
      case 'yellowDoor':
        return '#FFD700'
      case 'blueDoor':
        return '#4488FF'
      case 'redDoor':
        return '#FF4444'
      default:
        return '#888888'
    }
  }

  const getDoorEmoji = () => {
    switch (doorType) {
      case 'yellowDoor':
        return '🚪'
      case 'blueDoor':
        return '🚪'
      case 'redDoor':
        return '🚪'
      default:
        return '🚪'
    }
  }

  const tileSize = 48

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        backgroundColor: getDoorColor(),
        opacity: opacity,
        transform: `scaleX(${scaleX})`,
        transformOrigin: 'center',
        transition: 'transform 0.35s ease-out, opacity 0.35s ease-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        pointerEvents: 'none',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 999,
        borderRadius: '4px'
      }}
    >
      {getDoorEmoji()}
    </div>
  )
}

export default DoorAnimation
