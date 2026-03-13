import { Suspense } from "react"
import { Physics } from "@react-three/rapier"
import { GlassJar } from "./GlassJar"
import { JarSticker } from "./JarSticker"
import { JarLid } from "./JarLid"
import { JarColliders } from "./JarColliders"
import { PhysicsCoin } from "./PhysicsCoin"
import { FogParticles } from "./FogParticles"
import { IsometricCamera, CameraControls, CameraTracker } from "./Camera"
import type { CoinInJar, CameraState } from "../types"

export type SceneSettings = {
  dropHeight: number
  gravity: number
  bounciness: number
  friction: number
  linearDamping: number
  dropSpread: number
  coinThicknessRatio: number
  coinMetalness: number
  jarOpacity: number
  fogOpacity: number
  stickerUrl: string
  onCameraUpdate?: (state: CameraState) => void
  initialCameraState?: CameraState
  cameraKey?: number
}

export function JarScene({
  coins,
  coinRadius,
  lidOpen,
  fogOpacity,
  dropHeight,
  gravity,
  bounciness,
  friction,
  linearDamping,
  dropSpread,
  coinThicknessRatio,
  coinMetalness,
  jarOpacity,
  stickerUrl,
  onCameraUpdate,
  initialCameraState,
}: SceneSettings & {
  coins: CoinInJar[]
  coinRadius: number
  lidOpen: boolean
}) {
  return (
    <>
      <IsometricCamera initialState={initialCameraState} />
      <CameraControls initialState={initialCameraState} />
      {onCameraUpdate && <CameraTracker onUpdate={onCameraUpdate} />}

      <ambientLight intensity={1.0} />
      <hemisphereLight args={["#f0f0f0", "#d0d0d0", 0.5]} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={128}
        shadow-mapSize-height={128}
      />
      <directionalLight position={[-2, 3, -1]} intensity={0.6} />

      <group position={[0, -0.1, 0]}>
        <GlassJar opacity={jarOpacity} />
        <Suspense fallback={null}>
          <JarSticker avatarUrl={stickerUrl} />
        </Suspense>
        <JarLid open={lidOpen} />

        <Physics gravity={[0, -gravity, 0]}>
          <JarColliders lidOpen={lidOpen} />
          {coins.map((coin) => (
            <PhysicsCoin
              key={coin.id}
              coin={coin}
              coinRadius={coinRadius}
              dropHeight={dropHeight}
              dropSpread={dropSpread}
              bounciness={bounciness}
              friction={friction}
              linearDamping={linearDamping}
              thicknessRatio={coinThicknessRatio}
              metalness={coinMetalness}
            />
          ))}
        </Physics>

        {fogOpacity > 0 && <FogParticles opacity={fogOpacity} />}
      </group>
    </>
  )
}
