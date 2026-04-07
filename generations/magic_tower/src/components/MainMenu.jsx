import React, { useState, useEffect } from 'react'
import SettingsModal from './SettingsModal'
import HelpModal from './HelpModal'

function MainMenu({ onStartNewGame, onContinueGame, settings, onSettingsChange }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="main-menu flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Atmospheric dungeon background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950"></div>

      {/* Stone wall pattern overlay */}
      <div className="absolute inset-0 opacity-10"
           style={{
             backgroundImage: `
               repeating-linear-gradient(
                 0deg,
                 transparent,
                 transparent 2px,
                 rgba(0, 0, 0, 0.3) 2px,
                 rgba(0, 0, 0, 0.3) 4px
               ),
               repeating-linear-gradient(
                 90deg,
                 transparent,
                 transparent 2px,
                 rgba(0, 0, 0, 0.3) 2px,
                 rgba(0, 0, 0, 0.3) 4px
               )
             `
           }}>
      </div>

      {/* Animated torch light effects */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-orange-500 rounded-full blur-3xl animate-pulse opacity-20"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-orange-500 rounded-full blur-3xl animate-pulse opacity-20" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-32 h-32 bg-yellow-500 rounded-full blur-3xl animate-pulse opacity-15" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-32 right-1/3 w-32 h-32 bg-yellow-500 rounded-full blur-3xl animate-pulse opacity-15" style={{animationDelay: '1.5s'}}></div>

      {/* Mystical fog effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center fade-in">
        {/* Game Title with enhanced styling */}
        <div className="mb-8">
          <h1 className="font-pixel text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 mb-4 tracking-wider drop-shadow-2xl"
              style={{
                textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.8)'
              }}>
            魔塔
          </h1>
          <h2 className="font-pixel text-xl md:text-2xl text-blue-300 tracking-widest"
              style={{
                textShadow: '0 0 20px rgba(100, 150, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)'
              }}>
            MAGIC TOWER
          </h2>
        </div>

        {/* Subtitle with tagline */}
        <p className="text-gray-300 text-sm mb-12 tracking-wide">
          A Classic RPG Puzzle Game
        </p>

        {/* Menu Buttons with enhanced styling */}
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={onStartNewGame}
            className="w-72 px-8 py-4 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-white font-bold text-lg rounded-lg shadow-2xl hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 active:scale-95 transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            ⚔️ New Game
          </button>

          <button
            onClick={onContinueGame}
            className="w-72 px-8 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white font-bold text-lg rounded-lg shadow-2xl hover:from-blue-600 hover:via-blue-500 hover:to-blue-600 active:scale-95 transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            📜 Continue Game
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-72 px-8 py-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white font-bold text-lg rounded-lg shadow-2xl hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 active:scale-95 transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 8px 32px rgba(107, 114, 128, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            ⚙️ Settings
          </button>

          <button
            onClick={() => setHelpOpen(true)}
            className="w-72 px-8 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white font-bold text-lg rounded-lg shadow-2xl hover:from-purple-600 hover:via-purple-500 hover:to-purple-600 active:scale-95 transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            ❓ Help / About
          </button>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-16 text-gray-400 text-sm space-y-2">
          <p className="text-gray-300 tracking-wide">Navigate • Fight • Solve • Ascend</p>
          <p className="text-xs text-gray-500">Version 1.0 • A Classic Dungeon Crawler</p>
        </div>
      </div>

      {/* Vignette effect for depth */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)'
           }}>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
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
