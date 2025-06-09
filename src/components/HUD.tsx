import { useGame } from '../context/GameContext'

export default function HUD() {
  const { state, reload } = useGame()

  const healthPercent = (state.health / state.maxHealth) * 100
  const ammoPercent = (state.ammo / state.maxAmmo) * 100

  const handleReload = () => {
    if (state.ammo < state.maxAmmo) {
      reload()
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Score */}
        <div className="bg-black/70 border border-red-500 px-4 py-2 rounded">
          <div className="text-red-500 text-sm font-mono">SCORE</div>
          <div className="text-white text-xl font-mono font-bold">
            {state.score.toLocaleString()}
          </div>
        </div>

        {/* Level */}
        <div className="bg-black/70 border border-green-500 px-4 py-2 rounded">
          <div className="text-green-500 text-sm font-mono">LEVEL</div>
          <div className="text-white text-xl font-mono font-bold">
            {state.level}
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        {/* Health */}
        <div className="bg-black/70 border border-red-500 p-4 rounded">
          <div className="text-red-500 text-sm font-mono mb-2">HEALTH</div>
          <div className="w-48 h-4 bg-gray-800 border border-red-500 rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <div className="text-white text-lg font-mono font-bold mt-1">
            {state.health}/{state.maxHealth}
          </div>
        </div>

        {/* Ammo */}
        <div className="bg-black/70 border border-yellow-500 p-4 rounded">
          <div className="text-yellow-500 text-sm font-mono mb-2">AMMO</div>
          <div className="w-48 h-4 bg-gray-800 border border-yellow-500 rounded overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${ammoPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-white text-lg font-mono font-bold">
              {state.ammo}/{state.maxAmmo}
            </div>
            <button 
              onClick={handleReload}
              className="pointer-events-auto text-yellow-500 text-sm font-mono hover:text-yellow-300 transition-colors"
              disabled={state.ammo >= state.maxAmmo}
            >
              [R] RELOAD
            </button>
          </div>
        </div>
      </div>

      {/* Kill counter */}
      <div className="absolute bottom-20 right-4 bg-black/70 border border-purple-500 p-3 rounded">
        <div className="text-purple-500 text-sm font-mono">ENEMIES KILLED</div>
        <div className="text-white text-lg font-mono font-bold">
          {state.enemies.filter(e => !e.isAlive).length}
        </div>
      </div>

      {/* Game state indicators */}
      {state.health <= 20 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-red-500/20 animate-pulse" />
        </div>
      )}

      {state.ammo === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-red-500/90 text-white px-6 py-3 rounded font-mono font-bold text-xl animate-pulse">
            OUT OF AMMO - PRESS R TO RELOAD
          </div>
        </div>
      )}
    </div>
  )
}