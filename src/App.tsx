import { useState, useCallback, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { JarScene } from "./jar/JarScene"
import { Slider } from "./controls/Slider"
import { randomTxHash, cn } from "./utils"
import type { CoinInJar, CameraState } from "./types"

const DEFAULT_STICKER_URL = import.meta.env.BASE_URL + "paw-icon.png"
const MAX_COINS = 200

export default function App() {
  const [coins, setCoins] = useState<CoinInJar[]>([])
  const [lidOpen, setLidOpen] = useState(false)
  const coinIdRef = useRef(0)

  // Camera
  const [cameraState, setCameraState] = useState<CameraState>({
    position: [-0.28, 2.22, -1.44],
    target: [0, 0.55, 0],
    zoom: 85,
  })
  const [appliedCameraState, setAppliedCameraState] = useState<CameraState | undefined>(undefined)
  const [cameraKey, setCameraKey] = useState(0)
  const [cameraJsonInput, setCameraJsonInput] = useState("")

  const handleCameraUpdate = useCallback((state: CameraState) => {
    setCameraState(state)
  }, [])

  const handleApplyCameraJson = useCallback(() => {
    try {
      const parsed = JSON.parse(cameraJsonInput)
      if (parsed.position && parsed.target && parsed.zoom) {
        setAppliedCameraState(parsed as CameraState)
        setCameraKey((k) => k + 1)
        setCameraJsonInput("")
      }
    } catch {
      // invalid JSON
    }
  }, [cameraJsonInput])

  // Physics settings
  const [coinRadius, setCoinRadius] = useState(0.04)
  const [dropHeight, setDropHeight] = useState(5.5)
  const [gravity, setGravity] = useState(13.0)
  const [bounciness, setBounciness] = useState(1.0)
  const [friction, setFriction] = useState(0.4)
  const [linearDamping, setLinearDamping] = useState(1.0)
  const [dropSpread, setDropSpread] = useState(0.65)

  // Visual settings
  const [coinThicknessRatio, setCoinThicknessRatio] = useState(0.3)
  const [coinMetalness, setCoinMetalness] = useState(0.45)
  const [jarOpacity, setJarOpacity] = useState(0.2)
  const [fogOpacity, setFogOpacity] = useState(0.4)
  const [maxCoins, setMaxCoins] = useState(MAX_COINS)
  const [gravityFlipped, setGravityFlipped] = useState(false)
  const [stickerUrl, setStickerUrl] = useState(DEFAULT_STICKER_URL)
  const stickerInputRef = useRef<HTMLInputElement>(null)

  const physicsGravity = gravityFlipped ? -gravity * 0.4 : gravity

  // Add coins
  const addCoins = useCallback((count: number) => {
    const newCoins: CoinInJar[] = []
    for (let i = 0; i < count; i++) {
      newCoins.push({
        id: ++coinIdRef.current,
        txHash: randomTxHash(),
        x: 0.15 + Math.random() * 0.7,
        z: (Math.random() - 0.5) * dropSpread * 0.4,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        dropDelay: i * 80,
      })
    }
    setCoins((prev) => {
      const all = [...prev, ...newCoins]
      return all.length > maxCoins ? all.slice(all.length - maxCoins) : all
    })
  }, [dropSpread, maxCoins])

  const handleDrop = useCallback(() => {
    setLidOpen(true)
    setTimeout(() => {
      addCoins(1)
      setTimeout(() => setLidOpen(false), 600)
    }, 400)
  }, [addCoins])

  const handleReset = useCallback(() => {
    setCoins([])
    setLidOpen(false)
    coinIdRef.current = 0
  }, [])

  const prefillJar = useCallback((count: number) => {
    handleReset()
    setTimeout(() => {
      const prefillCoins: CoinInJar[] = []
      for (let i = 0; i < count; i++) {
        prefillCoins.push({
          id: i + 1,
          txHash: randomTxHash(),
          x: 0.15 + Math.random() * 0.7,
          z: (Math.random() - 0.5) * 0.25,
          rotX: Math.random() * Math.PI * 2,
          rotY: Math.random() * Math.PI * 2,
          rotZ: Math.random() * Math.PI * 2,
          dropDelay: Math.floor(i / 8) * 80,
          spawnHeight: 0.6 + Math.random() * 0.5,
        })
      }
      coinIdRef.current = count
      setCoins(prefillCoins.slice(-maxCoins))
    }, 50)
  }, [handleReset, maxCoins])

  const handleZeroG = useCallback(() => {
    if (gravityFlipped) return
    setGravityFlipped(true)
    setTimeout(() => setGravityFlipped(false), 1500)
  }, [gravityFlipped])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 flex items-start justify-center p-8 gap-8">
        {/* 3D Canvas */}
        <div className="flex-1 max-w-2xl aspect-square bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <Canvas
            key={cameraKey}
            shadows
            gl={{ antialias: true, alpha: true }}
            style={{ width: "100%", height: "100%", background: "transparent" }}
          >
            <JarScene
              coins={coins}
              coinRadius={coinRadius}
              lidOpen={lidOpen}
              dropHeight={dropHeight}
              gravity={physicsGravity}
              bounciness={bounciness}
              friction={friction}
              linearDamping={linearDamping}
              dropSpread={dropSpread}
              coinThicknessRatio={coinThicknessRatio}
              coinMetalness={coinMetalness}
              jarOpacity={jarOpacity}
              fogOpacity={fogOpacity}
              stickerUrl={stickerUrl}
              onCameraUpdate={handleCameraUpdate}
              initialCameraState={appliedCameraState}
            />
          </Canvas>
        </div>

        {/* Controls */}
        <div className="w-72 space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Demo</p>
            <div className="space-y-1.5">
              <button
                onClick={handleDrop}
                className="w-full py-2 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Drop a coin
              </button>
              <button
                onClick={handleReset}
                className="w-full py-2 text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors cursor-pointer"
              >
                Reset jar
              </button>
            </div>
            <div className="mt-3">
              <p className="text-[11px] text-gray-500 mb-1.5">Pre-fill jar</p>
              <div className="flex gap-1.5">
                {[10, 25, 50, 111].map((n) => (
                  <button
                    key={n}
                    onClick={() => prefillJar(n)}
                    className="flex-1 py-1.5 text-[11px] font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors cursor-pointer"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={handleZeroG}
                disabled={coins.length === 0 || gravityFlipped}
                className={cn(
                  "w-full py-1.5 text-[11px] font-medium rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                  gravityFlipped ? "bg-gray-900 text-white" : "text-gray-600 bg-gray-200 hover:bg-gray-300"
                )}
              >
                {gravityFlipped ? "Zero-G..." : "Zero-G"}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Physics</p>
            <div className="space-y-3">
              <Slider label="Drop Height" value={dropHeight} min={1.0} max={10.0} step={0.1} onChange={setDropHeight} hint="← lower · higher →" />
              <Slider label="Gravity" value={gravity} min={1} max={30} step={0.5} onChange={setGravity} hint="← floaty · heavy →" />
              <Slider label="Bounciness" value={bounciness} min={0} max={1} step={0.05} onChange={setBounciness} hint="← thud · bounce →" />
              <Slider label="Friction" value={friction} min={0} max={1} step={0.05} onChange={setFriction} hint="← icy · grippy →" />
              <Slider label="Damping" value={linearDamping} min={0} max={2} step={0.1} onChange={setLinearDamping} hint="← drift · settle →" />
              <Slider label="Drop Spread" value={dropSpread} min={0.1} max={1.0} step={0.05} onChange={setDropSpread} hint="← tight · wide →" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Coins</p>
            <div className="space-y-3">
              <Slider label="Max Coins" value={maxCoins} min={10} max={200} step={1} onChange={setMaxCoins} hint="← fewer · more →" />
              <Slider label="Radius" value={coinRadius} min={0.02} max={0.12} step={0.005} onChange={setCoinRadius} hint="← tiny · big →" />
              <Slider label="Thickness" value={coinThicknessRatio} min={0.1} max={1.0} step={0.05} onChange={setCoinThicknessRatio} hint="← thin · chunky →" />
              <Slider label="Metalness" value={coinMetalness} min={0} max={1} step={0.05} onChange={setCoinMetalness} hint="← matte · shiny →" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Jar</p>
            <div className="space-y-3">
              <Slider label="Glass Opacity" value={jarOpacity} min={0.05} max={0.8} step={0.05} onChange={setJarOpacity} hint="← clear · frosted →" />
              <Slider label="Fog Intensity" value={fogOpacity} min={0} max={0.4} step={0.02} onChange={setFogOpacity} hint="← none · misty →" />
            </div>
            <div className="mt-3">
              <p className="text-[11px] text-gray-500 mb-1.5">Sticker</p>
              <input
                ref={stickerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (stickerUrl !== DEFAULT_STICKER_URL) URL.revokeObjectURL(stickerUrl)
                  const url = URL.createObjectURL(file)
                  setStickerUrl(url)
                  e.target.value = ""
                }}
              />
              <button
                onClick={() => stickerInputRef.current?.click()}
                className="w-full py-1.5 text-[11px] font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors cursor-pointer"
              >
                Upload avatar
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Camera</p>
              <button
                onClick={() => {
                  const json = JSON.stringify(cameraState, null, 2)
                  navigator.clipboard.writeText(json)
                }}
                className="text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Copy JSON
              </button>
            </div>
            <pre className="text-[10px] text-gray-600 bg-gray-200 rounded-lg p-3 whitespace-pre-wrap font-mono tabular-nums">
{`pos: [${cameraState.position.join(", ")}]
target: [${cameraState.target.join(", ")}]
zoom: ${cameraState.zoom}`}
            </pre>
            <div className="flex gap-1.5 mt-2">
              <input
                type="text"
                value={cameraJsonInput}
                onChange={(e) => setCameraJsonInput(e.target.value)}
                placeholder="Paste camera JSON..."
                className="flex-1 px-2 py-1 text-[10px] bg-gray-200 rounded-md text-gray-700 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                onClick={handleApplyCameraJson}
                className="px-2 py-1 text-[10px] font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-500">
            <span>coins: <span className="font-medium text-gray-700">{coins.length}</span></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-gray-400">
        Built by{" "}
        <a href="https://github.com/baseddesigner" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
          @baseddesigner
        </a>
        {" · "}
        Powering{" "}
        <a href="https://pawr.link" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
          pawr.link
        </a>
      </footer>
    </div>
  )
}
