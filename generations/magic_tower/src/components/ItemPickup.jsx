import React, { useEffect, useState } from 'react'

function ItemPickup({ x, y, itemType, onComplete }) {
  const [opacity, setOpacity] = useState(1)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    // Start animation immediately
    const startAnimation = setTimeout(() => {
      setOpacity(0)
      setOffsetY(-50) // Float up by 50px
    }, 50)

    // Remove component after animation completes (within 500ms requirement)
    const removeTimeout = setTimeout(() => {
      if (onComplete) onComplete()
    }, 500) // 500ms animation as per test requirement

    return () => {
      clearTimeout(startAnimation)
      clearTimeout(removeTimeout)
    }
  }, [onComplete])

  const getItemIcon = () => {
    switch (itemType) {
      case 'smallPotion':
        return '🧪'
      case 'bigPotion':
        return '🧪'
      case 'superPotion':
        return '💊'
      case 'yellowKey':
        return '🔑'
      case 'blueKey':
        return '🔑'
      case 'redKey':
        return '🔑'
      case 'redGem':
        return '💎'
      case 'blueGem':
        return '💎'
      case 'greenGem':
        return '💎'
      case 'ironSword':
        return '⚔️'
      case 'steelSword':
        return '⚔️'
      case 'holySword':
        return '⚔️'
      case 'woodenShield':
        return '🛡️'
      case 'ironShield':
        return '🛡️'
      case 'holyShield':
        return '🛡️'
      case 'goldPile':
        return '💰'
      case 'bigGoldPile':
        return '💰'
      default:
        return '📦'
    }
  }

  const getItemColor = () => {
    switch (itemType) {
      case 'yellowKey':
        return '#FFD700'
      case 'blueKey':
        return '#4488FF'
      case 'redKey':
        return '#FF4444'
      case 'redGem':
        return '#FF4444'
      case 'blueGem':
        return '#4488FF'
      case 'greenGem':
        return '#44CC44'
      case 'goldPile':
      case 'bigGoldPile':
        return '#FFD700'
      default:
        return '#FFFFFF'
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        color: getItemColor(),
        fontSize: '24px',
        fontWeight: 'bold',
        opacity: opacity,
        transform: `translateY(${offsetY}px)`,
        transition: 'opacity 0.45s ease-out, transform 0.45s ease-out',
        pointerEvents: 'none',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        zIndex: 1000
      }}
    >
      {getItemIcon()}
    </div>
  )
}

export default ItemPickup
