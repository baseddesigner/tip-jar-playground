import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function JarLid({ open }: { open: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const lidSettled = useRef(false)

  useEffect(() => {
    lidSettled.current = false
  }, [open])

  useFrame(() => {
    if (lidSettled.current || !groupRef.current) return
    const tgtRot = open ? -0.5 : 0
    const tgtY = open ? 1.65 : 1.31
    const dRot = tgtRot - groupRef.current.rotation.z
    const dY = tgtY - groupRef.current.position.y
    groupRef.current.rotation.z += dRot * 0.08
    groupRef.current.position.y += dY * 0.08
    if (Math.abs(dRot) < 0.001 && Math.abs(dY) < 0.001) lidSettled.current = true
  })

  return (
    <group ref={groupRef} position={[0, 1.31, 0]}>
      <mesh>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 32]} />
        <meshStandardMaterial color="#999" metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  )
}
