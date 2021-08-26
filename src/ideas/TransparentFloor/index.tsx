type TransparentFloorProps = { opacity?: number };

export default function TransparentFloor(props: TransparentFloorProps) {
  const { opacity = 0.6 } = props;

  return (
    <group name="transparent-floor">
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[500, 500]} />
        <meshStandardMaterial color="white" transparent opacity={opacity} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[500, 500, 500, 500]} />
        <meshStandardMaterial color="#ddd" wireframe />
      </mesh>
    </group>
  );
}
