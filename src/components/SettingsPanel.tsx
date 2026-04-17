'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/gameStore'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark-800 rounded-2xl p-6 w-full max-w-md border border-dark-200"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Username</label>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => updateSettings({ username: e.target.value })}
                  className="input-field"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Sound</div>
                  <div className="text-gray-500 text-sm">Game sounds</div>
                </div>
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`toggle ${settings.soundEnabled ? 'active' : ''}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Camera</div>
                  <div className="text-gray-500 text-sm">Webcam for players</div>
                </div>
                <button
                  onClick={() => updateSettings({ cameraEnabled: !settings.cameraEnabled })}
                  className={`toggle ${settings.cameraEnabled ? 'active' : ''}`}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Players</label>
                <div className="flex gap-2">
                  {[2, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateSettings({ playerCount: num })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all
                        ${settings.playerCount === num 
                          ? 'bg-gold-500 text-dark-900' 
                          : 'bg-dark-700 text-gray-400 hover:bg-dark-600'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold rounded-xl transition-colors"
            >
              Save
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}