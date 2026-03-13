import { useState, useRef, useEffect, useMemo, memo } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, CylinderCollider, type RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { hashToColor } from "../utils"
import type { CoinInJar } from "../types"

export const PhysicsCoin = memo(function PhysicsCoin({
  coin,
  coinRadius,
  dropHeight,
  dropSpread,
  bounciness,
  friction,
  linearDamping,
  thicknessRatio,
  metalness,
}: {
  coin: CoinInJar
  coinRadius: number
  dropHeight: number
  dropSpread: number
  bounciness: number
  friction: number
  linearDamping: number
  thicknessRatio: number
  metalness: number
}) {
  const color = useMemo(() => hashToColor(coin.txHash), [coin.txHash])
  const faceColor = useMemo(() => color.clone().offsetHSL(0, 0.05, 0.12), [color])
  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: faceColor, roughness: 0.25, metalness, envMapIntensity: 0.8 }), [faceColor, metalness])
  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness, envMapIntensity: 0.8 }),
    faceMat,
    faceMat,
  ], [color, faceMat, metalness])

  useEffect(() => {
    return () => { materials[0].dispose(); faceMat.dispose() }
  }, [materials, faceMat])

  const startX = (coin.x - 0.5) * dropSpread
  const startZ = coin.z
  const [spawned, setSpawned] = useState(false)
  const bodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const settled = useRef(false)
  const LID_Y = 1.31

  useEffect(() => {
    if (coin.dropDelay <= 0) {
      setSpawned(true)
      return
    }
    const t = setTimeout(() => setSpawned(true), coin.dropDelay)
    return () => clearTimeout(t)
  }, [coin.dropDelay])

  useFrame(() => {
    if (settled.current || !bodyRef.current || !meshRef.current) return
    const below = bodyRef.current.translation().y < LID_Y
    meshRef.current.visible = below
    if (below) settled.current = true
  })

  if (!spawned) return null

  const coinThickness = coinRadius * thicknessRatio

  return (
    <RigidBody
      ref={bodyRef}
      position={[startX, coin.spawnHeight ?? dropHeight, startZ]}
      rotation={[coin.rotX, coin.rotY, coin.rotZ]}
      colliders={false}
      restitution={bounciness}
      friction={friction}
      linearDamping={linearDamping}
      angularDamping={1.0}
      ccd
    >
      <CylinderCollider args={[coinThickness / 2, coinRadius]} />
      <mesh ref={meshRef} castShadow visible={false} material={materials}>
        <cylinderGeometry args={[coinRadius, coinRadius, coinThickness, 24]} />
      </mesh>
    </RigidBody>
  )
})
