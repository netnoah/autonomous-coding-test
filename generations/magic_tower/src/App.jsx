import React, { useState, useEffect } from 'react'
import MainMenu from './components/MainMenu'
import Game from './components/Game'
import GameOver from './components/GameOver'
import Victory from './components/Victory'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'paused', 'gameOver', 'victory'
  const [finalStats, setFinalStats] = useState(null)
  const [loadedGameData, setLoadedGameData] = useState(null)
  const [settings, setSettings] = useState({
    musicVolume: 70,
    sfxVolume: 80,
    movementSpeed: 'smooth',
    keyRepeat: false,
    theme: 'classic',
    showMonsterStats: true,
    autoSave: true
  })

  // Loading screen state
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('magicTowerSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const handleStartNewGame = () => {
    setFinalStats(null)
    setLoadedGameData(null) // Clear any loaded data for new game
    setGameState('playing')
  }

  const handleContinueGame = () => {
    // Try to load from auto-save first, then check each slot
    let mostRecentSave = null
    let mostRecentTimestamp = null

    // Check auto-save
    const autoSave = localStorage.getItem('magicTowerAutoSave')
    if (autoSave) {
      try {
        const parsed = JSON.parse(autoSave)
        mostRecentSave = parsed
        mostRecentTimestamp = parsed.timestamp
      } catch (e) {
        console.error('Failed to parse auto-save:', e)
      }
    }

    // Check each slot for more recent saves
    const slots = ['magicTowerSave1', 'magicTowerSave2', 'magicTowerSave3']
    slots.forEach(slotKey => {
      const saveData = localStorage.getItem(slotKey)
      if (saveData) {
        try {
          const parsed = JSON.parse(saveData)
          if (!mostRecentTimestamp || new Date(parsed.timestamp) > new Date(mostRecentTimestamp)) {
            mostRecentSave = parsed
            mostRecentTimestamp = parsed.timestamp
          }
        } catch (e) {
          console.error(`Failed to parse ${slotKey}:`, e)
        }
      }
    })

    if (mostRecentSave) {
      setLoadedGameData(mostRecentSave)
      setFinalStats(null)
      setGameState('playing')
    } else {
      alert('No saved games found!')
    }
  }

  const handleReturnToMenu = () => {
    setFinalStats(null)
    setLoadedGameData(null) // Clear loaded data when returning to menu
    setGameState('menu')
  }

  const handleRestart = () => {
    setFinalStats(null)
    setLoadedGameData(null) // Clear loaded data for complete restart
    setGameState('playing')
  }

  const handleRetryFromSave = () => {
    // Load the most recent save, similar to handleContinueGame
    let mostRecentSave = null
    let mostRecentTimestamp = null

    // Check auto-save first
    const autoSave = localStorage.getItem('magicTowerAutoSave')
    if (autoSave) {
      try {
        const parsed = JSON.parse(autoSave)
        mostRecentSave = parsed
        mostRecentTimestamp = parsed.timestamp
      } catch (e) {
        console.error('Failed to parse auto-save:', e)
      }
    }

    // Check each slot for more recent saves
    const slots = ['magicTowerSave1', 'magicTowerSave2', 'magicTowerSave3']
    slots.forEach(slotKey => {
      const saveData = localStorage.getItem(slotKey)
      if (saveData) {
        try {
          const parsed = JSON.parse(saveData)
          if (!mostRecentTimestamp || new Date(parsed.timestamp) > new Date(mostRecentTimestamp)) {
            mostRecentSave = parsed
            mostRecentTimestamp = parsed.timestamp
          }
        } catch (e) {
          console.error(`Failed to parse ${slotKey}:`, e)
        }
      }
    })

    if (mostRecentSave) {
      setLoadedGameData(mostRecentSave)
      setFinalStats(null)
      setGameState('playing')
    } else {
      alert('No saved games found! Starting new game instead.')
      setFinalStats(null)
      setLoadedGameData(null)
      setGameState('playing')
    }
  }

  const handleGameOver = (stats) => {
    setFinalStats(stats)
    setGameState('gameOver')
  }

  const handleVictory = (stats) => {
    setFinalStats(stats)
    setGameState('victory')
  }

  return (
    <div className="App">
      {/* Initial Loading Screen */}
      <LoadingScreen
        isVisible={isLoading}
        onComplete={() => setIsLoading(false)}
      />

      {/* Main App Content - Only show after loading completes */}
      {!isLoading && (
        <>
          {gameState === 'menu' && (
            <MainMenu
              onStartNewGame={handleStartNewGame}
              onContinueGame={handleContinueGame}
              settings={settings}
              onSettingsChange={setSettings}
            />
          )}
          {gameState === 'playing' && (
            <Game
              onReturnToMenu={handleReturnToMenu}
              onGameOver={handleGameOver}
              onVictory={handleVictory}
              initialLoadState={loadedGameData}
              settings={settings}
            />
          )}
          {gameState === 'gameOver' && finalStats && (
            <GameOver
              finalStats={finalStats}
              onRetry={handleRetryFromSave}
              onRestart={handleRestart}
              onReturnToMenu={handleReturnToMenu}
            />
          )}
          {gameState === 'victory' && finalStats && (
            <Victory
              finalStats={finalStats}
              onRestart={handleRestart}
              onReturnToMenu={handleReturnToMenu}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
