import React from 'react'

function ShopModal({ isOpen, onClose, playerGold, onBuyItem }) {
  if (!isOpen) return null

  const shopItems = [
    { id: 'small_potion', name: 'Small Potion', price: 25, description: '+200 HP', icon: '🧪' },
    { id: 'big_potion', name: 'Big Potion', price: 100, description: '+500 HP', icon: '🧪' },
    { id: 'yellow_key', name: 'Yellow Key', price: 10, description: 'Opens yellow doors', icon: '🔑' },
    { id: 'blue_key', name: 'Blue Key', price: 50, description: 'Opens blue doors', icon: '🔑' },
    { id: 'red_key', name: 'Red Key', price: 100, description: 'Opens red doors', icon: '🔑' },
    { id: 'red_gem', name: 'Red Gem', price: 80, description: '+3 ATK', icon: '💎' },
    { id: 'blue_gem', name: 'Blue Gem', price: 80, description: '+3 DEF', icon: '💎' },
  ]

  const handleBuy = (item) => {
    if (playerGold >= item.price) {
      onBuyItem(item)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 border-4 border-yellow-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">Shop</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
            aria-label="Close shop"
          >
            ×
          </button>
        </div>

        <div className="mb-4 text-right">
          <span className="text-gray-400">Your Gold:</span>{' '}
          <span className="font-mono-stats text-yellow-400 font-bold text-xl">{playerGold}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {shopItems.map((item) => {
            const canAfford = playerGold >= item.price

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 ${
                  canAfford
                    ? 'bg-gray-900 border-gray-700 hover:border-yellow-500'
                    : 'bg-gray-900 border-gray-800 opacity-50'
                } transition-colors`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono-stats text-xl font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                      {item.price}g
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`w-full mt-2 py-2 px-4 rounded font-bold transition-colors ${
                    canAfford
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Buy' : 'Not enough gold'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
          >
            Close Shop
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopModal
