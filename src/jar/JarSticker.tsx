import { useMemo } from "react"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

export function JarSticker({ avatarUrl, size = 0.13, opacity = 0.9 }: { avatarUrl: string; size?: number; opacity?: number }) {
  const texture = useTexture(avatarUrl)
  const geometry = useMemo(() => new THREE.CircleGeometry(size, 48), [size])
  const borderGeometry = useMemo(() => new THREE.CircleGeometry(size + 0.012, 48), [size])

  const facingAngle = Math.atan2(-0.28, -1.44)

  return (
    <group position={[0, 0.92, 0]} rotation={[0, facingAngle, 0]}>
      <group position={[0, 0, 0.353]} rotation={[0.03, 0, 0.11]}>
        <mesh geometry={borderGeometry} position={[0, 0, -0.001]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={geometry}>
          <meshBasicMaterial map={texture} transparent opacity={opacity} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
