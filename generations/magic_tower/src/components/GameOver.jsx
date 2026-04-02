import React, { useState, useEffect } from 'react'

function GameOver({ finalStats, onRetry, onRestart, onReturnToMenu }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setVisible(true), 100)
  }, [])

  // Generate somber rain particles
  const raindrops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2
  }))

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 game-over-screen ${visible ? 'visible' : ''}`}>
      {/* Dark animated gradient background */}
      <div className="absolute inset-0 game-over-gradient"></div>

      {/* Somber rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {raindrops.map(drop => (
          <div
            key={drop.id}
            className="game-over-raindrop"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      {/* Main content card */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 max-w-2xl w-full mx-4 text-center border-2 border-gray-700 game-over-card shadow-2xl">
        {/* Somber icon */}
        <div className="game-over-icon mb-4">
          <svg className="w-20 h-20 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Game Over title with somber styling */}
        <h1 className="text-6xl font-bold mb-4 game-over-title bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 bg-clip-text text-transparent">
          Game Over
        </h1>

        {/* Somber message */}
        <div className="mb-8 game-over-message">
          <p className="text-xl text-gray-400 mb-2">Your journey has ended...</p>
          <p className="text-base text-gray-500">The tower claims another soul</p>
        </div>

        {/* Final Stats with somber styling */}
        <div className="bg-gray-950 bg-opacity-60 rounded-xl p-8 mb-8 border border-gray-800 game-over-stats">
          <h2 className="text-2xl font-bold text-gray-400 mb-6 tracking-wide">Final Stats</h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              <span className="text-gray-500">Floor:</span>
              <span className="font-mono-stats text-gray-300 font-bold text-lg">{finalStats.floor}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              <span className="text-gray-500">Monsters:</span>
              <span className="font-mono-stats text-gray-300 font-bold text-lg">{finalStats.monstersKilled}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">👟</span>
              <span className="text-gray-500">Steps:</span>
              <span className="font-mono-stats text-gray-300 font-bold text-lg">{finalStats.steps}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">❤️</span>
              <span className="text-gray-500">Final HP:</span>
              <span className="font-mono-stats text-red-500 font-bold text-lg">{finalStats.hp}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              <span className="text-gray-500">Final ATK:</span>
              <span className="font-mono-stats text-orange-400 font-bold text-lg">{finalStats.atk}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-gray-500">Final DEF:</span>
              <span className="font-mono-stats text-blue-400 font-bold text-lg">{finalStats.def}</span>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <span className="text-2xl">💰</span>
              <span className="text-gray-500">Gold Collected:</span>
              <span className="font-mono-stats text-yellow-500 font-bold text-lg">{finalStats.gold}</span>
            </div>
          </div>
        </div>

        {/* Action buttons with gradient styling */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-blue-600"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry from Last Save
            </span>
          </button>

          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-600"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Restart from Beginning
            </span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-700"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Main Menu
            </span>
          </button>
        </div>

        {/* Encouraging footer message */}
        <p className="text-gray-600 text-base mt-6 italic">
          "The tower tests both strength and spirit. Try again, brave adventurer."
        </p>
      </div>
    </div>
  )
}

export default GameOver
