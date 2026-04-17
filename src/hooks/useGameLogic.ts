'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useStore, Card, createInitialGame, shuffleDeck } from '@/store/gameStore'
import { playSound } from '@/utils/sounds'

export function useGameLogic() {
  const { game, setGame, updateGame, settings } = useStore()
  const deckRef = useRef<Card[]>([])

  const startNewGame = useCallback(() => {
    const newGame = createInitialGame(settings.playerCount)
    deckRef.current = shuffleDeck()
    
    for (let i = 0; i < 2; i++) {
      newGame.players.forEach((player) => {
        if (!player.folded) {
          player.hand.push(deckRef.current.pop()!)
        }
      })
    }

    const bigBlindIndex = (newGame.dealerIndex + 2) % newGame.players.length
    const smallBlindIndex = (newGame.dealerIndex + 1) % newGame.players.length
    
    newGame.players[smallBlindIndex].bet = Math.floor(newGame.bigBlind / 2)
    newGame.players[bigBlindIndex].bet = newGame.bigBlind
    newGame.pot = newGame.bigBlind + Math.floor(newGame.bigBlind / 2)
    newGame.currentPlayerIndex = (bigBlindIndex + 1) % newGame.players.length

    setGame(newGame)
    if (settings.soundEnabled) playSound('cardPlace')
  }, [setGame, settings.playerCount, settings.soundEnabled])

  const fold = useCallback(() => {
    if (!game) return
    
    const currentPlayer = game.players[game.currentPlayerIndex]
    currentPlayer.folded = true
    
    const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length
    updateGame({ currentPlayerIndex: nextPlayerIndex })
    
    checkPhaseEnd()
    if (settings.soundEnabled) playSound('buttonClick')
  }, [game, updateGame, settings.soundEnabled])

  const call = useCallback(() => {
    if (!game) return
    
    const currentPlayer = game.players[game.currentPlayerIndex]
    const maxBet = Math.max(...game.players.map(p => p.bet))
    const callAmount = maxBet - currentPlayer.bet
    
    currentPlayer.chips -= callAmount
    currentPlayer.bet += callAmount
    updateGame({ pot: game.pot + callAmount })
    
    const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length
    updateGame({ currentPlayerIndex: nextPlayerIndex })
    
    checkPhaseEnd()
    if (settings.soundEnabled) playSound('chipPlace')
  }, [game, updateGame, settings.soundEnabled])

  const raise = useCallback(() => {
    if (!game) return
    
    const currentPlayer = game.players[game.currentPlayerIndex]
    const raiseAmount = game.minRaise
    
    currentPlayer.chips -= raiseAmount
    currentPlayer.bet += raiseAmount
    updateGame({ pot: game.pot + raiseAmount })
    
    const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length
    updateGame({ currentPlayerIndex: nextPlayerIndex })
    
    checkPhaseEnd()
    if (settings.soundEnabled) playSound('chipPlace')
  }, [game, updateGame, settings.soundEnabled])

  const checkPhaseEnd = useCallback(() => {
    if (!game) return
    
    const activePlayers = game.players.filter(p => !p.folded)
    if (activePlayers.length === 1) {
      const winner = activePlayers[0]
      winner.chips += game.pot
      updateGame({ pot: 0, phase: 'showdown' })
      return
    }

    const allBetsEqual = activePlayers.every(p => p.bet === activePlayers[0].bet)
    const playersActed = activePlayers.filter(p => p.bet > 0 || p.id === game.players[game.currentPlayerIndex].id).length

    if (allBetsEqual && playersActed >= activePlayers.length) {
      dealNextPhase()
    }
  }, [game, updateGame])

  const dealNextPhase = useCallback(() => {
    if (!game) return

    let newPhase = game.phase
    let newCommunityCards = [...game.communityCards]

    switch (game.phase) {
      case 'preflop':
        newPhase = 'flop'
        for (let i = 0; i < 3; i++) newCommunityCards.push(deckRef.current.pop()!)
        break
      case 'flop':
        newPhase = 'turn'
        newCommunityCards.push(deckRef.current.pop()!)
        break
      case 'turn':
        newPhase = 'river'
        newCommunityCards.push(deckRef.current.pop()!)
        break
      case 'river':
        newPhase = 'showdown'
        determineWinner()
        break
    }

    game.players.forEach(p => p.bet = 0)
    updateGame({ 
      phase: newPhase, 
      communityCards: newCommunityCards,
      currentPlayerIndex: (game.dealerIndex + 1) % game.players.length
    })

    if (settings.soundEnabled) playSound('cardPlace')
  }, [game, updateGame, settings.soundEnabled])

  const determineWinner = useCallback(() => {
    if (!game) return

    const activePlayers = game.players.filter(p => !p.folded)
    if (activePlayers.length === 1) {
      activePlayers[0].chips += game.pot
    } else {
      const bestPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)]
      bestPlayer.chips += game.pot
    }

    updateGame({ pot: 0 })
  }, [game, updateGame])

  return {
    game,
    startNewGame,
    fold,
    call,
    raise
  }
}