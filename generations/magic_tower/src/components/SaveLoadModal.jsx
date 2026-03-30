import React, { useState, useEffect } from 'react'

function SaveLoadModal({ isOpen, onClose, gameData, onSaveGame, onLoadGame }) {
  const [saves, setSaves] = useState({
    slot1: null,
    slot2: null,
    slot3: null
  })
  const [saveMessage, setSaveMessage] = useState(null)

  // Load save metadata on mount
  useEffect(() => {
    if (isOpen) {
      loadSaveMetadata()
    }
  }, [isOpen])

  const loadSaveMetadata = () => {
    const slots = ['slot1', 'slot2', 'slot3']
    const saveData = {}

    slots.forEach(slot => {
      const slotKey = slot === 'slot1' ? 'magicTowerSave1' :
                      slot === 'slot2' ? 'magicTowerSave2' :
                      'magicTowerSave3'
      const saved = localStorage.getItem(slotKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          saveData[slot] = {
            timestamp: parsed.timestamp,
            floor: parsed.floor,
            hp: parsed.playerStats?.hp || 0,
            maxHp: parsed.playerStats?.maxHp || 0,
            atk: parsed.playerStats?.atk || 0,
            def: parsed.playerStats?.def || 0,
            gold: parsed.playerStats?.gold || 0,
            steps: parsed.playerStats?.steps || 0
          }
        } catch (e) {
          console.error(`Failed to parse ${slot}:`, e)
          saveData[slot] = null
        }
      } else {
        saveData[slot] = null
      }
    })

    setSaves(saveData)
  }

  const handleSave = (slot) => {
    if (!gameData) return

    const slotKey = slot === 'slot1' ? 'magicTowerSave1' :
                    slot === 'slot2' ? 'magicTowerSave2' :
                    'magicTowerSave3'

    const saveData = {
      ...gameData,
      timestamp: new Date().toISOString()
    }

    localStorage.setItem(slotKey, JSON.stringify(saveData))

    // Refresh metadata
    loadSaveMetadata()

    // Show confirmation message
    const slotNum = slot === 'slot1' ? 1 : slot === 'slot2' ? 2 : 3
    setSaveMessage(`Game saved to Slot ${slotNum}!`)
    setTimeout(() => setSaveMessage(null), 3000)

    if (onSaveGame) {
      onSaveGame(slot, saveData)
    }
  }

  const handleLoad = (slot) => {
    const slotKey = slot === 'slot1' ? 'magicTowerSave1' :
                    slot === 'slot2' ? 'magicTowerSave2' :
                    'magicTowerSave3'

    const saved = localStorage.getItem(slotKey)
    if (!saved) {
      setSaveMessage('No save data found in this slot!')
      setTimeout(() => setSaveMessage(null), 3000)
      return
    }

    try {
      const saveData = JSON.parse(saved)

      if (onLoadGame) {
        onLoadGame(saveData)
      }

      onClose()
    } catch (e) {
      console.error('Failed to load save:', e)
      setSaveMessage('Failed to load save data!')
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const formatDate = (isoString) => {
    if (!isoString) return 'No save'
    const date = new Date(isoString)
    return date.toLocaleString()
  }

  const renderSaveSlot = (slot, title) => {
    const saveData = saves[slot]
    const slotNum = slot === 'slot1' ? 1 : slot === 'slot2' ? 2 : 3

    return (
      <div
        key={slot}
        className="bg-gray-700 rounded-lg p-4 border-2 border-gray-600 hover:border-yellow-500 transition-colors"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-yellow-400">{title}</h3>
          {saveData && (
            <span className="text-xs text-green-400">✓ Saved</span>
          )}
        </div>

        {saveData ? (
          <div className="space-y-2 text-sm mb-4">
            <div className="text-gray-300 text-xs">
              {formatDate(saveData.timestamp)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <div>Floor: <span className="text-white">{saveData.floor}</span></div>
              <div>HP: <span className="text-green-400">{saveData.hp}/{saveData.maxHp}</span></div>
              <div>ATK: <span className="text-red-400">{saveData.atk}</span></div>
              <div>DEF: <span className="text-blue-400">{saveData.def}</span></div>
              <div>Gold: <span className="text-yellow-400">{saveData.gold}</span></div>
              <div>Steps: <span className="text-purple-400">{saveData.steps}</span></div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm mb-4 italic">
            Empty slot
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => handleSave(slot)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => handleLoad(slot)}
            disabled={!saveData}
            className={`flex-1 px-4 py-2 font-bold rounded-lg transition-colors ${
              saveData
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-gray-600 text-gray-500 cursor-not-allowed'
            }`}
          >
            Load
          </button>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-3xl w-full mx-4 shadow-2xl border-2 border-yellow-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-pixel text-yellow-400">Save / Load Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Save/Load message */}
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-600 text-white rounded-lg text-center font-bold">
            {saveMessage}
          </div>
        )}

        <div className="space-y-4">
          {renderSaveSlot('slot1', 'Slot 1')}
          {renderSaveSlot('slot2', 'Slot 2')}
          {renderSaveSlot('slot3', 'Slot 3')}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-600 text-center text-gray-400 text-sm">
          <p>Saves are stored in your browser's local storage</p>
        </div>
      </div>
    </div>
  )
}

export default SaveLoadModal
