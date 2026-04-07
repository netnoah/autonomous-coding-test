import React, { useState, useEffect } from 'react'
import Toast, { ToastContainer } from './Toast'

function ShopModal({ isOpen, onClose, playerGold, onBuyItem }) {
  const [isVisible, setIsVisible] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  // Function to show toast notification
  const showToast = (message, type = 'error') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  // Function to remove toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  if (!isOpen) return null

  const shopItems = [
    { id: 'small_potion', name: 'Small Potion', price: 25, description: '+200 HP', icon: '🧪', color: 'from-green-400 to-green-600' },
    { id: 'big_potion', name: 'Big Potion', price: 100, description: '+500 HP', icon: '🧪', color: 'from-green-500 to-green-700' },
    { id: 'yellow_key', name: 'Yellow Key', price: 10, description: 'Opens yellow doors', icon: '🔑', color: 'from-yellow-400 to-yellow-600' },
    { id: 'blue_key', name: 'Blue Key', price: 50, description: 'Opens blue doors', icon: '🔑', color: 'from-blue-400 to-blue-600' },
    { id: 'red_key', name: 'Red Key', price: 100, description: 'Opens red doors', icon: '🔑', color: 'from-red-400 to-red-600' },
    { id: 'red_gem', name: 'Red Gem', price: 80, description: '+3 ATK', icon: '💎', color: 'from-red-500 to-red-700' },
    { id: 'blue_gem', name: 'Blue Gem', price: 80, description: '+3 DEF', icon: '💎', color: 'from-blue-500 to-blue-700' },
  ]

  const handleBuy = (item) => {
    if (playerGold >= item.price) {
      onBuyItem(item)
    } else {
      // Show error toast for insufficient gold
      showToast(
        `Not enough gold! You need ${item.price - playerGold} more gold to buy ${item.name}.`,
        'error'
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with animated gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-800 opacity-95 shop-backdrop"
        onClick={onClose}
      ></div>

      {/* Shop card */}
      <div
        className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-4 border-yellow-500 max-w-4xl w-full mx-4 shop-card ${isVisible ? 'shop-card-visible' : ''}`}
      >
        {/* Decorative glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-2xl blur-lg opacity-30 shop-glow"></div>

        {/* Content */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="text-5xl">🏪</span>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent shop-title">
                  Shop
                </h2>
                <p className="text-gray-400 text-sm">Upgrade your adventure</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-4xl font-bold leading-none transition-all hover:scale-110 hover:rotate-90 shop-close"
              aria-label="Close shop"
            >
              ×
            </button>
          </div>

          {/* Player Gold Display */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900 to-amber-900 rounded-xl border-2 border-yellow-600 shop-gold-display">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">💰</span>
              <div className="text-center">
                <p className="text-yellow-200 text-sm font-medium">Your Gold</p>
                <p className="font-mono-stats text-3xl font-bold text-yellow-400 shop-gold-amount">
                  {playerGold.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Shop Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 shop-items">
            {shopItems.map((item, index) => {
              const canAfford = playerGold >= item.price

              return (
                <div
                  key={item.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 shop-item ${
                    canAfford
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-yellow-500 hover:shadow-lg hover:scale-[1.02] hover:from-gray-600 hover:to-gray-700'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 opacity-60'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Item card */}
                  <div className="flex items-start gap-4">
                    {/* Icon with glow */}
                    <div className={`relative flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl shop-item-icon ${canAfford ? 'shop-item-icon-affordable' : ''}`}>
                      {item.icon}
                    </div>

                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 shop-item-name">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2 shop-item-description">
                        {item.description}
                      </p>

                      {/* Price */}
                      <div className={`font-mono-stats text-2xl font-bold shop-item-price ${
                        canAfford ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {item.price}g
                      </div>
                    </div>
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`w-full mt-3 py-3 px-4 rounded-lg font-bold transition-all duration-300 shop-buy-button ${
                      canAfford
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <span className="flex items-center justify-center gap-2">
                        <span>🛒</span>
                        <span>Buy</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>🔒</span>
                        <span>Not enough gold</span>
                      </span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Footer close button */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg shop-footer-button"
            >
              Close Shop
            </button>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default ShopModal
