import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh, Vector3 } from 'three'

interface EnemyProps {
  position: [number, number, number]
  health: number
}

export default function Enemy({ position, health }: EnemyProps) {
  const meshRef = useRef<Mesh>(null)
  const currentPosition = new Vector3(...position)
  const [bobOffset, setBobOffset] = useState(0)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Simple bobbing animation
    setBobOffset(prev => prev + delta * 3)
    
    // Rotate enemy to always face roughly toward center
    meshRef.current.lookAt(0, currentPosition.y, 0)
    
    // Apply bobbing motion
    meshRef.current.position.y = currentPosition.y + Math.sin(bobOffset) * 0.2
  })

  // Health-based color
  const healthPercent = health / 100
  const color = `hsl(${healthPercent * 120}, 70%, 50%)` // Red to green based on health

  return (
    <group position={currentPosition.toArray()}>
      {/* Enemy body */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Enemy eyes/glow */}
      <mesh position={[0, 0.5, 0.51]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.3, 0.5, 0.51]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-0.3, 0.5, 0.51]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Glowing aura */}
      <pointLight 
        position={[0, 1, 0]} 
        intensity={0.5} 
        color={color} 
        distance={3}
      />
    </group>
  )
}