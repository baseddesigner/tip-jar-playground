import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { OrthographicCamera, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import type { CameraState } from "../types"

const DEFAULT_POSITION: [number, number, number] = [0.26, 2.01, -1.65]
const DEFAULT_TARGET: [number, number, number] = [0, 0.55, 0]
const DEFAULT_ZOOM = 250

export function IsometricCamera({ initialState }: { initialState?: CameraState }) {
  const camRef = useRef<THREE.OrthographicCamera>(null)
  const pos = initialState?.position ?? DEFAULT_POSITION
  const target = initialState?.target ?? DEFAULT_TARGET
  const zoom = initialState?.zoom ?? DEFAULT_ZOOM

  useEffect(() => {
    if (camRef.current) {
      camRef.current.lookAt(...target)
      camRef.current.updateProjectionMatrix()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OrthographicCamera
      ref={camRef}
      makeDefault
      zoom={zoom}
      position={pos}
      near={0.1}
      far={100}
    />
  )
}

export function CameraControls({ initialState }: { initialState?: CameraState }) {
  return (
    <OrbitControls
      target={initialState?.target ?? DEFAULT_TARGET}
      enablePan={false}
      enableZoom={true}
      minZoom={40}
      maxZoom={400}
    />
  )
}

export function CameraTracker({ onUpdate }: { onUpdate: (state: CameraState) => void }) {
  const frameCount = useRef(0)
  const controlsRef = useRef<CameraState | null>(null)

  useFrame(({ camera, controls }) => {
    frameCount.current++
    if (frameCount.current % 10 !== 0) return
    const pos: [number, number, number] = [
      Math.round(camera.position.x * 100) / 100,
      Math.round(camera.position.y * 100) / 100,
      Math.round(camera.position.z * 100) / 100,
    ]
    const orbitControls = controls as unknown as { target?: THREE.Vector3 }
    const tgt: [number, number, number] = orbitControls?.target
      ? [
          Math.round(orbitControls.target.x * 100) / 100,
          Math.round(orbitControls.target.y * 100) / 100,
          Math.round(orbitControls.target.z * 100) / 100,
        ]
      : DEFAULT_TARGET
    const zoom = Math.round((camera as THREE.OrthographicCamera).zoom)
    const next: CameraState = { position: pos, target: tgt, zoom }
    const prev = controlsRef.current
    if (
      !prev ||
      prev.zoom !== next.zoom ||
      prev.position[0] !== next.position[0] ||
      prev.position[1] !== next.position[1] ||
      prev.position[2] !== next.position[2] ||
      prev.target[0] !== next.target[0] ||
      prev.target[1] !== next.target[1] ||
      prev.target[2] !== next.target[2]
    ) {
      controlsRef.current = next
      onUpdate(next)
    }
  })

  return null
}
