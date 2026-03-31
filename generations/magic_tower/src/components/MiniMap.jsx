import React from 'react'
import { TILE_TYPES } from '../game/gameReducer'

function MiniMap({ gameState }) {
  const { currentFloor, maps, exploredTiles, player } = gameState

  // Get current floor map
  const currentMap = maps[currentFloor]
  if (!currentMap) return null

  // Get explored tiles for current floor
  const floorExplored = exploredTiles[currentFloor] || []

  // Helper to check if a tile is explored
  const isExplored = (x, y) => {
    return floorExplored.includes(`${x},${y}`)
  }

  // Helper to get tile display for mini-map
  const getTileDisplay = (tileType, x, y) => {
    // If not explored, show as dark/fog
    if (!isExplored(x, y)) {
      return 'bg-gray-900'
    }

    // Explored tiles
    switch (tileType) {
      case TILE_TYPES.WALL:
        return 'bg-gray-600'
      case TILE_TYPES.FLOOR:
        return 'bg-gray-700'
      case TILE_TYPES.HIDDEN_WALL:
        return 'bg-gray-800'
      case TILE_TYPES.STAIRS_UP:
      case TILE_TYPES.STAIRS_DOWN:
        return 'bg-purple-500'
      case TILE_TYPES.YELLOW_DOOR:
        return 'bg-yellow-600'
      case TILE_TYPES.BLUE_DOOR:
        return 'bg-blue-600'
      case TILE_TYPES.RED_DOOR:
        return 'bg-red-600'
      case TILE_TYPES.YELLOW_KEY:
      case TILE_TYPES.BLUE_KEY:
      case TILE_TYPES.RED_KEY:
        return 'bg-yellow-400'
      case TILE_TYPES.SMALL_POTION:
      case TILE_TYPES.BIG_POTION:
      case TILE_TYPES.SUPER_POTION:
        return 'bg-green-500'
      case TILE_TYPES.RED_GEM:
        return 'bg-red-400'
      case TILE_TYPES.BLUE_GEM:
        return 'bg-blue-400'
      case TILE_TYPES.GREEN_GEM:
        return 'bg-green-400'
      case TILE_TYPES.GOLD_PILE:
      case TILE_TYPES.BIG_GOLD_PILE:
        return 'bg-yellow-300'
      case TILE_TYPES.IRON_SWORD:
      case TILE_TYPES.STEEL_SWORD:
      case TILE_TYPES.HOLY_SWORD:
        return 'bg-orange-500'
      case TILE_TYPES.WOODEN_SHIELD:
      case TILE_TYPES.IRON_SHIELD:
      case TILE_TYPES.HOLY_SHIELD:
        return 'bg-blue-300'
      default:
        // Monsters and NPCs
        if (tileType >= 100) {
          return 'bg-red-500'
        }
        return 'bg-gray-700'
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <h3 className="text-sm text-gray-400 mb-2">Mini-Map</h3>
      <div className="bg-gray-900 rounded p-2 flex items-center justify-center">
        <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(11, 1fr)' }}>
          {currentMap.map((row, y) =>
            row.map((tile, x) => {
              const isPlayer = player.x === x && player.y === y
              const tileClass = getTileDisplay(tile, x, y)

              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-2 h-2 ${tileClass} ${isPlayer ? 'ring-1 ring-blue-400' : ''}`}
                  title={`(${x}, ${y})`}
                />
              )
            })
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        Floor {currentFloor}
      </div>
    </div>
  )
}

export default MiniMap
