import React from 'react'

function Victory({ finalStats, onRestart, onReturnToMenu }) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full mx-4 text-center border-4 border-yellow-500">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2">Victory!</h1>
        <h2 className="text-2xl font-bold text-yellow-300 mb-6">🏆 Tower Conquered! 🏆</h2>

        <div className="text-gray-300 mb-6">
          <p className="text-lg">
            Congratulations! You have defeated the Tower Lord and conquered all 10 floors!
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Final Stats</h2>

          <div className="grid grid-cols-2 gap-4 text-left mb-4">
            <div className="text-gray-400">Floors Cleared:</div>
            <div className="text-white font-bold">{finalStats.floor}/10</div>

            <div className="text-gray-400">Monsters Defeated:</div>
            <div className="text-white font-bold">{finalStats.monstersKilled}</div>

            <div className="text-gray-400">Steps Taken:</div>
            <div className="text-white font-bold">{finalStats.steps}</div>

            <div className="text-gray-400">Final HP:</div>
            <div className="text-green-400 font-bold">{finalStats.hp}</div>

            <div className="text-gray-400">Final ATK:</div>
            <div className="text-orange-400 font-bold">{finalStats.atk}</div>

            <div className="text-gray-400">Final DEF:</div>
            <div className="text-blue-400 font-bold">{finalStats.def}</div>

            <div className="text-gray-400">Gold Collected:</div>
            <div className="text-yellow-400 font-bold">{finalStats.gold}</div>
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="text-gray-400 text-lg">Final Score:</div>
            <div className="text-yellow-400 text-3xl font-bold">{score.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again (New Game+)
          </button>

          <button
            onClick={onReturnToMenu}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Main Menu
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          Thank you for playing Magic Tower! 🎮
        </p>
      </div>
    </div>
  )
}

export default Victory
