'use client'

import { motion } from 'framer-motion'
import { Card, getCardDisplay } from '@/store/gameStore'

interface CardComponentProps {
  card: Card | null
  hidden?: boolean
  index?: number
}

const suitColors: Record<string, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-gray-300',
  spades: 'text-gray-300'
}

export default function CardComponent({ card, hidden = false, index = 0 }: CardComponentProps) {
  if (!card || hidden) {
    return (
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="w-16 h-24 rounded-lg border-2 border-gray-600"
        style={{
          background: 'linear-gradient(145deg, #1f2937 0%, #111827 100%)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-16 rounded border border-gray-700 flex items-center justify-center">
            <div className="w-8 h-12 rounded bg-gray-800/50" />
          </div>
        </div>
      </motion.div>
    )
  }

  const { rank, suit } = getCardDisplay(card)
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds'

  return (
    <motion.div
      initial={{ y: -200, rotate: 10, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.5, 
        type: 'spring',
        stiffness: 100 
      }}
      className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-between p-1 select-none
        ${isRed ? 'border-red-500/30' : 'border-gray-500/30'}`}
      style={{
        background: 'linear-gradient(145deg, #fefefe 0%, #e5e7eb 100%)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className={`text-lg font-bold leading-none ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {rank}
      </div>
      <div className={`text-2xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {suit}
      </div>
      <div className={`text-lg font-bold leading-none rotate-180 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {rank}
      </div>
    </motion.div>
  )
}