import React, { useState, useEffect } from 'react'
import SettingsModal from './SettingsModal'
import HelpModal from './HelpModal'

function MainMenu({ onStartNewGame, onContinueGame, settings, onSettingsChange }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  return (
    <div className="main-menu flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center fade-in">
        {/* Game Title */}
        <h1 className="font-pixel text-5xl md:text-7xl text-yellow-400 mb-4 tracking-wider">
          魔塔
        </h1>
        <h2 className="font-pixel text-2xl md:text-3xl text-blue-400 mb-12">
          Magic Tower
        </h2>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={onStartNewGame}
            className="w-64 px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold text-lg rounded-lg hover:from-yellow-500 hover:to-yellow-400 shadow-lg"
          >
            New Game
          </button>

          <button
            onClick={onContinueGame}
            className="w-64 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg rounded-lg hover:from-blue-500 hover:to-blue-400 shadow-lg"
          >
            Continue Game
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-64 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold text-lg rounded-lg hover:from-gray-500 hover:to-gray-400 shadow-lg"
          >
            Settings
          </button>

          <button
            onClick={() => setHelpOpen(true)}
            className="w-64 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold text-lg rounded-lg hover:from-purple-500 hover:to-purple-400 shadow-lg"
          >
            Help / About
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-gray-400 text-sm">
          <p>A Classic RPG Puzzle Game</p>
          <p className="mt-2 text-xs">Navigate • Fight • Solve • Ascend</p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  )
}

export default MainMenu
