/**
 * The QuadTricks "solar system" background: a port of the original sample
 * site's scene (quadtricks.lovable.app) to plain three.js.
 *
 * Same scene: extruded chrome "4" + emissive red triangle, a red point light
 * that makes the glow, studio-style light panels for reflections, three tilted
 * orbit rings, 120 drifting sparkles, bloom and a vignette. The emblem follows
 * six scroll keyframes, floats, and tilts towards the pointer.
 *
 * Why plain three.js: the sample shipped react-three-fiber + drei +
 * postprocessing (a 1 MB chunk, ~3 s of main-thread work on mobile). This is
 * loaded lazily after first paint and scales its quality per device:
 *  - mobile: pixel ratio <= 1.25, standard (not clearcoat) metal,
 *    fewer bevel segments and sparkles, a sprite glow instead of bloom passes.
 *  - desktop: pixel ratio <= 1.5; bloom only in the dark theme.
 *  - everywhere: adaptive quality (resolution, then bloom, step down if the frame
 *    rate sags), no rendering while the tab is hidden, and reduced motion turns
 *    off float, spin and twinkle and renders only on scroll.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Fog,
  Group,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  NoToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Shape,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
  type Material,
} from "three";

/* ------------------------------------------------------------------ shape */

// Logo outline in the original 1024px artboard (same points as the sample).
const MARK: [number, number][] = [
  [830, 118], [1027, 118], [1027, 636], [831, 636], [831, 367], [551, 634], [551, 690],
  [585, 724], [815, 724], [985, 906], [505, 906], [351, 750], [351, 575],
];
const TRIANGLE: [number, number][] = [[1021, 718], [1021, 906], [1218, 906]];

function toShape(points: [number, number][]) {
  const s = new Shape();
  points.forEach(([x, y], i) => {
    const px = (x - 785) / 100;
    const py = -(y - 512) / 100;
    if (i === 0) s.moveTo(px, py);
    else s.lineTo(px, py);
  });
  s.closePath();
  return s;
}

/* -------------------------------------------------------------- keyframes */

// [x, y, z, rotX, rotY, scale] across the page scroll (0 → 1).
const KEYS = [
  [1.6, 0, 0, 0.1, -0.5, 0.55],
  [-2.2, 0, -1, 0.3, 0.9, 0.42],
  [2.2, 0.2, -1, -0.2, -1.2, 0.42],
  [0, 0, -2.5, 0.6, Math.PI * 2, 0.5],
  [-1.8, -0.2, -0.5, 0.1, Math.PI * 2.6, 0.42],
  [0, 0.2, 0.5, 0, Math.PI * 4, 0.5],
];

function keyAt(p: number) {
  const t = p * (KEYS.length - 1);
  const i = Math.min(KEYS.length - 2, Math.floor(t));
  const f = t - i;
  const s = f * f * (3 - 2 * f);
  return KEYS[i].map((v, k) => v + (KEYS[i + 1][k] - v) * s);
}

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

/* --------------------------------------------------------------- sparkles */

const SPARKLE_VERT = /* glsl */ `
uniform float pixelRatio;
uniform float time;
attribute float size;
attribute float speed;
attribute float opacity;
attribute vec3 noise;
attribute vec3 color;
varying vec3 vColor;
varying float vOpacity;
void main() {
  vec4 m = modelMatrix * vec4(position, 1.0);
  m.y += sin(time * speed + m.x * noise.x * 100.0) * 0.2;
  m.z += cos(time * speed + m.x * noise.y * 100.0) * 0.2;
  m.x += cos(time * speed + m.x * noise.z * 100.0) * 0.2;
  vec4 v = viewMatrix * m;
  gl_Position = projectionMatrix * v;
  gl_PointSize = size * 25.0 * pixelRatio * (1.0 / -v.z);
  vColor = color;
  vOpacity = opacity;
}`;

const SPARKLE_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vOpacity;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / d - 0.1;
  gl_FragColor = vec4(vColor, strength * vOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function makeSparkles(count: number) {
  const scale = [18, 12, 8];
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let k = 0; k < 3; k++) pos[i * 3 + k] = scale[k] * (0.5 - Math.random());
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(pos, 3));
  geo.setAttribute("size", new BufferAttribute(new Float32Array(count).fill(2), 1));
  geo.setAttribute("speed", new BufferAttribute(new Float32Array(count).fill(0.3), 1));
  geo.setAttribute("opacity", new BufferAttribute(new Float32Array(count).fill(0.6), 1));
  geo.setAttribute("noise", new BufferAttribute(new Float32Array(count * 3).fill(1), 3));
  geo.setAttribute("color", new BufferAttribute(new Float32Array(count * 3), 3));
  const mat = new ShaderMaterial({
    vertexShader: SPARKLE_VERT,
    fragmentShader: SPARKLE_FRAG,
    uniforms: { pixelRatio: { value: 1 }, time: { value: 0 } },
    transparent: true,
    depthWrite: false,
  });
  return new Points(geo, mat);
}

