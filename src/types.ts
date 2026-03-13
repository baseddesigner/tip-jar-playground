export type CoinInJar = {
  id: number
  txHash: string
  x: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  dropDelay: number
  spawnHeight?: number
}

export type CameraState = {
  position: [number, number, number]
  target: [number, number, number]
  zoom: number
}
