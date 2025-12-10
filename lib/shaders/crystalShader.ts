// Advanced Crystal Shader with Procedural Textures
import * as THREE from 'three'

export const crystalVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying vec3 vViewPosition;
  
  uniform float time;
  uniform float pulseIntensity;
  
  // Simplex 3D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Pulsing effect
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    float displacement = snoise(position * 0.5 + time * 0.2) * pulseIntensity * pulse * 0.15;
    
    vec3 newPosition = position + normal * displacement;
    
    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = viewMatrix * worldPosition;
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const crystalFragmentShader = `
  uniform vec3 color;
  uniform vec3 accentColor;
  uniform float time;
  uniform float opacity;
  uniform float metalness;
  uniform float roughness;
  uniform float emissiveIntensity;
  uniform sampler2D matcap;
  uniform bool useMatcap;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying vec3 vViewPosition;
  
  // Fresnel
  float fresnel(vec3 viewDirection, vec3 worldNormal, float power) {
    return pow(1.0 - abs(dot(viewDirection, worldNormal)), power);
  }
  
  // Hash for procedural textures
  float hash(vec2 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * (p.x + p.y));
  }
  
  // Voronoi
  float voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float minDist = 1.0;
    
    for(int j = -1; j <= 1; j++) {
      for(int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = vec2(hash(n + g), hash(n + g + vec2(1.0, 0.0)));
        o = 0.5 + 0.5 * sin(time * 0.5 + 6.2831 * o);
        vec2 r = g + o - f;
        float d = length(r);
        minDist = min(minDist, d);
      }
    }
    return minDist;
  }
  
  void main() {
    // Normalize vectors
    vec3 viewDirection = normalize(vViewPosition);
    vec3 worldNormal = normalize(vNormal);
    
    // Fresnel effect
    float fresnelTerm = fresnel(viewDirection, worldNormal, 3.0);
    
    // Procedural crystal pattern
    vec2 uv = vUv * 4.0;
    float voronoiPattern = voronoi(uv + time * 0.1);
    float crystalPattern = smoothstep(0.2, 0.8, voronoiPattern);
    
    // Color mixing
    vec3 baseColor = mix(color, accentColor, fresnelTerm);
    vec3 patternColor = mix(baseColor, accentColor * 1.5, crystalPattern * 0.4);
    
    // Emissive rim light
    float rim = pow(fresnelTerm, 2.0);
    vec3 emissive = accentColor * rim * emissiveIntensity * 2.0;
    
    // Sparkle effect
    float sparkle = hash(floor(vUv * 20.0 + time)) * step(0.98, hash(floor(vUv * 20.0)));
    vec3 sparkleColor = vec3(1.0) * sparkle * 3.0;
    
    // Final color
    vec3 finalColor = patternColor + emissive + sparkleColor;
    
    // Energy waves
    float wave = sin(vWorldPosition.y * 2.0 - time * 3.0) * 0.5 + 0.5;
    finalColor += accentColor * wave * 0.3;
    
    float alpha = opacity + rim * 0.3;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export const createCrystalMaterial = (color: string, accentColor: string) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      accentColor: { value: new THREE.Color(accentColor) },
      time: { value: 0 },
      opacity: { value: 0.9 },
      metalness: { value: 0.95 },
      roughness: { value: 0.05 },
      emissiveIntensity: { value: 1.5 },
      pulseIntensity: { value: 1.0 },
      useMatcap: { value: false },
      matcap: { value: null },
    },
    vertexShader: crystalVertexShader,
    fragmentShader: crystalFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })
}