function setSparkleColor(points: Points, hex: string) {
  const c = new Color(hex);
  const attr = points.geometry.getAttribute("color") as BufferAttribute;
  for (let i = 0; i < attr.count; i++) attr.setXYZ(i, c.r, c.g, c.b);
  attr.needsUpdate = true;
}

/* ------------------------------------------------------------ environment */

/** Studio light panels (the sample's Lightformers), baked once into an env map. */
function makeEnvironment(renderer: WebGLRenderer) {
  const env = new Scene();
  env.background = new Color("#000000");
  const forms: { geo: BufferGeometry; color: string; intensity: number; pos: [number, number, number]; scale: [number, number, number] }[] = [
    { geo: new PlaneGeometry(1, 1), color: "#ffffff", intensity: 4, pos: [0, 5, -2], scale: [12, 1, 1] },
    { geo: new PlaneGeometry(1, 1), color: "#ff5a3d", intensity: 2, pos: [-6, 0, 2], scale: [10, 0.6, 1] },
    { geo: new PlaneGeometry(1, 1), color: "#9fb6ff", intensity: 2.5, pos: [6, 1, 1], scale: [10, 0.6, 1] },
    { geo: new RingGeometry(0.5, 1, 64), color: "#ffffff", intensity: 2, pos: [0, 0, -8], scale: [6, 6, 6] },
  ];
  for (const f of forms) {
    const mat = new MeshBasicMaterial({ color: new Color(f.color).multiplyScalar(f.intensity), side: DoubleSide, toneMapped: false });
    const m = new Mesh(f.geo, mat);
    m.position.set(...f.pos);
    m.scale.set(...f.scale);
    m.lookAt(0, 0, 0);
    env.add(m);
  }
  const pmrem = new PMREMGenerator(renderer);
  const rt = pmrem.fromScene(env, 0, 0.1, 100);
  pmrem.dispose();
  env.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  return rt;
}

/** Soft radial glow sprite: stands in for bloom on mobile and in light mode. */
function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

/* ------------------------------------------------------------------ scene */

export type SceneOptions = {
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
  /** Called after the first frame is drawn (used to fade the canvas in). */
  onReady?: () => void;
};

export type EmblemScene = { setTheme(): void; dispose(): void };

type Composer = { render(): void; setSize(w: number, h: number): void; setPixelRatio(r: number): void; dispose(): void };

