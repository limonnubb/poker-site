'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player, useStore } from '@/store/gameStore'
import CardComponent from './Card'

interface PlayerProps {
  player: Player
  position: number
  totalPlayers: number
}

const positionMap = [
  { x: '50%', y: '10%', transform: 'translateX(-50%)' },
  { x: '85%', y: '25%', transform: 'translateX(0%)' },
  { x: '90%', y: '55%', transform: 'translateX(0%)' },
  { x: '50%', y: '90%', transform: 'translateX(-50%)' },
  { x: '10%', y: '55%', transform: 'translateX(0%)' },
  { x: '15%', y: '25%', transform: 'translateX(0%)' },
  { x: '30%', y: '15%', transform: 'translateX(0%)' },
  { x: '70%', y: '15%', transform: 'translateX(0%)' }
]

export default function PlayerSlot({ player, position, totalPlayers }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const settings = useStore((state) => state.settings)
  const pos = positionMap[position % 8]

  useEffect(() => {
    if (settings.cameraEnabled && player.webcamStream && videoRef.current) {
      videoRef.current.srcObject = player.webcamStream
      setHasCamera(true)
    } else {
      setHasCamera(false)
    }
  }, [player.webcamStream, settings.cameraEnabled])

  const isActive = player.isCurrentPlayer

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute flex flex-col items-center"
      style={{
        left: pos.x,
        top: pos.y,
        transform: pos.transform
      }}
    >
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: isActive 
              ? '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)' 
              : '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}
          className="player-slot w-28 h-36"
        >
          {hasCamera ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-dark-700 to-dark-900">
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-2xl font-bold text-gold-500">
                {player.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {player.folded && (
            <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
              <span className="text-gray-500 font-bold text-lg">FOLD</span>
            </div>
          )}

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center"
              >
                <div className="w-3 h-3 bg-dark-900 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {player.bet > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 chip z-10"
          >
            ${player.bet}
          </motion.div>
        )}
      </div>

      <div className="mt-2 text-center">
        <motion.div
          className={`text-sm font-semibold ${isActive ? 'text-gold-400' : 'text-white'}`}
        >
          {player.name}
        </motion.div>
        <div className="text-xs text-gray-400">${player.chips}</div>
      </div>

      {player.id === 'player-0' && player.hand.length > 0 && (
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-1">
          {player.hand.map((card, i) => (
            <CardComponent key={i} card={card} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}