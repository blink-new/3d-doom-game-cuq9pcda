import { useGame } from '../context/GameContext'

export default function GameMenu() {
  const { gameState, startGame, resumeGame, state } = useGame()

  const handleStart = () => {
    startGame()
  }

  const handleResume = () => {
    resumeGame()
  }

  if (gameState === 'paused') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="bg-black border-2 border-red-500 p-8 rounded-lg text-center max-w-md">
          <h1 className="text-4xl font-mono font-bold text-red-500 mb-6">PAUSED</h1>
          <div className="space-y-4">
            <button
              onClick={handleResume}
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-mono font-bold py-3 px-6 rounded transition-colors"
            >
              RESUME
            </button>
            <button
              onClick={startGame}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-mono font-bold py-3 px-6 rounded transition-colors"
            >
              RESTART
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'gameOver') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="bg-black border-2 border-red-500 p-8 rounded-lg text-center max-w-md">
          <h1 className="text-4xl font-mono font-bold text-red-500 mb-6">GAME OVER</h1>
          <div className="mb-6 space-y-2">
            <div className="text-white font-mono">
              Final Score: <span className="text-yellow-500 font-bold">{state.score.toLocaleString()}</span>
            </div>
            <div className="text-white font-mono">
              Level Reached: <span className="text-green-500 font-bold">{state.level}</span>
            </div>
            <div className="text-white font-mono">
              Enemies Killed: <span className="text-purple-500 font-bold">{state.enemies.filter(e => !e.isAlive).length}</span>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="block w-full bg-red-500 hover:bg-red-600 text-white font-mono font-bold py-3 px-6 rounded transition-colors"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    )
  }

  // Main menu
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center max-w-2xl px-8">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-mono font-bold text-red-500 mb-4 tracking-wider animate-pulse">
            DOOM 3D
          </h1>
          <div className="text-lg font-mono text-gray-400 mb-8">
            A cyberpunk-inspired first-person shooter
          </div>
        </div>

        {/* Start button */}
        <div className="mb-8">
          <button
            onClick={handleStart}
            className="bg-red-500 hover:bg-red-600 text-white font-mono font-bold text-xl py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
          >
            START GAME
          </button>
        </div>

        {/* Controls */}
        <div className="bg-black/50 border border-gray-700 p-6 rounded-lg">
          <h3 className="text-green-500 font-mono font-bold text-xl mb-4">CONTROLS</h3>
          <div className="grid grid-cols-2 gap-4 text-white font-mono text-sm">
            <div>
              <div className="text-yellow-500">WASD</div>
              <div className="text-gray-400">Move</div>
            </div>
            <div>
              <div className="text-yellow-500">MOUSE</div>
              <div className="text-gray-400">Look around</div>
            </div>
            <div>
              <div className="text-yellow-500">CLICK</div>
              <div className="text-gray-400">Shoot</div>
            </div>
            <div>
              <div className="text-yellow-500">R</div>
              <div className="text-gray-400">Reload</div>
            </div>
            <div>
              <div className="text-yellow-500">SPACE</div>
              <div className="text-gray-400">Jump</div>
            </div>
            <div>
              <div className="text-yellow-500">ESC</div>
              <div className="text-gray-400">Pause</div>
            </div>
          </div>
        </div>

        {/* Version info */}
        <div className="mt-8 text-gray-600 font-mono text-xs">
          Built with React Three Fiber • Cannon Physics • WebGL
        </div>
      </div>
    </div>
  )
}