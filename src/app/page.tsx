'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store/gameStore'
import PokerTable from '@/components/PokerTable'
import ActionButtons from '@/components/ActionButtons'
import SettingsPanel from '@/components/SettingsPanel'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useCamera } from '@/hooks/useCamera'

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const { game, startNewGame, fold, call, raise } = useGameLogic()
  const { settings, updateSettings } = useStore()
  const { stream } = useCamera(settings.cameraEnabled)

  const handleStartGame = () => {
    if (settings.username.trim()) {
      updateSettings({ username: settings.username.trim() })
    }
    startNewGame()
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-gold-500"
        >
          ♠️ Poker
        </motion.h1>
        
        <div className="flex items-center gap-4">
          {!game && (
            <input
              type="text"
              value={settings.username}
              onChange={(e) => updateSettings({ username: e.target.value })}
              className="input-field w-40"
              placeholder="Your name"
            />
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors"
          >
            ⚙️
          </motion.button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        {!game ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-8xl mb-8"
            >
              🃏
            </motion.div>
            
            <h2 className="text-4xl font-light text-white mb-4">Play Poker Online</h2>
            <p className="text-gray-400 mb-8">Join a table and play with friends</p>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              className="btn-action btn-play text-xl px-12 py-4"
            >
              🎮 Играть
            </motion.button>
          </motion.div>
        ) : (
          <div className="w-full max-w-5xl">
            <PokerTable />
            <ActionButtons 
              onFold={fold} 
              onCall={call} 
              onRaise={raise}
            />
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                useStore.getState().setGame(null)
              }}
              className="mt-4 mx-auto block text-gray-500 hover:text-gray-400 text-sm"
            >
              Покинуть стол
            </motion.button>
          </div>
        )}
      </div>

      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </main>
  )
}