export function createEmblemScene({ canvas, reducedMotion, onReady }: SceneOptions): EmblemScene {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowEnd = coarse || window.innerWidth < 768;
  let dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1.25 : 1.5);
  // Adaptive quality: set when frames run slow (see the end of frame()).
  let bloomAllowed = !lowEnd;

  // failIfMajorPerformanceCaveat: no context (so the CSS fallback stays) when the device would
  // only render WebGL in software, which would stall the main thread every frame.
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    failIfMajorPerformanceCaveat: true,
    powerPreference: lowEnd ? "default" : "high-performance",
  });
  renderer.setPixelRatio(dpr);
  // The sample's postprocessing disabled tone mapping; bright highlights clip the same way here.
  renderer.toneMapping = NoToneMapping;

  const scene = new Scene();
  const bg = new Color();
  scene.background = bg;
  const fog = new Fog(bg.clone(), 9, 22);
  scene.fog = fog;

  const camera = new PerspectiveCamera(42, 1, 0.1, 1000);
  camera.position.set(0, 0, 9);

  const envRT = makeEnvironment(renderer);
  scene.environment = envRT.texture;

  // Lights (identical to the sample).
  scene.add(new AmbientLight(0xffffff, 0.2));
  const key = new DirectionalLight(0xffffff, 2.5);
  key.position.set(5, 5, 5);
  const rim = new DirectionalLight("#9fb6ff", 1.2);
  rim.position.set(-5, 2, 4);
  const red = new PointLight("#ff3b2f", 40);
  red.position.set(-4, -2, 3);
  scene.add(key, rim, red);

  // Emblem.
  const extrude = { depth: 0.9, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.07, bevelSegments: lowEnd ? 3 : 6 };
  const markGeo = new ExtrudeGeometry(toShape(MARK), extrude).translate(0, 0, -0.45);
  const triGeo = new ExtrudeGeometry(toShape(TRIANGLE), extrude).translate(0, 0, -0.45);
  const chrome = lowEnd
    ? new MeshStandardMaterial({ color: "#e6eaf2", metalness: 0.9, roughness: 0.2, envMapIntensity: 2.4 })
    : new MeshPhysicalMaterial({ color: "#e6eaf2", metalness: 0.9, roughness: 0.22, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.05 });
  const ember = lowEnd
    ? new MeshStandardMaterial({ color: "#ff3b2f", emissive: "#ff2a1a", emissiveIntensity: 1.4, metalness: 0.3, roughness: 0.2 })
    : new MeshPhysicalMaterial({ color: "#ff3b2f", emissive: "#ff2a1a", emissiveIntensity: 1.4, metalness: 0.3, roughness: 0.2, clearcoat: 1 });

  const emblem = new Group();
  emblem.scale.setScalar(0.5);
  emblem.add(new Mesh(markGeo, chrome), new Mesh(triGeo, ember));

  // Glow sprites at the triangle and the lit inner corner (shown when bloom is off).
  const glowTex = makeGlowTexture();
  const glowTri = new Sprite(new SpriteMaterial({ map: glowTex, color: "#ff3b2f", transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.85 }));
  glowTri.position.set(3.0, -3.25, 0.6);
  glowTri.scale.setScalar(4.2);
  const glowCore = new Sprite(new SpriteMaterial({ map: glowTex, color: "#ff5a3d", transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.55 }));
  glowCore.position.set(-3.2, -1.6, 0.8);
  glowCore.scale.setScalar(3.6);
  emblem.add(glowTri, glowCore);

  const float = new Group();
  float.add(emblem);
  scene.add(float);

  // Orbit rings.
  const rings = new Group();
  rings.position.set(0, 0, -6);
  const ringMats: MeshBasicMaterial[] = [];
  [5, 7.5, 10].forEach((r, i) => {
    const mat = new MeshBasicMaterial({ transparent: true, opacity: 0.5 });
    ringMats.push(mat);
    const m = new Mesh(new TorusGeometry(r, 0.012, 8, lowEnd ? 120 : 160), mat);
    m.rotation.z = i * 0.6;
    rings.add(m);
  });
  scene.add(rings);

  // Sparkles.
  const sparkles = makeSparkles(lowEnd ? 70 : 120);
  const sparkleMat = sparkles.material as ShaderMaterial;
  scene.add(sparkles);

  // Bloom (desktop, dark theme): loaded on demand so phones never download it.
  let composer: Composer | null = null;
  let composerLoading = false;
  let disposed = false;
  let useBloom = false;
  let width = 0;
  let height = 0;

  function loadComposer() {
    if (composer || composerLoading || lowEnd) return;
    composerLoading = true;
    Promise.all([
      import("three/examples/jsm/postprocessing/EffectComposer.js"),
      import("three/examples/jsm/postprocessing/RenderPass.js"),
      import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
      import("three/examples/jsm/postprocessing/OutputPass.js"),
    ]).then(([{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }]) => {
      if (disposed) return;
      const w = width || 1;
      const h = height || 1;
      const target = new WebGLRenderTarget(w * dpr, h * dpr, { type: HalfFloatType, samples: 4 });
      const c = new EffectComposer(renderer, target);
      c.addPass(new RenderPass(scene, camera));
      c.addPass(new UnrealBloomPass(new Vector2(w, h), 0.3, 0.3, 0.8));
      c.addPass(new OutputPass());
      c.setPixelRatio(dpr);
      c.setSize(w, h);
      composer = c;
      applyBloom();
      requestRender();
    });
  }

  function applyBloom() {
    const on = useBloom && !!composer;
    glowTri.visible = glowCore.visible = !on;
  }

  /* ----------------------------------------------------------- theme */

  function setTheme() {
    const root = document.documentElement;
    const dark = root.getAttribute("data-theme") !== "light";
    const css = getComputedStyle(root).getPropertyValue("--bg").trim();
    bg.set(css || (dark ? "#07090e" : "#f5f7fb"));
    fog.color.copy(bg);
    ringMats.forEach((m, i) => {
      m.color.set(i === 1 ? (dark ? "#ff3b2f" : "#fc3c29") : dark ? "#8fa3c7" : "#425b96");
      m.opacity = dark ? 0.5 : 0.45;
    });
    setSparkleColor(sparkles, dark ? "#c9d4ea" : "#425b96");
    // On a light page an additive glow washes out; use a normal-blended tint instead.
    for (const s of [glowTri, glowCore]) {
      s.material.blending = dark ? AdditiveBlending : NormalBlending;
      s.material.opacity = dark ? (s === glowTri ? 0.85 : 0.55) : s === glowTri ? 0.35 : 0;
      s.material.needsUpdate = true;
    }
    useBloom = dark && bloomAllowed;
    if (useBloom) loadComposer();
    applyBloom();
    requestRender();
  }

  /* ---------------------------------------------------------- sizing */

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || (w === width && h === height)) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    requestRender();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function setDpr(next: number) {
    dpr = next;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    composer?.setPixelRatio(dpr);
    composer?.setSize(width, height);
  }

  /* --------------------------------------------------------- pointer */

  const pointer = { x: 0, y: 0 };
  function onPointer(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  /* ------------------------------------------------------------ loop */

  const floatOffset = Math.random() * 10000;
  let raf = 0;
  let compiled = false;
  let last = performance.now();
  let elapsed = 0;
  let first = true;
  // Adaptive quality: average the frame interval over ~1.5 s. Below ~40 fps step down one
  // notch: resolution to 1x, then bloom off (sprite glow instead), then resolution to 0.75x.
  let slowAcc = 0;
  let slowFrames = 0;

  function frame(now: number) {
    raf = 0;
    const rawDt = (now - last) / 1000;
    const dt = Math.min(Math.max(rawDt, 0), 0.05);
    last = now;
    elapsed += dt;

    const mobile = width < 768;
    const p = scrollProgress();
    const [kx, ky, kz, rx, ry, ks] = keyAt(p);
    // Reduced motion snaps to the keyframe; otherwise ease like the sample.
    const a = reducedMotion ? 1 : 1 - Math.exp(-4 * dt);
    const tx = mobile ? 0 : kx;
    const ty = ky + (mobile ? 0.6 : 0);
    const ts = mobile ? ks * 0.75 : ks;
    emblem.position.x += (tx - emblem.position.x) * a;
    emblem.position.y += (ty - emblem.position.y) * a;
    emblem.position.z += (kz - emblem.position.z) * a;
    emblem.rotation.x += (rx + pointer.y * -0.25 - emblem.rotation.x) * a;
    emblem.rotation.y += (ry + pointer.x * 0.4 - emblem.rotation.y) * a;
    emblem.scale.setScalar(emblem.scale.x + (ts - emblem.scale.x) * a);

    if (!reducedMotion) {
      // drei <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
      const t = ((floatOffset + elapsed) / 4) * 1.4;
      float.rotation.x = (Math.cos(t) / 8) * 0.15;
      float.rotation.y = (Math.sin(t) / 8) * 0.15;
      float.rotation.z = (Math.sin(t) / 20) * 0.15;
      float.position.y = (Math.sin(t) / 10) * 0.6;
      rings.rotation.z += dt * 0.08;
      sparkleMat.uniforms.time.value = elapsed;
    }
    rings.rotation.x = 1.2 + p * 1.5;
    rings.position.y = -p * 2;
    sparkleMat.uniforms.pixelRatio.value = dpr;

    if (useBloom && composer) composer.render();
    else renderer.render(scene, camera);

    if (first) {
      first = false;
      onReady?.();
    }

    if (!reducedMotion) {
      if (elapsed > 2 && rawDt > 0 && rawDt < 0.5) {
        slowAcc += rawDt;
        slowFrames++;
        if (slowFrames >= 90) {
          if (slowAcc / slowFrames > 0.025) stepDown();
          slowAcc = 0;
          slowFrames = 0;
        }
      }
      schedule();
    }
  }

  function stepDown() {
    if (dpr > 1) setDpr(Math.max(1, dpr - 0.25));
    else if (useBloom) {
      bloomAllowed = false;
      useBloom = false;
      applyBloom();
    } else if (dpr > 0.75) setDpr(0.75);
  }

  function schedule() {
    if (compiled && !raf && !disposed && document.visibilityState === "visible") raf = requestAnimationFrame(frame);
  }
  function requestRender() {
    if (width) schedule();
  }

  function onVisibility() {
    if (document.visibilityState === "visible") {
      last = performance.now();
      schedule();
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }
  document.addEventListener("visibilitychange", onVisibility);
  // Reduced motion renders on demand: on scroll and resize only.
  const onScroll = () => requestRender();
  if (reducedMotion) window.addEventListener("scroll", onScroll, { passive: true });

  setTheme();
  resize();
  // Compile shaders off the main thread where supported (KHR_parallel_shader_compile)
  // before the first frame, so phones do not freeze while they build.
  renderer
    .compileAsync(scene, camera)
    .catch(() => {})
    .then(() => {
      compiled = true;
      schedule();
    });

  return {
    setTheme,
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      scene.traverse((o) => {
        if (o instanceof Mesh || o instanceof Points || o instanceof Sprite) {
          o.geometry.dispose();
          const m = o.material as Material | Material[];
          (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
        }
      });
      glowTex.dispose();
      envRT.dispose();
      composer?.dispose();
      renderer.dispose();
    },
  };
}
