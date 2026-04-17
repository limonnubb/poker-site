'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/store/gameStore'

interface ActionButtonsProps {
  onFold: () => void
  onCall: () => void
  onRaise: () => void
}

export default function ActionButtons({ onFold, onCall, onRaise }: ActionButtonsProps) {
  const game = useStore((state) => state.game)
  const currentPlayer = game?.players[game.currentPlayerIndex]
  const isMyTurn = currentPlayer?.id === 'player-0'

  if (!isMyTurn) {
    return (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-center gap-4 py-6"
      >
        <div className="px-8 py-4 bg-dark-800/80 rounded-xl border border-dark-200">
          <span className="text-gray-400 text-lg">Waiting for {currentPlayer?.name}...</span>
        </div>
      </motion.div>
    )
  }

  const callAmount = currentPlayer?.bet || 0

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-center gap-4 py-6"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFold}
        className="btn-action bg-red-600/20 text-red-400 border-red-600/50 hover:bg-red-600 hover:text-white"
      >
        Fold
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCall}
        className="btn-action bg-green-600/20 text-green-400 border-green-600/50 hover:bg-green-600 hover:text-white"
      >
        {callAmount > 0 ? `Call $${callAmount}` : 'Check'}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRaise}
        className="btn-action bg-gold-500/20 text-gold-400 border-gold-500/50 hover:bg-gold-500 hover:text-dark-900"
      >
        Raise
      </motion.button>
    </motion.div>
  )
}