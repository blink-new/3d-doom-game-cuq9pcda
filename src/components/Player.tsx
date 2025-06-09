import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { useRef, useEffect } from 'react'
import { Vector3 } from 'three'

const MOVE_SPEED = 10
const JUMP_SPEED = 8

// Maze details (must match Environment.tsx)
const MAZE_WIDTH = 10;
const MAZE_DEPTH = 10;
const CELL_SIZE = 5;

// Calculate starting position for an open cell (e.g., maze[1][1])
const START_COL = 1;
const START_ROW = 1;
const START_X = (START_COL - MAZE_WIDTH / 2 + 0.5) * CELL_SIZE;
const START_Z = (START_ROW - MAZE_DEPTH / 2 + 0.5) * CELL_SIZE;
const PLAYER_START_POS: [number, number, number] = [START_X, 1.8, START_Z];

export default function Player() {
  const { camera } = useThree()
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: PLAYER_START_POS,
    fixedRotation: true,
    material: {
      friction: 0.1,
      restitution: 0.3
    }
  }))
  
  const velocity = useRef([0, 0, 0])
  const position = useRef(PLAYER_START_POS)
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
  })

  // Subscribe to physics body updates
  useEffect(() => {
    const unsubscribeVelocity = api.velocity.subscribe((v) => {
      velocity.current = v
    })
    const unsubscribePosition = api.position.subscribe((p) => {
      position.current = p
    })
    
    return () => {
      unsubscribeVelocity()
      unsubscribePosition()
    }
  }, [api])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.current.w = true; break
        case 'KeyA': keys.current.a = true; break
        case 'KeyS': keys.current.s = true; break
        case 'KeyD': keys.current.d = true; break
        case 'Space': keys.current.space = true; e.preventDefault(); break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.current.w = false; break
        case 'KeyA': keys.current.a = false; break
        case 'KeyS': keys.current.s = false; break
        case 'KeyD': keys.current.d = false; break
        case 'Space': keys.current.space = false; break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Update movement and camera
  useFrame(() => {
    // Calculate movement direction based on camera rotation
    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, Number(keys.current.s) - Number(keys.current.w))
    const sideVector = new Vector3(Number(keys.current.a) - Number(keys.current.d), 0, 0)
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVE_SPEED)
      .applyEuler(camera.rotation)

    // Apply horizontal movement
    api.velocity.set(direction.x, velocity.current[1], direction.z)

    // Handle jumping
    if (keys.current.space && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], JUMP_SPEED, velocity.current[2])
    }

    // Update camera position to follow player
    camera.position.set(
      position.current[0],
      position.current[1],
      position.current[2]
    )
  })

  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.5]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}