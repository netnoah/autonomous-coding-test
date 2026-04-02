import React, { useState, useEffect } from 'react'

function Victory({ finalStats, onRestart, onReturnToMenu }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [scoreAnimated, setScoreAnimated] = useState(0)

  // Calculate a score based on stats
  const calculateScore = () => {
    const floorBonus = finalStats.floor * 1000
    const monsterBonus = finalStats.monstersKilled * 100
    const goldBonus = finalStats.gold * 10
    const stepPenalty = Math.floor(finalStats.steps / 10)
    const score = floorBonus + monsterBonus + goldBonus + 10000 - stepPenalty
    return Math.max(score, 0)
  }

  const score = calculateScore()

  // Animate score on mount
  useEffect(() => {
    setShowConfetti(true)

    // Animate score from 0 to final value
    let currentScore = 0
    const targetScore = score
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = targetScore / steps
    const interval = duration / steps

    const timer = setInterval(() => {
      currentScore += increment
      if (currentScore >= targetScore) {
        setScoreAnimated(targetScore)
        clearInterval(timer)
      } else {
        setScoreAnimated(Math.floor(currentScore))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [score])

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 2}s`,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 6)],
    size: `${10 + Math.random() * 10}px`
  }))

  return (
    <div className="victory-screen fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 animate-victoryGradient"></div>

      {/* Sparkle effect overlay */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="victory-sparkle absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="victory-confetti absolute"
              style={{
                left: piece.left,
                top: '-20px',
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                animationDelay: piece.animationDelay,
                animationDuration: piece.animationDuration
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Main content card */}
      <div className="victory-card relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full mx-4 text-center border-4 border-yellow-500 shadow-2xl">
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl border-4 border-yellow-400 animate-pulse opacity-50 blur-sm"></div>

        {/* Trophy and title */}
        <div className="relative mb-6">
          <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '1s' }}>
            🏆
          </div>
          <h1 className="victory-title text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 mb-2"
              style={{
                textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)',
                animation: 'victoryTitleGlow 2s ease-in-out infinite'
              }}>
            VICTORY!
          </h1>
          <h2 className="text-2xl font-bold text-yellow-300 mb-4 animate-pulse"
              style={{
                textShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
              }}>
            🎉 Tower Conquered! 🎉
          </h2>
        </div>

        {/* Congratulations message */}
        <div className="text-gray-200 mb-6 bg-gradient-to-r from-yellow-900/30 to-transparent p-4 rounded-lg border border-yellow-700/30">
          <p className="text-lg font-semibold">
            ✨ Congratulations, Hero! ✨
          </p>
          <p className="text-gray-300 mt-2">
            You have defeated the Tower Lord and conquered all {finalStats.floor} floors!
            Your legend will be remembered for ages.
          </p>
        </div>

        {/* Final Stats */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 mb-6 border-2 border-yellow-600/50">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">📊</span>
            Final Stats
            <span className="text-2xl">📊</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 text-left mb-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🏢</span>
              <span className="text-gray-400">Floors Cleared:</span>
            </div>
            <div className="font-mono-stats text-white font-bold text-lg">{finalStats.floor}/10</div>

            <div className="flex items-center gap-2">
              <span className="text-red-400">⚔️</span>
              <span className="text-gray-400">Monsters Defeated:</span>
            </div>
            <div className="font-mono-stats text-white font-bold text-lg">{finalStats.monstersKilled}</div>

            <div className="flex items-center gap-2">
              <span className="text-green-400">👟</span>
              <span className="text-gray-400">Steps Taken:</span>
            </div>
            <div className="font-mono-stats text-white font-bold text-lg">{finalStats.steps}</div>

            <div className="flex items-center gap-2">
              <span className="text-pink-400">❤️</span>
              <span className="text-gray-400">Final HP:</span>
            </div>
            <div className="font-mono-stats text-green-400 font-bold text-lg">{finalStats.hp}</div>

            <div className="flex items-center gap-2">
              <span className="text-orange-400">⚔️</span>
              <span className="text-gray-400">Final ATK:</span>
            </div>
            <div className="font-mono-stats text-orange-400 font-bold text-lg">{finalStats.atk}</div>

            <div className="flex items-center gap-2">
              <span className="text-cyan-400">🛡️</span>
              <span className="text-gray-400">Final DEF:</span>
            </div>
            <div className="font-mono-stats text-blue-400 font-bold text-lg">{finalStats.def}</div>

            <div className="flex items-center gap-2">
              <span className="text-yellow-400">💰</span>
              <span className="text-gray-400">Gold Collected:</span>
            </div>
            <div className="font-mono-stats text-yellow-400 font-bold text-lg">{finalStats.gold}</div>
          </div>

          {/* Score with special styling */}
          <div className="border-t-2 border-yellow-600/50 pt-4 mt-4 bg-gradient-to-r from-yellow-900/20 to-transparent rounded-lg p-4">
            <div className="text-gray-300 text-xl mb-2 font-semibold">⭐ Final Score ⭐</div>
            <div className="font-mono-stats text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-5xl font-bold"
                style={{
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
                  animation: 'scorePulse 1s ease-in-out infinite'
                }}>
              {scoreAnimated.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action buttons with enhanced styling */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="victory-button victory-button-primary group relative px-8 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🔄 Play Again (New Game+)
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={onReturnToMenu}
            className="victory-button victory-button-secondary group relative px-8 py-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🏠 Return to Main Menu
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Footer message */}
        <div className="mt-6 text-gray-400 text-sm space-y-1">
          <p className="flex items-center justify-center gap-2">
            <span className="text-xl">🎮</span>
            <span>Thank you for playing Magic Tower!</span>
            <span className="text-xl">🎮</span>
          </p>
          <p className="text-gray-500 text-xs">
            Your heroic deeds will be celebrated throughout the land!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Victory
