import { RigidBody, CuboidCollider } from "@react-three/rapier"

export function JarColliders({ lidOpen }: { lidOpen: boolean }) {
  const t = 0.2
  const r = 0.28
  const h = 2.5
  const sides = 24

  return (
    <>
      <RigidBody type="fixed" position={[0, -t / 2, 0]}>
        <CuboidCollider args={[r + t, t / 2, r + t]} />
      </RigidBody>
      {!lidOpen && (
        <RigidBody type="fixed" position={[0, 1.31, 0]}>
          <CuboidCollider args={[r + t, 0.03, r + t]} />
        </RigidBody>
      )}
      {Array.from({ length: sides }, (_, i) => {
        const angle = (i * Math.PI * 2) / sides
        const dist = r + t / 2
        const halfW = r * Math.tan(Math.PI / sides) * 1.3
        return (
          <RigidBody
            key={i}
            type="fixed"
            position={[dist * Math.cos(angle), h / 2, dist * Math.sin(angle)]}
            rotation={[0, angle, 0]}
          >
            <CuboidCollider args={[halfW, h / 2, t / 2]} />
          </RigidBody>
        )
      })}
    </>
  )
}
