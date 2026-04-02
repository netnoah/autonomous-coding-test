import React, { useState, useEffect, useRef } from 'react'
import { EQUIPMENT_STATS, TILE_TYPES } from '../game/gameReducer'
import MiniMap from './MiniMap'
import PlayerAvatar from './PlayerAvatar'

function StatusPanel({ gameState }) {
  const { player, equipment } = gameState
  const [displayedHp, setDisplayedHp] = useState(player.hp)
  const [previousHp, setPreviousHp] = useState(player.hp)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef(null)

  // Calculate effective stats (base + equipment bonuses)
  let effectiveAtk = player.atk
  let effectiveDef = player.def

  if (equipment.sword) {
    const swordStats = EQUIPMENT_STATS[equipment.sword]
    if (swordStats && swordStats.atk) {
      effectiveAtk += swordStats.atk
    }
  }

  if (equipment.shield) {
    const shieldStats = EQUIPMENT_STATS[equipment.shield]
    if (shieldStats && shieldStats.def) {
      effectiveDef += shieldStats.def
    }
  }

  // Get equipment names
  const swordName = equipment.sword ? EQUIPMENT_STATS[equipment.sword].name : null
  const shieldName = equipment.shield ? EQUIPMENT_STATS[equipment.shield].name : null

  // Smooth HP animation
  useEffect(() => {
    if (player.hp !== displayedHp) {
      setPreviousHp(displayedHp)
      setIsAnimating(true)

      const animationDuration = 400 // ms
      const startTime = Date.now()
      const startHp = displayedHp
      const endHp = player.hp

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / animationDuration, 1)

        // Ease-out cubic function for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        const currentHp = Math.round(startHp + (endHp - startHp) * easeProgress)
        setDisplayedHp(currentHp)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [player.hp])

  const hpPercent = (displayedHp / player.maxHp) * 100

  // HP bar gradient from green to red
  // High HP (80-100%): Green
  // Medium HP (40-79%): Yellow
  // Low HP (0-39%): Red
  const getHpBarColor = (percent) => {
    if (percent >= 80) {
      // Green (hue 120)
      return `hsl(120, 70%, 45%)`
    } else if (percent >= 40) {
      // Transition from yellow (hue 60) to green (hue 120)
      // At 80%: yellow, at 40%: green
      const yellowStart = 80
      const greenEnd = 40
      const ratio = (percent - greenEnd) / (yellowStart - greenEnd)
      const hue = 60 + (ratio * 60) // 60 (yellow) to 120 (green)
      return `hsl(${hue}, 80%, 45%)`
    } else {
      // Transition from red (hue 0) to yellow (hue 60)
      // At 40%: yellow, at 0%: red
      const yellowStart = 40
      const redEnd = 0
      const ratio = Math.max(0, (percent - redEnd) / (yellowStart - redEnd))
      const hue = ratio * 60 // 0 (red) to 60 (yellow)
      return `hsl(${hue}, 80%, 45%)`
    }
  }

  const hpBarColor = getHpBarColor(hpPercent)

  // Damage flash effect
  const isTakingDamage = isAnimating && displayedHp > player.hp

  return (
    <div className="status-panel bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="font-pixel text-lg text-yellow-400 mb-4">Status</h2>

      {/* Player Avatar */}
      <PlayerAvatar player={player} />

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">HP</span>
          <span className={`font-mono-stats ${isTakingDamage ? 'text-red-400' : 'text-white'} transition-colors duration-200`}>
            {displayedHp}/{player.maxHp}
          </span>
        </div>
        <div className={`w-full bg-gray-700 rounded-full h-4 overflow-hidden ${isTakingDamage ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
          <div
            className="h-full"
            style={{
              width: `${hpPercent}%`,
              backgroundColor: hpBarColor,
              transition: isAnimating ? 'none' : 'width 0.3s ease-out, background-color 0.3s ease-out'
            }}
          />
        </div>
      </div>

      {/* Stats - Now showing effective stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">⚔ ATK</span>
          <div className="text-right">
            <span className="font-mono-stats text-white text-lg">{effectiveAtk}</span>
            {effectiveAtk !== player.atk && (
              <span className="text-green-400 text-xs ml-1">(+{effectiveAtk - player.atk})</span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">🛡 DEF</span>
          <div className="text-right">
            <span className="font-mono-stats text-white text-lg">{effectiveDef}</span>
            {effectiveDef !== player.def && (
              <span className="text-green-400 text-xs ml-1">(+{effectiveDef - player.def})</span>
            )}
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h3 className="text-sm text-gray-400 mb-2">Equipment</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">⚔️ Sword</span>
            <span className={`text-sm ${swordName ? 'text-yellow-400' : 'text-gray-500'}`}>
              {swordName || 'None'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">🛡️ Shield</span>
            <span className={`text-sm ${shieldName ? 'text-blue-400' : 'text-gray-500'}`}>
              {shieldName || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Keys */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h3 className="text-sm text-gray-400 mb-2">Keys</h3>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-yellow-400 text-2xl">🔑</div>
            <div className="font-mono-stats text-white">{player.yellowKeys}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 text-2xl">🔑</div>
            <div className="font-mono-stats text-white">{player.blueKeys}</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-2xl">🔑</div>
            <div className="font-mono-stats text-white">{player.redKeys}</div>
          </div>
        </div>
      </div>

      {/* Gold */}
      <div className="mb-4 flex items-center justify-between p-3 bg-gray-700 rounded-lg">
        <span className="text-yellow-400 text-2xl">💰</span>
        <span className="font-mono-stats text-white text-xl">{player.gold}</span>
      </div>

      {/* Floor & Steps */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Floor</span>
          <span className="font-mono-stats text-white">{player.floor}/10</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Steps</span>
          <span className="font-mono-stats text-white">{player.steps}</span>
        </div>
      </div>

      {/* Mini-map */}
      <MiniMap gameState={gameState} />
    </div>
  )
}

export default StatusPanel
