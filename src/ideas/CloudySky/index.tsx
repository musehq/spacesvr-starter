import { GroupProps } from "@react-three/fiber";
import { Color } from "three";
import { useSkyMat } from "./materials/sky";

type GradientSky = {
  color?: string;
} & GroupProps;

const RADIUS = 100;

const getGLSLCol = (c: Color) => {
  const hex = c.getHex();
  return [
    ((hex >> 16) & 0xff) / 255,
    ((hex >> 8) & 0xff) / 255,
    (hex & 0xff) / 255,
  ];
};

export default function CloudySky(props: GradientSky) {
  const { color, ...restProps } = props;

  let COLORS = [
    0.62, 0.988, 0.992, 0.757, 0.922, 0.992, 0.867, 0.847, 0.988, 0.961, 0.765,
    0.984,
  ];
  if (color) {
    const col = new Color(color);
    const col1 = new Color(color).clone().multiplyScalar(0.8);
    const col2 = new Color(color).clone().multiplyScalar(0.75);
    const col3 = new Color(color).clone().multiplyScalar(0.5);
    COLORS = [
      ...getGLSLCol(col),
      ...getGLSLCol(col1),
      ...getGLSLCol(col2),
      ...getGLSLCol(col3),
    ];
  }

  const mat = useSkyMat(RADIUS, COLORS);

  return (
    <group {...restProps} name="cloudy-sky">
      <mesh material={mat}>
        <sphereBufferGeometry args={[RADIUS, 50, 50]} />
      </mesh>
    </group>
  );
}
