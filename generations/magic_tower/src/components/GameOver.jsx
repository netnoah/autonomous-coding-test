import React from 'react'

function GameOver({ finalStats, onRetry, onRestart, onReturnToMenu }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full mx-4 text-center border-4 border-red-600">
        <h1 className="text-5xl font-bold text-red-500 mb-6">Game Over</h1>

        <div className="text-gray-300 mb-6">
          <p className="text-lg mb-4">Your journey has ended...</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Final Stats</h2>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="text-gray-400">Floor Reached:</div>
            <div className="text-white font-bold">{finalStats.floor}</div>

            <div className="text-gray-400">Monsters Defeated:</div>
            <div className="text-white font-bold">{finalStats.monstersKilled}</div>

            <div className="text-gray-400">Steps Taken:</div>
            <div className="text-white font-bold">{finalStats.steps}</div>

            <div className="text-gray-400">Final HP:</div>
            <div className="text-red-400 font-bold">{finalStats.hp}</div>

            <div className="text-gray-400">Final ATK:</div>
            <div className="text-orange-400 font-bold">{finalStats.atk}</div>

            <div className="text-gray-400">Final DEF:</div>
            <div className="text-blue-400 font-bold">{finalStats.def}</div>

            <div className="text-gray-400">Gold Collected:</div>
            <div className="text-yellow-400 font-bold">{finalStats.gold}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Retry from Last Save
          </button>

          <button
            onClick={onRestart}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Restart from Beginning
          </button>

          <button
            onClick={onReturnToMenu}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Main Menu
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          Tip: Collect more equipment and items to progress further!
        </p>
      </div>
    </div>
  )
}

export default GameOver
