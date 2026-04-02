import React, { useReducer, useEffect, useState } from 'react'
import gameReducer, { initialGameState } from '../game/gameReducer'
import GameMap from './GameMap'
import StatusPanel from './StatusPanel'
import MessageLog from './MessageLog'
import ShopModal from './ShopModal'
import HelpModal from './HelpModal'
import SaveLoadModal from './SaveLoadModal'
import DialogueModal from './DialogueModal'
import TouchControls from './TouchControls'
import MobileStatusBar from './MobileStatusBar'

function Game({ onReturnToMenu, onGameOver, onVictory, initialLoadState, settings }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState)
  const [helpOpen, setHelpOpen] = useState(false)
  const [saveLoadOpen, setSaveLoadOpen] = useState(false)
  const [previousFloor, setPreviousFloor] = useState(0)

  // Keyboard input handling with key repeat support
  useEffect(() => {
    const pressedKeys = new Set()
    const keyTimers = new Map() // Store timers for each key
    const moveDirections = new Map() // Map keys to move directions

    const getDirection = (key) => {
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          return 'up'
        case 'ArrowDown':
        case 's':
        case 'S':
          return 'down'
        case 'ArrowLeft':
        case 'a':
        case 'A':
          return 'left'
        case 'ArrowRight':
        case 'd':
        case 'D':
          return 'right'
        default:
          return null
      }
    }

    const handleKeyDown = (event) => {
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key)) {
        event.preventDefault()
      }

      // Handle non-movement keys immediately
      if (event.key === 'Escape') {
        onReturnToMenu()
        return
      }
      if (event.key === 'h' || event.key === 'H') {
        setHelpOpen(true)
        return
      }

      // Handle movement keys
      const direction = getDirection(event.key)
      if (direction) {
        // Ignore if key is already pressed (prevent duplicate events)
        if (pressedKeys.has(event.key)) {
          return
        }

        pressedKeys.add(event.key)
        moveDirections.set(event.key, direction)

        // Always trigger initial movement
        dispatch({ type: 'MOVE', direction })

        // If key repeat is enabled, start repeating
        if (settings.keyRepeat) {
          // Initial delay before repeating (150ms)
          const initialDelayTimer = setTimeout(() => {
            // Then repeat every 80ms
            const repeatTimer = setInterval(() => {
              if (pressedKeys.has(event.key)) {
                dispatch({ type: 'MOVE', direction })
              } else {
                clearInterval(repeatTimer)
              }
            }, 80)

            keyTimers.set(event.key + '_repeat', repeatTimer)
          }, 150)

          keyTimers.set(event.key + '_initial', initialDelayTimer)
        }
      }
    }

    const handleKeyUp = (event) => {
      const direction = getDirection(event.key)
      if (direction || pressedKeys.has(event.key)) {
        pressedKeys.delete(event.key)
        moveDirections.delete(event.key)

        // Clear timers
        const initialTimer = keyTimers.get(event.key + '_initial')
        const repeatTimer = keyTimers.get(event.key + '_repeat')

        if (initialTimer) {
          clearTimeout(initialTimer)
          keyTimers.delete(event.key + '_initial')
        }
        if (repeatTimer) {
          clearInterval(repeatTimer)
          keyTimers.delete(event.key + '_repeat')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      // Clear all timers
      keyTimers.forEach(timer => {
        clearTimeout(timer)
        clearInterval(timer)
      })
    }
  }, [onReturnToMenu, settings.keyRepeat])

  // Check for game over
  useEffect(() => {
    if (gameState.player.hp <= 0) {
      // Prepare final stats
      const finalStats = {
        floor: gameState.currentFloor,
        monstersKilled: gameState.monstersKilled || 0,
        steps: gameState.player.steps,
        hp: 0,
        atk: gameState.player.atk,
        def: gameState.player.def,
        gold: gameState.player.gold
      }
      onGameOver(finalStats)
    }
  }, [gameState.player.hp, onGameOver, gameState.currentFloor, gameState.monstersKilled, gameState.player.steps, gameState.player.atk, gameState.player.def, gameState.player.gold])

  // Check for victory (reached floor 10 and defeated boss)
  useEffect(() => {
    if (gameState.currentFloor === 10 && gameState.victory) {
      // Prepare final stats
      const finalStats = {
        floor: gameState.currentFloor,
        monstersKilled: gameState.monstersKilled || 0,
        steps: gameState.player.steps,
        hp: gameState.player.hp,
        atk: gameState.player.atk,
        def: gameState.player.def,
        gold: gameState.player.gold
      }
      onVictory(finalStats)
    }
  }, [gameState.currentFloor, gameState.victory, onVictory, gameState.monstersKilled, gameState.player.steps, gameState.player.hp, gameState.player.atk, gameState.player.def, gameState.player.gold])

  // Handle buying item from shop
  const handleBuyItem = (item) => {
    dispatch({ type: 'BUY_ITEM', item })
  }

  // Handle closing shop
  const handleCloseShop = () => {
    dispatch({ type: 'CLOSE_SHOP' })
  }

  // Handle closing NPC dialogue
  const handleCloseDialogue = () => {
    dispatch({ type: 'CLOSE_NPC_DIALOGUE' })
  }

  // Get current game data for saving
  const getGameData = () => {
    return {
      player: gameState.player,
      currentFloor: gameState.currentFloor,
      victory: gameState.victory,
      visitedFloors: gameState.visitedFloors,
      monstersKilled: gameState.monstersKilled,
      maps: gameState.maps,
      playerStats: {
        hp: gameState.player.hp,
        maxHp: gameState.player.maxHp,
        atk: gameState.player.atk,
        def: gameState.player.def,
        gold: gameState.player.gold,
        yellowKeys: gameState.player.yellowKeys,
        blueKeys: gameState.player.blueKeys,
        redKeys: gameState.player.redKeys,
        floor: gameState.player.floor,
        steps: gameState.player.steps
      }
    }
  }

  // Handle save game
  const handleSaveGame = (slot, saveData) => {
    console.log(`Game saved to ${slot}`)
  }

  // Handle load game
  const handleLoadGame = (saveData) => {
    // Dispatch loaded state
    dispatch({ type: 'LOAD_GAME', payload: saveData })
    console.log('Game loaded successfully')
  }

  // Auto-save when floor changes
  useEffect(() => {
    if (gameState.currentFloor !== previousFloor && previousFloor !== 0) {
      // Save to auto-save slot
      const autoSaveData = {
        ...getGameData(),
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('magicTowerAutoSave', JSON.stringify(autoSaveData))
      console.log(`Auto-saved on floor ${gameState.currentFloor}`)
    }
    setPreviousFloor(gameState.currentFloor)
  }, [gameState.currentFloor])

  // Load initial state if provided (from continue game)
  useEffect(() => {
    if (initialLoadState) {
      dispatch({ type: 'LOAD_GAME', payload: initialLoadState })
    }
  }, [initialLoadState])

  return (
    <div className="game-container flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Desktop: Floor Indicator Bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-3 bg-black/30 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToMenu}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Menu
          </button>
          <div className="text-gray-400 text-sm">
            Press <span className="text-yellow-400 font-bold">ESC</span> to return
          </div>
        </div>
        <div className="flex items-center gap-4">
          <h2 className="font-pixel text-xl text-yellow-400">
            Floor {gameState.currentFloor}
          </h2>
          <div className="text-gray-400 text-sm">
            {gameState.currentFloor === 0 ? 'Ground Floor' :
             gameState.currentFloor === 10 ? 'Tower Top' :
             `Floor ${gameState.currentFloor}`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHelpOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg text-sm flex items-center gap-2"
          >
            <span>❓</span> Help (H)
          </button>
          <button
            onClick={() => setSaveLoadOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg text-sm flex items-center gap-2"
          >
            <span>💾</span> Save
          </button>
        </div>
      </div>

      {/* Mobile: Status Bar Overlay */}
      <MobileStatusBar
        player={gameState.player}
        currentFloor={gameState.currentFloor}
      />

      {/* Desktop: Middle Section - Game Map and Status Panel */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left: Game Map (centered) */}
        <div className="flex-1 flex items-center justify-center p-6">
          <GameMap
            gameState={gameState}
            dispatch={dispatch}
          />
        </div>

        {/* Right: Status Panel */}
        <div className="w-96 p-6 flex flex-col gap-4 bg-black/20 border-l border-gray-700">
          <StatusPanel gameState={gameState} />
        </div>
      </div>

      {/* Mobile: Full Screen Game Map */}
      <div className="md:hidden flex-1 flex items-center justify-center p-4 pt-24 pb-24">
        <GameMap
          gameState={gameState}
          dispatch={dispatch}
        />
      </div>

      {/* Desktop: Bottom Message Log */}
      <div className="hidden md:block h-48 px-6 py-3 bg-black/40 border-t border-gray-700">
        <MessageLog messages={gameState.messages} />
      </div>

      {/* Mobile: Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-t border-gray-700 p-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onReturnToMenu}
            className="flex-1 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Menu
          </button>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex-1 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
          >
            ❓ Help
          </button>
          <button
            onClick={() => setSaveLoadOpen(true)}
            className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Mobile: Touch Controls */}
      <TouchControls onMove={(direction) => dispatch({ type: 'MOVE', direction })} />

      {/* Shop Modal */}
      <ShopModal
        isOpen={gameState.shopOpen}
        onClose={handleCloseShop}
        playerGold={gameState.player.gold}
        onBuyItem={handleBuyItem}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* Save/Load Modal */}
      <SaveLoadModal
        isOpen={saveLoadOpen}
        onClose={() => setSaveLoadOpen(false)}
        gameData={getGameData()}
        onSaveGame={handleSaveGame}
        onLoadGame={handleLoadGame}
      />

      {/* NPC Dialogue Modal */}
      <DialogueModal
        isOpen={gameState.npcDialogueOpen}
        onClose={handleCloseDialogue}
        npcName={gameState.dialogueContent?.npcName || 'NPC'}
        dialoguePages={gameState.dialogueContent?.dialoguePages || []}
      />
    </div>
  )
}

export default Game
