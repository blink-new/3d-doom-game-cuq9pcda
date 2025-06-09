import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import { Vector3, Raycaster } from 'three'
import Environment from './Environment'
import Player from './Player'
import Enemy from './Enemy'
import { useGame } from '../context/GameContext'

const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1], // Player starts near (1,1)
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const MAZE_WIDTH = maze[0].length;
const MAZE_DEPTH = maze.length;
const CELL_SIZE = 5; // Must match Environment.tsx

function getOpenMazePositions() {
  const openPositions: Array<{row: number, col: number}> = [];
  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) {
        openPositions.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  return openPositions;
}
const availableSpawnPoints = getOpenMazePositions();

export default function Game() {
  const { state, shoot, killEnemy, spawnEnemy, addScore, pauseGame, reload } = useGame()
  const { camera, gl } = useThree()
  const [bullets, setBullets] = useState<Array<{ id: string, position: Vector3, direction: Vector3 }>>([])
  const bulletIdRef = useRef(0)
  const lastSpawnTime = useRef(0)

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Escape':
          pauseGame()
          break
        case 'KeyR':
          if (state.ammo < state.maxAmmo) {
            reload()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [pauseGame, reload, state.ammo, state.maxAmmo])

  // Handle shooting
  useEffect(() => {
    const handleClick = () => {
      if (state.ammo > 0) {
        shoot()
        
        // Create bullet
        const bulletId = `bullet-${bulletIdRef.current++}`
        const bulletPosition = camera.position.clone()
        const bulletDirection = new Vector3(0, 0, -1)
        bulletDirection.applyQuaternion(camera.quaternion)
        
        setBullets(prev => [...prev, {
          id: bulletId,
          position: bulletPosition,
          direction: bulletDirection
        }])

        // Check for enemy hits using raycasting
        const raycaster = new Raycaster()
        raycaster.setFromCamera({ x: 0, y: 0 }, camera)
        
        // Simple hit detection for now - we'll improve this
        state.enemies.forEach(enemy => {
          if (enemy.isAlive) {
            const enemyPos = new Vector3(...enemy.position)
            const distance = camera.position.distanceTo(enemyPos)
            if (distance < 20) { // Simple range check
              killEnemy(enemy.id)
              addScore(100)
            }
          }
        })
      }
    }

    gl.domElement.addEventListener('click', handleClick)
    return () => gl.domElement.removeEventListener('click', handleClick)
  }, [camera, gl, state.ammo, state.enemies, shoot, killEnemy, addScore])

  // Spawn enemies periodically
  useFrame((_, delta) => {
    const currentTime = Date.now()
    if (state.enemies.filter(e => e.isAlive).length < 5 && currentTime - lastSpawnTime.current > 5000) { 
      if (availableSpawnPoints.length > 0) {
        // Pick a random open spot, not too close to player (approx. camera pos)
        let spawnPoint = null;
        let attempts = 0;
        while (!spawnPoint && attempts < 10) {
          const randomSpot = availableSpawnPoints[Math.floor(Math.random() * availableSpawnPoints.length)];
          const x = (randomSpot.col - MAZE_WIDTH / 2 + 0.5) * CELL_SIZE;
          const z = (randomSpot.row - MAZE_DEPTH / 2 + 0.5) * CELL_SIZE;
          
          const enemyPos = new Vector3(x, 0.5, z); // Enemies spawn at y=0.5 (on the floor)
          const playerPos = camera.position;
          const distanceToPlayer = enemyPos.distanceTo(playerPos);

          if (distanceToPlayer > CELL_SIZE * 2) { // Don't spawn too close
             spawnPoint = { x, z };
          }
          attempts++;
        }

        if (spawnPoint) {
          const position: [number, number, number] = [spawnPoint.x, 0.5, spawnPoint.z];
          const newEnemy = {
            id: `enemy-${Date.now()}`,
            position,
            health: 100,
            isAlive: true
          }
          spawnEnemy(newEnemy)
          lastSpawnTime.current = currentTime
        }
      }
    }

    // Update bullets
    setBullets(prev => prev.map(bullet => ({
      ...bullet,
      position: bullet.position.clone().add(bullet.direction.clone().multiplyScalar(50 * delta))
    })).filter(bullet => {
      // Remove bullets that have traveled too far
      const distance = bullet.position.distanceTo(camera.position)
      return distance < 100
    }))
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#ff4444" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00ff00" />

      {/* Environment */}
      <Environment />

      {/* Player */}
      <Player />

      {/* Enemies */}
      {state.enemies.map(enemy => (
        enemy.isAlive && (
          <Enemy
            key={enemy.id}
            position={enemy.position}
            health={enemy.health}
          />
        )
      ))}

      {/* Bullets (visual only) */}
      {bullets.map(bullet => (
        <mesh key={bullet.id} position={bullet.position.toArray()}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#000000', 30, 100]} />
    </>
  )
}