import React from 'react'
import { EQUIPMENT_STATS, TILE_TYPES } from '../game/gameReducer'

function StatusPanel({ gameState }) {
  const { player, equipment } = gameState

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

  const hpPercent = (player.hp / player.maxHp) * 100
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'

  // Get equipment names
  const swordName = equipment.sword ? EQUIPMENT_STATS[equipment.sword].name : null
  const shieldName = equipment.shield ? EQUIPMENT_STATS[equipment.shield].name : null

  return (
    <div className="status-panel bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="font-pixel text-lg text-yellow-400 mb-4">Status</h2>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">HP</span>
          <span className="font-mono-stats text-white">
            {player.hp}/{player.maxHp}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${hpColor} transition-all duration-300`}
            style={{ width: `${hpPercent}%` }}
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

      {/* Mini-map placeholder */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h3 className="text-sm text-gray-400 mb-2">Mini-Map</h3>
        <div className="bg-gray-900 rounded p-2 flex items-center justify-center h-32">
          <span className="text-gray-600 text-xs">Floor {player.floor} Map</span>
        </div>
      </div>
    </div>
  )
}

export default StatusPanel
