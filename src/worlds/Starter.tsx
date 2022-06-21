import { Spinning, Floating, StandardReality } from "spacesvr";
import TransparentFloor from "ideas/TransparentFloor";
import CloudySky from "ideas/CloudySky";

export default function Starter() {
  return (
    <StandardReality>
      <ambientLight />
      <group position={[0, 0, -4]}>
        <Floating>
          <Spinning xSpeed={0.2} ySpeed={0.4} zSpeed={0.3}>
            <mesh>
              <torusKnotBufferGeometry args={[1, 0.2]} />
              <meshStandardMaterial color="blue" />
            </mesh>
          </Spinning>
        </Floating>
      </group>
      <CloudySky color="white" />
      <TransparentFloor opacity={0.7} />
    </StandardReality>
  );
}
