import React from 'react'
import { MONSTER_STATS, TILE_TYPES } from '../game/gameReducer'

/**
 * Calculates the predicted combat outcome between player and monster
 * @param {Object} player - Player stats {hp, atk, def}
 * @param {Object} monster - Monster stats {hp, atk, def}
 * @returns {Object} Combat prediction result
 */
function predictCombat(player, monster) {
  const playerDmg = Math.max(0, player.atk - monster.def)
  const monsterDmg = Math.max(0, monster.atk - player.def)

  // Player attacks first
  const roundsToKill = playerDmg > 0 ? Math.ceil(monster.hp / playerDmg) : Infinity
  const roundsPlayerCanSurvive = monsterDmg > 0 ? Math.floor(player.hp / monsterDmg) : Infinity

  const playerWins = roundsToKill <= roundsPlayerCanSurvive
  const totalDamageTaken = Math.max(0, (roundsToKill - 1) * monsterDmg)
  const remainingHP = playerWins ? player.hp - totalDamageTaken : 0

  return {
    playerWins,
    roundsToKill,
    roundsPlayerCanSurvive,
    totalDamageTaken,
    remainingHP,
    playerDmgPerHit: playerDmg,
    monsterDmgPerHit: monsterDmg
  }
}

/**
 * MonsterTooltip component
 * Shows monster stats and predicted combat outcome on hover
 */
function MonsterTooltip({ monster, player, position }) {
  if (!monster || !player) return null

  const prediction = predictCombat(player, monster)

  return (
    <div
      className="absolute z-50 bg-gray-900 border-2 border-yellow-500 rounded-lg p-4 shadow-xl pointer-events-none"
      style={{
        left: position.x + 40,
        top: position.y - 20,
        minWidth: '250px',
        maxWidth: '300px'
      }}
    >
      {/* Monster Name */}
      <div className="text-lg font-bold text-yellow-400 mb-3 border-b border-yellow-600 pb-2">
        {monster.name}
      </div>

      {/* Monster Stats */}
      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-red-400 font-semibold">HP:</span>
          <span className="text-white">{monster.hp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-orange-400 font-semibold">ATK:</span>
          <span className="text-white">{monster.atk}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-400 font-semibold">DEF:</span>
          <span className="text-white">{monster.def}</span>
        </div>
      </div>

      {/* Combat Prediction */}
      <div className="border-t border-gray-600 pt-3">
        <div className="text-sm font-semibold text-gray-300 mb-2">Combat Prediction:</div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Your damage:</span>
            <span className="text-green-400">{prediction.playerDmgPerHit}/hit</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Enemy damage:</span>
            <span className="text-red-400">{prediction.monsterDmgPerHit}/hit</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Rounds to kill:</span>
            <span className="text-white">{prediction.roundsToKill === Infinity ? '∞' : prediction.roundsToKill}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Damage taken:</span>
            <span className={prediction.totalDamageTaken > player.hp * 0.5 ? 'text-red-400' : 'text-yellow-400'}>
              {prediction.totalDamageTaken}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Remaining HP:</span>
            <span className={prediction.remainingHP > 0 ? 'text-green-400' : 'text-red-600'}>
              {prediction.remainingHP > 0 ? prediction.remainingHP : 'DEAD'}
            </span>
          </div>
        </div>

        {/* Outcome */}
        <div className={`mt-3 text-center py-2 px-3 rounded font-bold ${
          prediction.playerWins
            ? 'bg-green-900 text-green-300 border border-green-600'
            : 'bg-red-900 text-red-300 border border-red-600'
        }`}>
          {prediction.playerWins ? '✓ VICTORY' : '✗ DEFEAT'}
        </div>
      </div>
    </div>
  )
}

export default MonsterTooltip
export { predictCombat }
