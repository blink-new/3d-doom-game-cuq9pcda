import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { PointerLockControls, Stats } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import Game from './components/Game'
import HUD from './components/HUD'
import GameMenu from './components/GameMenu'
import { GameProvider, useGame } from './context/GameContext'
import './index.css'

function GameScene() {
  const { gameState } = useGame()
  const controlsRef = useRef<typeof PointerLockControls>(null)

  if (gameState !== 'playing') {
    return <GameMenu />
  }

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        camera={{ 
          fov: 75, 
          position: [0, 1.8, 5],
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: false
        }}
      >
        <Suspense fallback={null}>
          <Physics 
            gravity={[0, -30, 0]}
            defaultContactMaterial={{ 
              friction: 0.4, 
              restitution: 0.3 
            }}
          >
            <Game />
          </Physics>
          
          <PointerLockControls 
            ref={controlsRef}
            selector="#root"
            camera={undefined}
          />
          
          <Stats />
        </Suspense>
      </Canvas>
      
      <HUD />
      
      {/* Crosshair */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-4 h-4 border border-red-500 bg-transparent opacity-80">
          <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-red-500 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <GameScene />
    </GameProvider>
  )
}

export default App