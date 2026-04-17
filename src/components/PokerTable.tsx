'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/store/gameStore'
import CardComponent from './Card'
import PlayerSlot from './Player'

export default function PokerTable() {
  const game = useStore((state) => state.game)

  if (!game) return null

  const activePlayers = game.players.filter(p => p.isConnected)

  return (
    <div className="relative w-full max-w-4xl aspect-[16/10]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="table w-full h-full flex items-center justify-center"
      >
        <div className="relative w-3/4 h-3/4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            {game.pot > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-4 px-4 py-2 bg-dark-900/80 rounded-full border border-gold-500/30"
              >
                <span className="text-gold-400 font-bold">Pot: ${game.pot}</span>
              </motion.div>
            )}
            
            <div className="flex gap-2 justify-center flex-wrap max-w-xs">
              {game.communityCards.map((card, i) => (
                <CardComponent key={i} card={card} index={i} />
              ))}
              {game.communityCards.length === 0 && (
                <div className="text-white/30 text-sm">Community Cards</div>
              )}
            </div>
          </div>

          {game.players.map((player, index) => (
            <PlayerSlot
              key={player.id}
              player={player}
              position={index}
              totalPlayers={game.players.length}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}