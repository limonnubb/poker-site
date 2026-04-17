import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  suit: Suit
  rank: Rank
}

export interface Player {
  id: string
  name: string
  chips: number
  bet: number
  hand: Card[]
  folded: boolean
  isAllIn: boolean
  isConnected: boolean
  isCurrentPlayer: boolean
  webcamStream?: MediaStream | null
}

export interface GameState {
  phase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'
  pot: number
  communityCards: Card[]
  players: Player[]
  currentPlayerIndex: number
  dealerIndex: number
  bigBlind: number
  minRaise: number
}

interface Settings {
  soundEnabled: boolean
  cameraEnabled: boolean
  playerCount: number
  username: string
}

interface Store {
  game: GameState | null
  settings: Settings
  setGame: (game: GameState | null) => void
  updateGame: (updates: Partial<GameState>) => void
  updateSettings: (updates: Partial<Settings>) => void
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
}

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

function shuffleDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank })
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function getCardSymbol(rank: Rank): string {
  const symbols: Record<Rank, string> = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
    '8': '8', '9': '9', '10': '10', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'
  }
  return symbols[rank]
}

function getSuitSymbol(suit: Suit): string {
  const symbols: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  }
  return symbols[suit]
}

export function getCardDisplay(card: Card) {
  return { rank: getCardSymbol(card.rank), suit: getSuitSymbol(card.suit) }
}

function createInitialGame(playerCount: number): GameState {
  const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
    id: `player-${i}`,
    name: i === 0 ? 'You' : `Player ${i + 1}`,
    chips: 1000,
    bet: 0,
    hand: [],
    folded: false,
    isAllIn: false,
    isConnected: true,
    isCurrentPlayer: i === 0,
    webcamStream: null
  }))

  return {
    phase: 'preflop',
    pot: 0,
    communityCards: [],
    players,
    currentPlayerIndex: 0,
    dealerIndex: 0,
    bigBlind: 10,
    minRaise: 20
  }
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      game: null,
      settings: {
        soundEnabled: true,
        cameraEnabled: false,
        playerCount: 6,
        username: 'Player'
      },
      setGame: (game) => set({ game }),
      updateGame: (updates) => set((state) => ({
        game: state.game ? { ...state.game, ...updates } : null
      })),
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      addPlayer: (player) => set((state) => ({
        game: state.game ? {
          ...state.game,
          players: [...state.game.players, player]
        } : null
      })),
      removePlayer: (playerId) => set((state) => ({
        game: state.game ? {
          ...state.game,
          players: state.game.players.filter(p => p.id !== playerId)
        } : null
      }))
    }),
    {
      name: 'poker-settings'
    }
  )
)

export { shuffleDeck, getCardSymbol, getSuitSymbol, createInitialGame }
export { suits, ranks }