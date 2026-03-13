import { useMemo } from "react"
import * as THREE from "three"

function createJarGeometry(): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = []
  const bodyR = 0.35
  const neckTopR = 0.24
  const neckBotR = 0.31
  const rimR = 0.27
  const cornerR = 0.07

  pts.push(new THREE.Vector2(0, 0))
  pts.push(new THREE.Vector2(bodyR - cornerR, 0))
  for (let i = 0; i <= 5; i++) {
    const a = (Math.PI / 2) * (1 - i / 5)
    pts.push(new THREE.Vector2(
      bodyR - cornerR + cornerR * Math.cos(a),
      cornerR - cornerR * Math.sin(a)
    ))
  }
  pts.push(new THREE.Vector2(bodyR, 0.95))
  for (let i = 1; i <= 6; i++) {
    const t = i / 6
    const r = bodyR + (neckBotR - bodyR) * t + (neckTopR - neckBotR) * t * t
    pts.push(new THREE.Vector2(r, 0.95 + t * 0.2))
  }
  pts.push(new THREE.Vector2(neckTopR, 1.2))
  pts.push(new THREE.Vector2(rimR, 1.24))
  pts.push(new THREE.Vector2(rimR, 1.3))
  pts.push(new THREE.Vector2(rimR - 0.01, 1.31))

  return new THREE.LatheGeometry(pts, 32)
}

export function GlassJar({ opacity = 0.3 }: { opacity?: number }) {
  const geometry = useMemo(() => createJarGeometry(), [])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#d0d4d8"
        transparent
        opacity={opacity}
        roughness={0.05}
        metalness={0.02}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
