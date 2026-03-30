import React, { useState, useEffect } from 'react'

function SettingsModal({ isOpen, onClose, settings, onSettingsChange }) {
  const [localSettings, setLocalSettings] = useState(settings)

  // Update local settings when prop changes
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    localStorage.setItem('magicTowerSettings', JSON.stringify(newSettings))
    onSettingsChange(newSettings)
  }

  const handleChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all game progress? This cannot be undone!')) {
      // Clear all saves
      localStorage.removeItem('magicTowerSave1')
      localStorage.removeItem('magicTowerSave2')
      localStorage.removeItem('magicTowerSave3')
      localStorage.removeItem('magicTowerAutoSave')

      alert('All progress has been reset!')
      onClose()
      // Reload to return to main menu
      window.location.reload()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl border-2 border-gray-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-pixel text-yellow-400">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Music Volume */}
          <div className="flex justify-between items-center">
            <label className="text-gray-300 font-semibold">🎵 Music Volume</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={localSettings.musicVolume || 70}
                onChange={(e) => handleChange('musicVolume', parseInt(e.target.value))}
                className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-mono w-12 text-right">{localSettings.musicVolume || 70}%</span>
            </div>
          </div>

          {/* SFX Volume */}
          <div className="flex justify-between items-center">
            <label className="text-gray-300 font-semibold">🔊 SFX Volume</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={localSettings.sfxVolume || 80}
                onChange={(e) => handleChange('sfxVolume', parseInt(e.target.value))}
                className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-mono w-12 text-right">{localSettings.sfxVolume || 80}%</span>
            </div>
          </div>

          {/* Movement Speed */}
          <div className="flex justify-between items-center">
            <label className="text-gray-300 font-semibold">⚡ Movement Speed</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleChange('movementSpeed', localSettings.movementSpeed === 'instant' ? 'smooth' : 'instant')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  localSettings.movementSpeed === 'instant'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {localSettings.movementSpeed === 'instant' ? 'Instant' : 'Smooth'}
              </button>
            </div>
          </div>

          {/* Key Repeat */}
          <div className="flex justify-between items-center">
            <label className="text-gray-300 font-semibold">🔄 Key Repeat</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleChange('keyRepeat', !localSettings.keyRepeat)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  localSettings.keyRepeat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {localSettings.keyRepeat ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="flex justify-between items-center">
            <label className="text-gray-300 font-semibold">🎨 Theme</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleChange('theme', localSettings.theme === 'classic' ? 'modern' : 'classic')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  localSettings.theme === 'classic'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {localSettings.theme === 'classic' ? 'Classic' : 'Modern'}
              </button>
            </div>
          </div>

          {/* Show Monster Stats */}
          <div className="flex justify-between items-center">
            <label className="text-gray-300 font-semibold">👁 Show Monster Stats</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleChange('showMonsterStats', !localSettings.showMonsterStats)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  localSettings.showMonsterStats !== false
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {localSettings.showMonsterStats !== false ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Auto-Save */}
          <div className="flex justify-between items-center">
            <label className="text-gray-300 font-semibold">💾 Auto-Save</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleChange('autoSave', localSettings.autoSave !== false)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  localSettings.autoSave !== false
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {localSettings.autoSave !== false ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="border-t-2 border-gray-600 pt-6 mt-6">
            <button
              onClick={handleResetProgress}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all"
            >
              ⚠ Reset Game Progress
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-lg rounded-lg shadow-lg transition-all"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
