import { DoubleSide, ShaderMaterial, Uniform } from "three";
import { useMemo } from "react";
import { useLimiter } from "spacesvr";
import { useFrame } from "@react-three/fiber";

export const useSkyMat = (radius: number, colors: number[]): ShaderMaterial => {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          radius: new Uniform(radius),
          colors: new Uniform(colors),
          num_colors: new Uniform(colors.length),
          time: new Uniform(0),
        },
        vertexShader: vert,
        fragmentShader: frag,
        side: DoubleSide,
      }),
    [radius, colors]
  );

  const limiter = useLimiter(30);
  useFrame(({ clock }) => {
    if (!mat || !limiter.isReady(clock)) return;

    // @ts-ignore
    mat.uniforms.time.value = ((new Date() / 1000) % 10000) / 5;
  });

  return mat;
};

const vert = `
    varying vec3 absPosition;
    void main() {
        absPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const frag = `
  uniform highp float radius;
  uniform highp float time;
  uniform int num_colors;
  uniform highp float colors[100];
  varying vec3 absPosition;
  
  //
  // Description : Array and textureless GLSL 2D/3D/4D simplex
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //
  
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
       return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v)
    {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
  
  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
  
  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
    } 
  
  float get_mix(int index, float noise) { 
    highp float lastPerc = float(index*3 - 1) / float(num_colors);
    highp float thisPerc = float(index*3) / float(num_colors);
    highp float height = ((absPosition.y + radius) / 2.) / (radius);
    return smoothstep(lastPerc, thisPerc, height + noise * 0.1);
  }

  void main() {
    highp float yCoord = (gl_FragCoord.y / gl_FragCoord.w);
    highp float height = ((absPosition.y + radius) / 2.) / (radius);
    
    highp float noise_smooth = snoise((absPosition * 0.01)+ time*0.1);
    highp float noise_rough = snoise((absPosition * 0.1)+ time*0.45);
    

    // color 0
    vec3 color = vec3(colors[0], colors[1], colors[2]);
    
    // color 1
    highp float noise1 = noise_smooth * 2. + noise_rough * 0.2;
    color = mix(color, vec3(colors[3], colors[4], colors[5]), get_mix(1, noise1));

    // color 2
    highp float noise2 = noise_smooth * 4. + noise_rough * 0.2;
    color = mix(color, vec3(colors[6], colors[7], colors[8]), get_mix(2, noise2));

    // color 3
    highp float noise3 = noise_smooth * 1.5 + noise_rough * 0.8;
    color = mix(color, vec3(colors[9], colors[10], colors[11]), get_mix(3, noise3));

    gl_FragColor = vec4( color, 1.0 );
  }
`;
