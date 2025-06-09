import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

export interface GameState {
  gameState: 'menu' | 'playing' | 'paused' | 'gameOver'
  health: number
  maxHealth: number
  ammo: number
  maxAmmo: number
  score: number
  enemies: Enemy[]
  level: number
}

export interface Enemy {
  id: string
  position: [number, number, number]
  health: number
  isAlive: boolean
}

type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'TAKE_DAMAGE'; payload: number }
  | { type: 'HEAL'; payload: number }
  | { type: 'SHOOT' }
  | { type: 'RELOAD' }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'SPAWN_ENEMY'; payload: Enemy }
  | { type: 'KILL_ENEMY'; payload: string }
  | { type: 'NEXT_LEVEL' }

const initialState: GameState = {
  gameState: 'menu',
  health: 100,
  maxHealth: 100,
  ammo: 30,
  maxAmmo: 30,
  score: 0,
  enemies: [],
  level: 1
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return { ...initialState, gameState: 'playing' }
    }
    case 'PAUSE_GAME': {
      return { ...state, gameState: 'paused' }
    }
    case 'RESUME_GAME': {
      return { ...state, gameState: 'playing' }
    }
    case 'GAME_OVER': {
      return { ...state, gameState: 'gameOver' }
    }
    case 'TAKE_DAMAGE': {
      const newHealth = Math.max(0, state.health - action.payload)
      return { 
        ...state, 
        health: newHealth,
        gameState: newHealth <= 0 ? 'gameOver' : state.gameState
      }
    }
    case 'HEAL': {
      return { 
        ...state, 
        health: Math.min(state.maxHealth, state.health + action.payload)
      }
    }
    case 'SHOOT': {
      if (state.ammo <= 0) return state
      return { ...state, ammo: state.ammo - 1 }
    }
    case 'RELOAD': {
      return { ...state, ammo: state.maxAmmo }
    }
    case 'ADD_SCORE': {
      return { ...state, score: state.score + action.payload }
    }
    case 'SPAWN_ENEMY': {
      return { 
        ...state, 
        enemies: [...state.enemies, action.payload]
      }
    }
    case 'KILL_ENEMY': {
      return {
        ...state,
        enemies: state.enemies.map(enemy => 
          enemy.id === action.payload 
            ? { ...enemy, isAlive: false }
            : enemy
        )
      }
    }
    case 'NEXT_LEVEL': {
      return { 
        ...state, 
        level: state.level + 1,
        enemies: [],
        ammo: state.maxAmmo
      }
    }
    default: {
      return state
    }
  }
}

interface GameContextType {
  state: GameState
  gameState: GameState['gameState']
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  gameOver: () => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  shoot: () => void
  reload: () => void
  addScore: (points: number) => void
  spawnEnemy: (enemy: Enemy) => void
  killEnemy: (id: string) => void
  nextLevel: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const pauseGame = useCallback(() => dispatch({ type: 'PAUSE_GAME' }), [])
  const resumeGame = useCallback(() => dispatch({ type: 'RESUME_GAME' }), [])
  const gameOver = useCallback(() => dispatch({ type: 'GAME_OVER' }), [])
  const takeDamage = useCallback((amount: number) => dispatch({ type: 'TAKE_DAMAGE', payload: amount }), [])
  const heal = useCallback((amount: number) => dispatch({ type: 'HEAL', payload: amount }), [])
  const shoot = useCallback(() => dispatch({ type: 'SHOOT' }), [])
  const reload = useCallback(() => dispatch({ type: 'RELOAD' }), [])
  const addScore = useCallback((points: number) => dispatch({ type: 'ADD_SCORE', payload: points }), [])
  const spawnEnemy = useCallback((enemy: Enemy) => dispatch({ type: 'SPAWN_ENEMY', payload: enemy }), [])
  const killEnemy = useCallback((id: string) => dispatch({ type: 'KILL_ENEMY', payload: id }), [])
  const nextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), [])

  const value: GameContextType = {
    state,
    gameState: state.gameState,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    takeDamage,
    heal,
    shoot,
    reload,
    addScore,
    spawnEnemy,
    killEnemy,
    nextLevel
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}