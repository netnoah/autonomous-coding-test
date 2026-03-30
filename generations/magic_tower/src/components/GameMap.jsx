import React, { useState } from 'react'
import { TILE_TYPES, MONSTER_STATS } from '../game/gameReducer'
import MonsterTooltip from './MonsterTooltip'

function GameMap({ gameState, dispatch }) {
  const { currentFloor, player, maps } = gameState

  // Tooltip state
  const [hoveredTile, setHoveredTile] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Use the actual floor map from game state
  const currentMap = maps[currentFloor]

  if (!currentMap) {
    return <div className="text-white">Loading floor...</div>
  }

  const getTileColor = (tile, x, y) => {
    // Check if this is a revealed hidden wall
    const isRevealedHiddenWall = tile === TILE_TYPES.HIDDEN_WALL &&
      gameState.revealedHiddenWalls &&
      gameState.revealedHiddenWalls[currentFloor] &&
      gameState.revealedHiddenWalls[currentFloor].includes(`${x},${y}`)

    switch (tile) {
      case TILE_TYPES.WALL:
        return 'bg-gray-600'
      case TILE_TYPES.HIDDEN_WALL:
        return isRevealedHiddenWall ? 'bg-gray-400 border-2 border-dashed border-gray-300' : 'bg-gray-600'
      case TILE_TYPES.FLOOR:
        return 'bg-gray-700'
      case TILE_TYPES.YELLOW_DOOR:
        return 'bg-yellow-500'
      case TILE_TYPES.BLUE_DOOR:
        return 'bg-blue-500'
      case TILE_TYPES.RED_DOOR:
        return 'bg-red-500'
      case TILE_TYPES.YELLOW_KEY:
        return 'bg-yellow-400'
      case TILE_TYPES.BLUE_KEY:
        return 'bg-blue-400'
      case TILE_TYPES.RED_KEY:
        return 'bg-red-400'
      case TILE_TYPES.SMALL_POTION:
        return 'bg-pink-400'
      case TILE_TYPES.BIG_POTION:
        return 'bg-pink-500'
      case TILE_TYPES.SUPER_POTION:
        return 'bg-pink-600'
      case TILE_TYPES.RED_GEM:
        return 'bg-red-400'
      case TILE_TYPES.BLUE_GEM:
        return 'bg-blue-400'
      case TILE_TYPES.GREEN_GEM:
        return 'bg-green-400'
      case TILE_TYPES.GOLD_PILE:
        return 'bg-yellow-300'
      case TILE_TYPES.BIG_GOLD_PILE:
        return 'bg-yellow-200'
      case TILE_TYPES.IRON_SWORD:
        return 'bg-gray-400'
      case TILE_TYPES.STEEL_SWORD:
        return 'bg-gray-300'
      case TILE_TYPES.HOLY_SWORD:
        return 'bg-yellow-100'
      case TILE_TYPES.WOODEN_SHIELD:
        return 'bg-amber-700'
      case TILE_TYPES.IRON_SHIELD:
        return 'bg-gray-500'
      case TILE_TYPES.HOLY_SHIELD:
        return 'bg-yellow-300'
      case TILE_TYPES.ATTACK_BOOK:
        return 'bg-red-200'
      case TILE_TYPES.DEFENSE_BOOK:
        return 'bg-blue-200'
      case TILE_TYPES.STAIRS_UP:
        return 'bg-purple-400'
      case TILE_TYPES.STAIRS_DOWN:
        return 'bg-purple-500'
      case TILE_TYPES.GREEN_SLIME:
      case TILE_TYPES.RED_SLIME:
        return 'bg-green-500'
      case TILE_TYPES.RED_BAT:
        return 'bg-red-600'
      case TILE_TYPES.SKELETON:
        return 'bg-gray-400'
      case TILE_TYPES.MAGICIAN:
        return 'bg-purple-600'
      default:
        return 'bg-gray-700'
    }
  }

  const getTileSymbol = (tile, x, y) => {
    // Check if this is a revealed hidden wall
    const isRevealedHiddenWall = tile === TILE_TYPES.HIDDEN_WALL &&
      gameState.revealedHiddenWalls &&
      gameState.revealedHiddenWalls[currentFloor] &&
      gameState.revealedHiddenWalls[currentFloor].includes(`${x},${y}`)

    switch (tile) {
      case TILE_TYPES.WALL:
        return '█'
      case TILE_TYPES.HIDDEN_WALL:
        return isRevealedHiddenWall ? '░' : '█'
      case TILE_TYPES.FLOOR:
        return '·'
      case TILE_TYPES.YELLOW_DOOR:
      case TILE_TYPES.BLUE_DOOR:
      case TILE_TYPES.RED_DOOR:
        return '▓'
      case TILE_TYPES.YELLOW_KEY:
      case TILE_TYPES.BLUE_KEY:
      case TILE_TYPES.RED_KEY:
        return '🔑'
      case TILE_TYPES.SMALL_POTION:
      case TILE_TYPES.BIG_POTION:
      case TILE_TYPES.SUPER_POTION:
        return '⚗'
      case TILE_TYPES.RED_GEM:
      case TILE_TYPES.BLUE_GEM:
      case TILE_TYPES.GREEN_GEM:
        return '♦'
      case TILE_TYPES.GOLD_PILE:
      case TILE_TYPES.BIG_GOLD_PILE:
        return '●'
      case TILE_TYPES.IRON_SWORD:
        return '⚔️'
      case TILE_TYPES.STEEL_SWORD:
        return '⚔️'
      case TILE_TYPES.HOLY_SWORD:
        return '⚔️'
      case TILE_TYPES.WOODEN_SHIELD:
        return '🛡️'
      case TILE_TYPES.IRON_SHIELD:
        return '🛡️'
      case TILE_TYPES.HOLY_SHIELD:
        return '🛡️'
      case TILE_TYPES.ATTACK_BOOK:
        return '📕'
      case TILE_TYPES.DEFENSE_BOOK:
        return '📘'
      case TILE_TYPES.STAIRS_UP:
        return '▲'
      case TILE_TYPES.STAIRS_DOWN:
        return '▼'
      default:
        return '☺'
    }
  }

  const handleTileClick = (x, y) => {
    const dx = Math.abs(x - player.x)
    const dy = Math.abs(y - player.y)

    // Only allow adjacent tiles
    if (dx + dy === 1) {
      let direction = ''
      if (y < player.y) direction = 'up'
      else if (y > player.y) direction = 'down'
      else if (x < player.x) direction = 'left'
      else if (x > player.x) direction = 'right'

      dispatch({ type: 'MOVE', direction })
    }
  }

  const handleTileMouseEnter = (tile, x, y, event) => {
    // Only show tooltip for monsters
    const monsterStats = MONSTER_STATS[tile]
    if (monsterStats) {
      setHoveredTile({ tile, x, y, stats: monsterStats })
      setMousePosition({ x: event.clientX, y: event.clientY })
    } else {
      setHoveredTile(null)
    }
  }

  const handleTileMouseLeave = () => {
    setHoveredTile(null)
  }

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  // Check if hovered tile is a monster
  const hoveredMonster = hoveredTile && hoveredTile.stats ? hoveredTile.stats : null

  return (
    <div className="game-map">
      <div className="mb-4 text-center">
        <h2 className="font-pixel text-2xl text-yellow-400">Floor {currentFloor}</h2>
      </div>

      <div
        className="grid gap-0 border-4 border-gray-600 rounded-lg overflow-hidden relative"
        style={{
          gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
          width: 'min(80vw, 600px)',
          height: 'min(80vw, 600px)'
        }}
      >
        {currentMap.map((row, y) =>
          row.map((tile, x) => {
            const isPlayer = x === player.x && y === player.y

            return (
              <div
                key={`${x}-${y}`}
                className={`
                  ${getTileColor(tile, x, y)}
                  flex items-center justify-center
                  cursor-pointer
                  hover:opacity-80
                  transition-opacity
                  font-pixel text-xs
                  ${isPlayer ? 'ring-2 ring-blue-400 ring-inset' : ''}
                `}
                onClick={() => handleTileClick(x, y)}
                onMouseEnter={(e) => handleTileMouseEnter(tile, x, y, e)}
                onMouseLeave={handleTileMouseLeave}
                onMouseMove={handleMouseMove}
                title={`Tile (${x}, ${y})`}
              >
                {isPlayer ? '😀' : getTileSymbol(tile, x, y)}
              </div>
            )
          })
        )}

        {/* Monster Tooltip */}
        {hoveredMonster && (
          <MonsterTooltip
            monster={hoveredMonster}
            player={player}
            position={mousePosition}
          />
        )}
      </div>
    </div>
  )
}

export default GameMap
