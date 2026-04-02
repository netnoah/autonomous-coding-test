import React, { useState, useEffect, useRef } from 'react'
import { TILE_TYPES, MONSTER_STATS } from '../game/gameReducer'
import MonsterTooltip from './MonsterTooltip'
import DamageNumber from './DamageNumber'
import ItemPickup from './ItemPickup'
import StatChangeAnimation from './StatChangeAnimation'
import DoorAnimation from './DoorAnimation'
import FloorTransition from './FloorTransition'
import CombatOverlay from './CombatOverlay'

function GameMap({ gameState, dispatch }) {
  const { currentFloor, player, maps, damageNumbers, itemPickups, statChangeAnimations, doorAnimations, floorTransition, combatOverlay, equipment } = gameState

  // Tooltip state
  const [hoveredTile, setHoveredTile] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedPlayerPos, setAnimatedPlayerPos] = useState({ x: player.x, y: player.y })
  const mapRef = useRef(null)
  const [tileSize, setTileSize] = useState(0)

  // Use the actual floor map from game state
  const currentMap = maps[currentFloor]

  // Calculate tile size on mount and resize
  useEffect(() => {
    const calculateTileSize = () => {
      if (mapRef.current) {
        const mapWidth = mapRef.current.offsetWidth
        setTileSize(mapWidth / 11) // 11 columns
      }
    }

    calculateTileSize()
    window.addEventListener('resize', calculateTileSize)

    // Recalculate after a short delay to ensure DOM is ready
    const timeout = setTimeout(calculateTileSize, 100)

    return () => {
      window.removeEventListener('resize', calculateTileSize)
      clearTimeout(timeout)
    }
  }, [])

  // Animate player movement
  useEffect(() => {
    if (player.x !== animatedPlayerPos.x || player.y !== animatedPlayerPos.y) {
      setIsAnimating(true)

      // Start animation
      const animationDuration = 120 // ms (within 100-150ms range)
      const startTime = Date.now()
      const startPos = { ...animatedPlayerPos }
      const endPos = { x: player.x, y: player.y }

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / animationDuration, 1)

        // Ease-out function for smoother deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        setAnimatedPlayerPos({
          x: startPos.x + (endPos.x - startPos.x) * easeProgress,
          y: startPos.y + (endPos.y - startPos.y) * easeProgress
        })

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [player.x, player.y, animatedPlayerPos.x, animatedPlayerPos.y])

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
        return 'tile-wall game-map-tile'
      case TILE_TYPES.HIDDEN_WALL:
        return isRevealedHiddenWall ? 'bg-gray-400 border-2 border-dashed border-gray-300 game-map-tile' : 'tile-wall game-map-tile'
      case TILE_TYPES.FLOOR:
        return 'tile-floor game-map-tile'
      case TILE_TYPES.YELLOW_DOOR:
        return 'bg-yellow-500 game-map-tile'
      case TILE_TYPES.BLUE_DOOR:
        return 'bg-blue-500 game-map-tile'
      case TILE_TYPES.RED_DOOR:
        return 'bg-red-500 game-map-tile'
      case TILE_TYPES.YELLOW_KEY:
        return 'bg-yellow-400 game-map-tile'
      case TILE_TYPES.BLUE_KEY:
        return 'bg-blue-400 game-map-tile'
      case TILE_TYPES.RED_KEY:
        return 'bg-red-400 game-map-tile'
      case TILE_TYPES.SMALL_POTION:
        return 'bg-pink-400 game-map-tile'
      case TILE_TYPES.BIG_POTION:
        return 'bg-pink-500 game-map-tile'
      case TILE_TYPES.SUPER_POTION:
        return 'bg-pink-600 game-map-tile'
      case TILE_TYPES.RED_GEM:
        return 'bg-red-400 game-map-tile'
      case TILE_TYPES.BLUE_GEM:
        return 'bg-blue-400 game-map-tile'
      case TILE_TYPES.GREEN_GEM:
        return 'bg-green-400 game-map-tile'
      case TILE_TYPES.GOLD_PILE:
        return 'bg-yellow-300 game-map-tile'
      case TILE_TYPES.BIG_GOLD_PILE:
        return 'bg-yellow-200 game-map-tile'
      case TILE_TYPES.IRON_SWORD:
        return 'bg-gray-400 game-map-tile'
      case TILE_TYPES.STEEL_SWORD:
        return 'bg-gray-300 game-map-tile'
      case TILE_TYPES.HOLY_SWORD:
        return 'bg-yellow-100 game-map-tile'
      case TILE_TYPES.WOODEN_SHIELD:
        return 'bg-amber-700 game-map-tile'
      case TILE_TYPES.IRON_SHIELD:
        return 'bg-gray-500 game-map-tile'
      case TILE_TYPES.HOLY_SHIELD:
        return 'bg-yellow-300 game-map-tile'
      case TILE_TYPES.ATTACK_BOOK:
        return 'bg-red-200 game-map-tile'
      case TILE_TYPES.DEFENSE_BOOK:
        return 'bg-blue-200 game-map-tile'
      case TILE_TYPES.STAIRS_UP:
        return 'bg-purple-400 game-map-tile'
      case TILE_TYPES.STAIRS_DOWN:
        return 'bg-purple-500 game-map-tile'
      case TILE_TYPES.GREEN_SLIME:
      case TILE_TYPES.RED_SLIME:
        return 'bg-green-500 game-map-tile'
      case TILE_TYPES.RED_BAT:
        return 'bg-red-600 game-map-tile'
      case TILE_TYPES.SKELETON:
        return 'bg-gray-400 game-map-tile'
      case TILE_TYPES.MAGICIAN:
        return 'bg-purple-600 game-map-tile'
      default:
        return 'tile-floor game-map-tile'
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
      case TILE_TYPES.NPC:
        return '🧙‍♂️'
      case TILE_TYPES.SHOPKEEPER:
        return '👨‍💼'
      default:
        return '☺'
    }
  }

  // Get directional player sprite
  const getPlayerSprite = () => {
    switch (player.direction) {
      case 'up':
        return '⬆️'
      case 'down':
        return '⬇️'
      case 'left':
        return '⬅️'
      case 'right':
        return '➡️'
      default:
        return '😀'
    }
  }

  // Check if tile is an item (for glow effect)
  const isItemTile = (tile) => {
    return [
      TILE_TYPES.YELLOW_KEY,
      TILE_TYPES.BLUE_KEY,
      TILE_TYPES.RED_KEY,
      TILE_TYPES.SMALL_POTION,
      TILE_TYPES.BIG_POTION,
      TILE_TYPES.SUPER_POTION,
      TILE_TYPES.RED_GEM,
      TILE_TYPES.BLUE_GEM,
      TILE_TYPES.GREEN_GEM,
      TILE_TYPES.GOLD_PILE,
      TILE_TYPES.BIG_GOLD_PILE,
      TILE_TYPES.IRON_SWORD,
      TILE_TYPES.STEEL_SWORD,
      TILE_TYPES.HOLY_SWORD,
      TILE_TYPES.WOODEN_SHIELD,
      TILE_TYPES.IRON_SHIELD,
      TILE_TYPES.HOLY_SHIELD,
      TILE_TYPES.ATTACK_BOOK,
      TILE_TYPES.DEFENSE_BOOK
    ].includes(tile)
  }

  // Check if tile is a monster (for idle animation)
  const isMonsterTile = (tile) => {
    return [
      TILE_TYPES.GREEN_SLIME,
      TILE_TYPES.RED_SLIME,
      TILE_TYPES.RED_BAT,
      TILE_TYPES.SKELETON,
      TILE_TYPES.MAGICIAN,
      TILE_TYPES.STONE_GOLEM,
      TILE_TYPES.DARK_KNIGHT,
      TILE_TYPES.WITCH,
      TILE_TYPES.VAMPIRE,
      TILE_TYPES.DRAGON,
      TILE_TYPES.DARK_MAGE,
      TILE_TYPES.SKELETON_KING,
      TILE_TYPES.MINI_BOSS,
      TILE_TYPES.FLOOR_GUARDIAN,
      TILE_TYPES.TOWER_LORD
    ].includes(tile)
  }

  // Check if tile is stairs (for glow animation)
  const isStairsTile = (tile) => {
    return [
      TILE_TYPES.STAIRS_UP,
      TILE_TYPES.STAIRS_DOWN
    ].includes(tile)
  }

  const handleTileClick = (x, y) => {
    // Prevent movement during animation
    if (isAnimating) {
      return
    }

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

  // Calculate player pixel position
  const playerPixelX = animatedPlayerPos.x * tileSize
  const playerPixelY = animatedPlayerPos.y * tileSize

  return (
    <div className="game-map">
      <div className="mb-4 text-center">
        <h2 className="font-pixel text-2xl text-yellow-400">Floor {currentFloor}</h2>
      </div>

      <div
        ref={mapRef}
        className="grid gap-0 border-4 border-gray-600 rounded-lg overflow-hidden relative"
        style={{
          gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
          width: 'min(80vw, 600px)',
          height: 'min(80vw, 600px)'
        }}
      >
        {currentMap.map((row, y) =>
          row.map((tile, x) => {
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
                  ${!isItemTile(tile) ? '' : 'item-glow'}
                  ${!isMonsterTile(tile) ? '' : 'monster-idle'}
                  ${tile === TILE_TYPES.STAIRS_UP ? 'stairs-up-animation' : ''}
                  ${tile === TILE_TYPES.STAIRS_DOWN ? 'stairs-down-animation' : ''}
                `}
                onClick={() => handleTileClick(x, y)}
                onMouseEnter={(e) => handleTileMouseEnter(tile, x, y, e)}
                onMouseLeave={handleTileMouseLeave}
                onMouseMove={handleMouseMove}
                title={`Tile (${x}, ${y})`}
              >
                {getTileSymbol(tile, x, y)}
              </div>
            )
          })
        )}

        {/* Animated Player Sprite */}
        <div
          className="absolute flex items-center justify-center font-pixel text-xs pointer-events-none"
          style={{
            left: `${playerPixelX}px`,
            top: `${playerPixelY}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            transition: 'none' // We handle animation manually with requestAnimationFrame
          }}
        >
          <div className="ring-2 ring-blue-400 ring-inset w-full h-full flex items-center justify-center">
            {getPlayerSprite()}
          </div>
        </div>

        {/* Monster Tooltip */}
        {hoveredMonster && (
          <MonsterTooltip
            monster={hoveredMonster}
            player={player}
            equipment={equipment}
            position={mousePosition}
          />
        )}

        {/* Damage Numbers */}
        {damageNumbers && damageNumbers.map(dn => (
          <DamageNumber
            key={dn.id}
            x={dn.x}
            y={dn.y}
            damage={dn.damage}
            type={dn.type}
            onComplete={() => dispatch({ type: 'REMOVE_DAMAGE_NUMBER', id: dn.id })}
          />
        ))}

        {/* Item Pickup Animations */}
        {itemPickups && itemPickups.map(ip => (
          <ItemPickup
            key={ip.id}
            x={ip.x}
            y={ip.y}
            itemType={ip.itemType}
            onComplete={() => dispatch({ type: 'REMOVE_ITEM_PICKUP', id: ip.id })}
          />
        ))}

        {/* Stat Change Animations */}
        {statChangeAnimations && statChangeAnimations.map(sca => (
          <StatChangeAnimation
            key={sca.id}
            x={sca.x}
            y={sca.y}
            statChangeText={sca.statChangeText}
            onComplete={() => dispatch({ type: 'REMOVE_STAT_CHANGE_ANIMATION', id: sca.id })}
          />
        ))}

        {/* Door Opening Animations */}
        {doorAnimations && doorAnimations.map(da => (
          <DoorAnimation
            key={da.id}
            x={da.x}
            y={da.y}
            doorType={da.doorType}
            onComplete={() => dispatch({ type: 'DOOR_ANIMATION_COMPLETE', id: da.id })}
          />
        ))}

        {/* Floor Transition Animation */}
        {floorTransition && (
          <FloorTransition
            isActive={floorTransition.isActive}
            fromFloor={floorTransition.fromFloor}
            toFloor={floorTransition.toFloor}
            direction={floorTransition.direction}
            onComplete={() => dispatch({
              type: 'COMPLETE_FLOOR_TRANSITION',
              toFloor: floorTransition.toFloor,
              direction: floorTransition.direction
            })}
          />
        )}

        {/* Combat Overlay */}
        {combatOverlay && (
          <CombatOverlay
            combat={combatOverlay}
            onClose={() => dispatch({ type: 'CLEAR_COMBAT_OVERLAY' })}
          />
        )}
      </div>
    </div>
  )
}

export default GameMap
