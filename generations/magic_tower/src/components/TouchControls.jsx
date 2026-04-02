import React from 'react'

function TouchControls({ onMove }) {
  const handleTouchStart = (direction) => {
    onMove(direction)
  }

  return (
    <div className="touch-controls md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-col items-center gap-2">
        {/* Up Button */}
        <button
          onTouchStart={() => handleTouchStart('up')}
          onClick={() => handleTouchStart('up')}
          className="w-16 h-16 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg backdrop-blur-sm border-2 border-gray-600"
          aria-label="Move Up"
        >
          ⬆️
        </button>

        {/* Left and Right Buttons */}
        <div className="flex gap-2">
          <button
            onTouchStart={() => handleTouchStart('left')}
            onClick={() => handleTouchStart('left')}
            className="w-16 h-16 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg backdrop-blur-sm border-2 border-gray-600"
            aria-label="Move Left"
          >
            ⬅️
          </button>

          <button
            onTouchStart={() => handleTouchStart('right')}
            onClick={() => handleTouchStart('right')}
            className="w-16 h-16 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg backdrop-blur-sm border-2 border-gray-600"
            aria-label="Move Right"
          >
            ➡️
          </button>
        </div>

        {/* Down Button */}
        <button
          onTouchStart={() => handleTouchStart('down')}
          onClick={() => handleTouchStart('down')}
          className="w-16 h-16 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg backdrop-blur-sm border-2 border-gray-600"
          aria-label="Move Down"
        >
          ⬇️
        </button>
      </div>
    </div>
  )
}

export default TouchControls
