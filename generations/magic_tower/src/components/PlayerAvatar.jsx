import React from 'react'

/**
 * PlayerAvatar - Player portrait/avatar component
 * Displays a pixel-art style avatar representing the player character
 */
function PlayerAvatar({ player }) {
  // Get avatar based on player stats/equipment for visual variety
  const getAvatarEmoji = () => {
    const { atk, def } = player

    // Different avatars based on player power level
    const totalStats = atk + def

    if (totalStats < 30) {
      // Early game - novice hero
      return '🧑‍🌾'
    } else if (totalStats < 60) {
      // Mid game - warrior
      return '🧑‍🔧'
    } else if (totalStats < 100) {
      // Strong - knight
      return '👨‍✈️'
    } else if (totalStats < 150) {
      // Very strong - hero
      return '🦸'
    } else {
      // End game - legendary hero
      return '👸'
    }
  }

  const getAvatarTitle = () => {
    const { atk, def } = player
    const totalStats = atk + def

    if (totalStats < 30) return 'Novice Adventurer'
    if (totalStats < 60) return 'Warrior'
    if (totalStats < 100) return 'Knight'
    if (totalStats < 150) return 'Hero'
    return 'Legend'
  }

  return (
    <div className="player-avatar mb-4 relative p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border-2 border-yellow-600">
      <div className="flex items-center space-x-4">
        {/* Avatar icon */}
        <div className="avatar-icon text-5xl">
          {getAvatarEmoji()}
        </div>

        {/* Avatar info */}
        <div className="flex-1">
          <div className="avatar-title text-sm text-yellow-400 font-bold mb-1">
            {getAvatarTitle()}
          </div>
          <div className="avatar-stats text-xs text-gray-400">
            <div>Floor {player.floor}</div>
            <div>{player.steps} steps</div>
          </div>
        </div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-500 rounded-tl"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-tr"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-500 rounded-bl"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-500 rounded-br"></div>
    </div>
  )
}

export default PlayerAvatar
