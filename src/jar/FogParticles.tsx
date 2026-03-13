import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function useFogTexture() {
  const texture = useMemo(() => {
    const size = 64
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, "rgba(200, 208, 216, 1)")
    gradient.addColorStop(0.4, "rgba(200, 208, 216, 0.4)")
    gradient.addColorStop(1, "rgba(200, 208, 216, 0)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])
  return texture
}

export function FogParticles({ count = 14, opacity = 0.1 }: { count?: number; opacity?: number }) {
  const fogTexture = useFogTexture()
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.4,
      y: 0.1 + Math.random() * 0.8,
      z: (Math.random() - 0.5) * 0.4,
      dx: (Math.random() - 0.5) * 0.001,
      dz: (Math.random() - 0.5) * 0.001,
      dy: 0.0003 + Math.random() * 0.0006,
      scale: 0.15 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
    })),
  [count])

  const refs = useRef<(THREE.Sprite | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    particles.forEach((p, i) => {
      const sprite = refs.current[i]
      if (!sprite) return
      p.x += p.dx
      p.z += p.dz
      p.y += p.dy
      if (p.y > 1.05) p.y = 0.08
      if (Math.abs(p.x) > 0.22) p.dx *= -1
      if (Math.abs(p.z) > 0.22) p.dz *= -1
      sprite.position.set(p.x, p.y, p.z)
      const breath = 0.3 + 0.7 * Math.sin(t * p.speed + p.phase) ** 2
      sprite.material.opacity = opacity * breath
      sprite.scale.setScalar(p.scale * (0.9 + 0.1 * Math.sin(t * 0.2 + p.phase)))
    })
  })

  return (
    <>
      {particles.map((p, i) => (
        <sprite
          key={i}
          ref={(el) => { refs.current[i] = el }}
          position={[p.x, p.y, p.z]}
          scale={[p.scale, p.scale, 1]}
        >
          <spriteMaterial
            map={fogTexture}
            transparent
            opacity={opacity * 0.5}
            depthWrite={false}
          />
        </sprite>
      ))}
    </>
  )
}
