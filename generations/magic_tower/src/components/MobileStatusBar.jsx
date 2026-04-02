import React from 'react'

function MobileStatusBar({ player, currentFloor }) {
  const hpPercent = (player.hp / player.maxHp) * 100
  const hpColor = hpPercent > 60 ? 'bg-green-500' : hpPercent > 30 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-gray-700 p-3">
      <div className="flex items-center justify-between gap-2">
        {/* Floor Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-sm">
            F{currentFloor}
          </span>
        </div>

        {/* HP Bar */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-white text-xs">❤️</span>
          <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${hpColor} transition-all duration-300`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-white text-xs font-mono">
            {player.hp}/{player.maxHp}
          </span>
        </div>

        {/* Keys */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">🔑</span>
            <span className="text-white text-xs">{player.yellowKeys}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-400">🔑</span>
            <span className="text-white text-xs">{player.blueKeys}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-400">🔑</span>
            <span className="text-white text-xs">{player.redKeys}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mt-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-white">⚔️ {player.atk}</span>
          <span className="text-white">🛡️ {player.def}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">💰</span>
          <span className="text-white">{player.gold}</span>
        </div>
      </div>
    </div>
  )
}

export default MobileStatusBar
