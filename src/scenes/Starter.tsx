import { Background, Floating, Fog, StandardEnvironment } from "spacesvr";
import { Color } from "three";

export default function Starter() {
  return (
    <StandardEnvironment>
      <Background color="white" />
      <Fog color={new Color("white")} near={10} far={100} />
      <ambientLight />
      <Floating>
        <mesh position-y={1}>
          <torusBufferGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>
      </Floating>
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </StandardEnvironment>
  );
}
