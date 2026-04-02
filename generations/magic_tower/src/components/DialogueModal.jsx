import React from 'react'

/**
 * DialogueModal - Display NPC dialogue with helpful tips
 *
 * Shows a modal with NPC dialogue when player interacts with NPCs.
 * Contains multiple pages of helpful information the player can navigate through.
 */
export default function DialogueModal({ isOpen, onClose, npcName, dialoguePages }) {
  if (!isOpen) return null

  const [currentPage, setCurrentPage] = React.useState(0)

  // Reset to page 0 when modal opens/closes with different content
  React.useEffect(() => {
    setCurrentPage(0)
  }, [isOpen, npcName])

  const currentPageData = dialoguePages[currentPage]
  const isLastPage = currentPage === dialoguePages.length - 1

  const handleNext = () => {
    if (!isLastPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleClose = () => {
    onClose()
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch(e.key) {
        case 'Escape':
          handleClose()
          break
        case 'ArrowRight':
          if (!isLastPage) handleNext()
          break
        case 'ArrowLeft':
          if (currentPage > 0) handlePrevious()
          break
        case 'Enter':
        case ' ':
          if (isLastPage) {
            handleClose()
          } else {
            handleNext()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentPage, isLastPage])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border-4 border-yellow-600">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-700 to-yellow-600 px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>💬</span>
            <span>{npcName}</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-200 hover:text-white text-3xl font-bold leading-none"
            aria-label="Close dialogue"
          >
            ×
          </button>
        </div>

        {/* Dialogue Content */}
        <div className="p-6">
          <div className="bg-gray-900 rounded-lg p-6 min-h-[200px] border-2 border-gray-700">
            {currentPageData.image && (
              <div className="flex justify-center mb-4">
                <div className="text-6xl">{currentPageData.image}</div>
              </div>
            )}

            {currentPageData.title && (
              <h3 className="text-xl font-bold text-yellow-400 mb-3">
                {currentPageData.title}
              </h3>
            )}

            <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
              {currentPageData.text}
            </div>
          </div>

          {/* Page Indicator */}
          {dialoguePages.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {dialoguePages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentPage
                      ? 'bg-yellow-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-gray-900 px-6 py-4 rounded-b-lg border-t-2 border-gray-700">
          <div className="flex justify-between items-center">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                currentPage === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              ← Previous
            </button>

            {/* Page Counter */}
            <div className="text-gray-400 font-semibold">
              Page {currentPage + 1} of {dialoguePages.length}
            </div>

            {/* Next/Close Button */}
            <button
              onClick={isLastPage ? handleClose : handleNext}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                isLastPage
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isLastPage ? 'Close (ESC)' : 'Next →'}
            </button>
          </div>

          {/* Keyboard Hints */}
          <div className="mt-3 text-center text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded">←</kbd> <kbd className="px-2 py-1 bg-gray-700 rounded">→</kbd> to navigate,
            <kbd className="px-2 py-1 bg-gray-700 rounded ml-2">Space</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded">Enter</kbd> to continue,
            <kbd className="px-2 py-1 bg-gray-700 rounded ml-2">ESC</kbd> to close
          </div>
        </div>
      </div>
    </div>
  )
}
