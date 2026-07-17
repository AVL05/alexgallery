export const heroVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const heroFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uPointer;
  uniform vec4 uCover;
  uniform float uPointerIntensity;
  uniform float uScroll;
  uniform float uScrollIntensity;
  uniform float uRadius;
  varying vec2 vUv;

  void main() {
    vec2 delta = vUv - uPointer;
    float distanceToPointer = length(delta);
    float influence = 1.0 - smoothstep(0.0, uRadius, distanceToPointer);
    vec2 direction = distanceToPointer > 0.0001 ? delta / distanceToPointer : vec2(0.0);
    vec2 distortion = direction * influence * uPointerIntensity;
    distortion.y += sin(vUv.x * 3.14159265) * uScroll * uScrollIntensity;
    vec2 coveredUv = (vUv + distortion) * uCover.xy + uCover.zw;
    gl_FragColor = texture2D(uTexture, clamp(coveredUv, 0.001, 0.999));
  }
`;
