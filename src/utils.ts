import * as THREE from "three"

export function hashToColor(hash: string): THREE.Color {
  const h = parseInt(hash.slice(2, 8), 16) % 360
  const s = 0.30 + (parseInt(hash.slice(14, 16), 16) % 10) / 100
  const l = 0.40 + (parseInt(hash.slice(16, 18), 16) % 15) / 100
  return new THREE.Color().setHSL(h / 360, s, l)
}

export function randomTxHash(): string {
  const bytes = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join("")
  return `0x${bytes}`
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}
