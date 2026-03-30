import React from 'react'

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-600">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b-2 border-gray-600 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-3xl font-pixel text-yellow-400">Help & Tutorial</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* How to Play Section */}
          <section>
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>🎮</span> How to Play
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-200 space-y-3">
              <p>
                <strong className="text-yellow-400">Magic Tower</strong> is a strategic RPG puzzle game where you navigate through a tower floor by floor, fighting monsters, collecting items, and solving puzzles to reach the top.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">🎯 Objective</h4>
                  <p className="text-sm">Climb all 11 floors and defeat the Tower Lord on Floor 10!</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">⚔️ Combat</h4>
                  <p className="text-sm">Move into monsters to attack. Combat is automatic - bump to fight!</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">🔑 Keys</h4>
                  <p className="text-sm">Collect colored keys to open matching doors. Keys are limited!</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-2">📊 Strategy</h4>
                  <p className="text-sm">Plan your route carefully. Some monsters are too strong early on!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Controls Section */}
          <section>
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>⌨️</span> Control Reference
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-3">Movement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span>Arrow Keys</span>
                      <span className="text-yellow-400">Move Up/Down/Left/Right</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span>WASD</span>
                      <span className="text-yellow-400">Move Up/Down/Left/Right</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mouse Click</span>
                      <span className="text-yellow-400">Click adjacent tile to move</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">Game Controls</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span>ESC</span>
                      <span className="text-yellow-400">Pause/Menu</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span>H</span>
                      <span className="text-yellow-400">Open Help</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interact</span>
                      <span className="text-yellow-400">Auto: Step on items/monsters/NPCs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Monster Stats Reference */}
          <section>
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>👹</span> Monster Stat Reference
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-500">
                    <th className="text-left py-2 px-3 text-yellow-400">Monster</th>
                    <th className="text-center py-2 px-3 text-red-400">HP</th>
                    <th className="text-center py-2 px-3 text-orange-400">ATK</th>
                    <th className="text-center py-2 px-3 text-blue-400">DEF</th>
                    <th className="text-left py-2 px-3 text-gray-400">Floor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🟢 Green Slime</td>
                    <td className="text-center">35</td>
                    <td className="text-center">18</td>
                    <td className="text-center">1</td>
                    <td className="text-gray-400">0-3</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🦇 Red Bat</td>
                    <td className="text-center">45</td>
                    <td className="text-center">20</td>
                    <td className="text-center">5</td>
                    <td className="text-gray-400">0-3</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">💀 Skeleton</td>
                    <td className="text-center">50</td>
                    <td className="text-center">22</td>
                    <td className="text-center">8</td>
                    <td className="text-gray-400">0-3</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🧙 Magician</td>
                    <td className="text-center">40</td>
                    <td className="text-center">25</td>
                    <td className="text-center">3</td>
                    <td className="text-gray-400">0-3</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🔴 Red Slime</td>
                    <td className="text-center">70</td>
                    <td className="text-center">30</td>
                    <td className="text-center">10</td>
                    <td className="text-gray-400">4-6</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🗿 Stone Golem</td>
                    <td className="text-center">100</td>
                    <td className="text-center">35</td>
                    <td className="text-center">20</td>
                    <td className="text-gray-400">4-6</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">⚔️ Dark Knight</td>
                    <td className="text-center">120</td>
                    <td className="text-center">40</td>
                    <td className="text-center">25</td>
                    <td className="text-gray-400">4-6</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🧙‍♀️ Witch</td>
                    <td className="text-center">80</td>
                    <td className="text-center">45</td>
                    <td className="text-center">15</td>
                    <td className="text-gray-400">4-6</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🧛 Vampire</td>
                    <td className="text-center">200</td>
                    <td className="text-center">55</td>
                    <td className="text-center">30</td>
                    <td className="text-gray-400">7-9</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🐉 Dragon</td>
                    <td className="text-center">300</td>
                    <td className="text-center">60</td>
                    <td className="text-center">40</td>
                    <td className="text-gray-400">7-9</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">🔮 Dark Mage</td>
                    <td className="text-center">250</td>
                    <td className="text-center">70</td>
                    <td className="text-center">35</td>
                    <td className="text-gray-400">7-9</td>
                  </tr>
                  <tr className="hover:bg-gray-600">
                    <td className="py-2 px-3">☠️ Skeleton King</td>
                    <td className="text-center">350</td>
                    <td className="text-center">65</td>
                    <td className="text-center">45</td>
                    <td className="text-gray-400">7-9</td>
                  </tr>
                  <tr className="hover:bg-gray-600 bg-red-900/30">
                    <td className="py-2 px-3 font-bold">👹 Mini Boss</td>
                    <td className="text-center font-bold">500</td>
                    <td className="text-center font-bold">80</td>
                    <td className="text-center font-bold">50</td>
                    <td className="text-gray-400">9-10</td>
                  </tr>
                  <tr className="hover:bg-gray-600 bg-red-900/30">
                    <td className="py-2 px-3 font-bold">🛡️ Floor Guardian</td>
                    <td className="text-center font-bold">800</td>
                    <td className="text-center font-bold">100</td>
                    <td className="text-center font-bold">60</td>
                    <td className="text-gray-400">10</td>
                  </tr>
                  <tr className="hover:bg-gray-600 bg-purple-900/30">
                    <td className="py-2 px-3 font-bold text-yellow-400">👑 Tower Lord</td>
                    <td className="text-center font-bold text-yellow-400">1500</td>
                    <td className="text-center font-bold text-yellow-400">120</td>
                    <td className="text-center font-bold text-yellow-400">80</td>
                    <td className="text-gray-400">10 (Final)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Item Description Guide */}
          <section>
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>🎒</span> Item Description Guide
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Consumables */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-400 mb-3">🧪 Consumables</h4>
                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400">🔴</span>
                    <div>
                      <strong>Small Potion</strong>
                      <p className="text-xs text-gray-400">Restore 200 HP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">🔴</span>
                    <div>
                      <strong>Big Potion</strong>
                      <p className="text-xs text-gray-400">Restore 500 HP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">⭐</span>
                    <div>
                      <strong>Super Potion</strong>
                      <p className="text-xs text-gray-400">Full HP restore</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gems */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-3">💎 Gems</h4>
                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">💎</span>
                    <div>
                      <strong>Red Gem</strong>
                      <p className="text-xs text-gray-400">+3 ATK permanently</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">💎</span>
                    <div>
                      <strong>Blue Gem</strong>
                      <p className="text-xs text-gray-400">+3 DEF permanently</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">💎</span>
                    <div>
                      <strong>Green Gem</strong>
                      <p className="text-xs text-gray-400">+1 ATK, +1 DEF</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-orange-400 mb-3">⚔️ Equipment</h4>
                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-start gap-2">
                    <span>🗡️</span>
                    <div>
                      <strong>Swords</strong>
                      <p className="text-xs text-gray-400">Iron +10, Steel +20, Holy +50 ATK</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🛡️</span>
                    <div>
                      <strong>Shields</strong>
                      <p className="text-xs text-gray-400">Wooden +8, Iron +15, Holy +40 DEF</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📕</span>
                    <div>
                      <strong>Books</strong>
                      <p className="text-xs text-gray-400">Attack/Defense +3 permanent</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keys */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">🔑 Keys</h4>
                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">🔑</span>
                    <div>
                      <strong>Yellow Key</strong>
                      <p className="text-xs text-gray-400">Opens yellow doors (common)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">🔑</span>
                    <div>
                      <strong>Blue Key</strong>
                      <p className="text-xs text-gray-400">Opens blue doors (uncommon)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400">🔑</span>
                    <div>
                      <strong>Red Key</strong>
                      <p className="text-xs text-gray-400">Opens red doors (rare)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Strategy Tips */}
          <section>
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>💡</span> Strategy Tips
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div>
                      <strong className="text-yellow-400">Plan Your Route</strong>
                      <p className="text-sm text-gray-300">Explore each floor thoroughly before moving up. Some items are essential for survival.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div>
                      <strong className="text-yellow-400">Use Keys Wisely</strong>
                      <p className="text-sm text-gray-300">Keys are limited! Yellow keys are most common, save blue and red for important doors.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div>
                      <strong className="text-yellow-400">Check Monster Stats</strong>
                      <p className="text-sm text-gray-300">Hover over monsters to see their stats. If you can't win, come back later!</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">4️⃣</span>
                    <div>
                      <strong className="text-yellow-400">Prioritize Equipment</strong>
                      <p className="text-sm text-gray-300">Swords and shields provide permanent stat boosts. Get them early!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">5️⃣</span>
                    <div>
                      <strong className="text-yellow-400">Save Potions</strong>
                      <p className="text-sm text-gray-300">Don't waste potions on minor damage. Save them for tough fights.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">6️⃣</span>
                    <div>
                      <strong className="text-yellow-400">Shop Smart</strong>
                      <p className="text-sm text-gray-300">Floor 3 has a shop. Buy keys if you're short, or save gold for important items.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                <p className="text-sm text-center">
                  <strong className="text-yellow-400">⚠️ Pro Tip:</strong> You can always see combat outcomes before fighting by hovering over monsters!
                </p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="border-t-2 border-gray-600 pt-6">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>ℹ️</span> About
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-200">
              <p className="mb-3">
                <strong className="text-yellow-400">Magic Tower (魔塔)</strong> is a classic Chinese RPG puzzle game originally released in the 1990s.
              </p>
              <p className="mb-3">
                This modern web implementation captures the essence of the original with updated graphics and responsive design.
              </p>
              <p className="text-sm text-gray-400">
                Built with React + Vite + Tailwind CSS
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HelpModal
