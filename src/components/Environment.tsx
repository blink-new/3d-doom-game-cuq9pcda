import { usePlane } from '@react-three/cannon'

function Floor() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0] 
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#1a1a1a" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

function Wall({ position, rotation, size }: { 
  position: [number, number, number], 
  rotation?: [number, number, number],
  size: [number, number, number]
}) {
  const [ref] = usePlane(() => ({ 
    position, 
    rotation: rotation || [0, 0, 0]
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color="#2a2a2a" 
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  )
}

function NeonLight({ position, color }: { 
  position: [number, number, number], 
  color: string 
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2, 0.1, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight 
        position={[0, 0, 0]} 
        intensity={2} 
        color={color} 
        distance={10}
      />
    </group>
  )
}

function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[1, 1, 8, 8]} />
      <meshStandardMaterial 
        color="#333333" 
        roughness={0.6}
        metalness={0.4}
      />
    </mesh>
  )
}

export default function Environment() {
  return (
    <>
      {/* Floor */}
      <Floor />

      {/* Outer walls */}
      <Wall position={[0, 4, -50]} size={[100, 8, 1]} />
      <Wall position={[0, 4, 50]} size={[100, 8, 1]} />
      <Wall position={[-50, 4, 0]} rotation={[0, Math.PI / 2, 0]} size={[100, 8, 1]} />
      <Wall position={[50, 4, 0]} rotation={[0, Math.PI / 2, 0]} size={[100, 8, 1]} />

      {/* Inner structures */}
      <Wall position={[20, 2, 0]} size={[1, 4, 20]} />
      <Wall position={[-20, 2, 0]} size={[1, 4, 20]} />
      <Wall position={[0, 2, 20]} rotation={[0, Math.PI / 2, 0]} size={[20, 4, 1]} />
      <Wall position={[0, 2, -20]} rotation={[0, Math.PI / 2, 0]} size={[20, 4, 1]} />

      {/* Pillars */}
      <Pillar position={[15, 4, 15]} />
      <Pillar position={[-15, 4, 15]} />
      <Pillar position={[15, 4, -15]} />
      <Pillar position={[-15, 4, -15]} />

      {/* Neon lights for atmosphere */}
      <NeonLight position={[0, 6, -49]} color="#ff0000" />
      <NeonLight position={[0, 6, 49]} color="#ff0000" />
      <NeonLight position={[-49, 6, 0]} color="#00ff00" />
      <NeonLight position={[49, 6, 0]} color="#00ff00" />
      
      {/* Corner accent lights */}
      <NeonLight position={[20, 3, 20]} color="#ff4400" />
      <NeonLight position={[-20, 3, 20]} color="#ff4400" />
      <NeonLight position={[20, 3, -20]} color="#ff4400" />
      <NeonLight position={[-20, 3, -20]} color="#ff4400" />

      {/* Ceiling */}
      <mesh position={[0, 8, 0]} receiveShadow>
        <boxGeometry args={[100, 0.5, 100]} />
        <meshStandardMaterial 
          color="#111111" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </>
  )
}