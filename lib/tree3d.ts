/**
 * Árvore da vida em 3D (Three.js) para a seção do método.
 * Raízes aparentes, tronco trançado e copa redonda de folhas douradas.
 * Cresce conforme o progresso (0 → 1): raízes, tronco, galhos e, por fim, folhas e frutos.
 * Tudo é procedural e leve: 2 malhas para a madeira e 2 malhas instanciadas para folhas e frutos.
 */
import * as THREE from "three";

type Bucket = { geos: THREE.TubeGeometry[]; grows: Float32Array[] };
type Spot = { p: THREE.Vector3; g: number };

export type TreeScene = {
  setProgress: (p: number) => void;
  dispose: () => void;
};

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function buildTree(rand: () => number) {
  const tree: Bucket = { geos: [], grows: [] };
  const roots: Bucket = { geos: [], grows: [] };
  const leaves: Spot[] = [];
  const fruits: Spot[] = [];
  let maxTree = 0;
  let maxRoot = 0;

  const rndVec = () => V(rand() - 0.5, rand() - 0.5, rand() - 0.5);
  const turn = (d: THREE.Vector3, a: number) => d.clone().applyAxisAngle(d.clone().cross(rndVec()).normalize(), a);

  /** Tubo afinando de r0 para r1; guarda, por vértice, a distância percorrida desde a base (usada no crescimento). */
  function addTube(bucket: Bucket, pts: THREE.Vector3[], r0: number, r1: number, g0: number, radial: number) {
    const curve = new THREE.CatmullRomCurve3(pts);
    const len = curve.getLength();
    const seg = Math.max(3, Math.round(len * 10));
    const geo = new THREE.TubeGeometry(curve, seg, 1, radial, false);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const P = V(0, 0, 0);
    const v = V(0, 0, 0);
    const grow = new Float32Array(pos.count);
    for (let i = 0; i <= seg; i++) {
      const t = i / seg;
      curve.getPointAt(t, P);
      const r = r0 + (r1 - r0) * t;
      for (let j = 0; j <= radial; j++) {
        const k = i * (radial + 1) + j;
        v.fromBufferAttribute(pos, k).sub(P).multiplyScalar(r).add(P);
        pos.setXYZ(k, v.x, v.y, v.z);
        grow[k] = g0 + t * len;
      }
    }
    bucket.geos.push(geo);
    bucket.grows.push(grow);
    return { curve, len, g1: g0 + len };
  }

  // Copa: galhos recursivos contidos numa esfera, para manter o desenho arredondado da referência.
  const CENTER = V(0, 3.0, 0);
  const RAD = V(2.9, 1.85, 2.9); // copa mais larga que alta
  const MAXD = 5;
  function branch(p0: THREE.Vector3, dir: THREE.Vector3, len: number, r: number, depth: number, g0: number) {
    let end = p0.clone().addScaledVector(dir, len);
    const off = end.clone().sub(CENTER).divide(RAD);
    if (off.length() > 1) end = CENTER.clone().add(off.normalize().multiply(RAD).multiplyScalar(0.9 + rand() * 0.1));
    const mid = p0.clone().lerp(end, 0.5).add(rndVec().multiplyScalar(len * 0.22));
    const r1 = Math.max(0.01, r * 0.66);
    const { curve, len: L, g1 } = addTube(tree, [p0, mid, end], r, r1, g0, depth < 2 ? 8 : depth < 4 ? 6 : 4);
    maxTree = Math.max(maxTree, g1);

    // Folhas em volta dos galhos finos (não só em cima deles), para a copa ficar cheia.
    if (depth >= 3) {
      const n = depth === MAXD ? 16 : depth === 4 ? 9 : 6;
      const spread = depth === MAXD ? 0.42 : 0.3;
      for (let i = 0; i < n; i++) {
        const t = 0.2 + 0.8 * rand();
        leaves.push({ p: curve.getPointAt(t).add(rndVec().multiplyScalar(spread * 2)), g: g0 + t * L });
      }
      if (depth >= 4 && rand() < 0.5) {
        fruits.push({ p: end.clone().add(rndVec().multiplyScalar(0.4)).add(V(0, -0.14, 0)), g: g1 });
      }
    }
    if (depth >= MAXD) return;

    const d0 = end.clone().sub(mid).normalize();
    const n = rand() < 0.5 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const out = V(end.x, (end.y - 2.6) * 0.5, end.z).normalize();
      const d = turn(d0, 0.35 + rand() * 0.5).addScaledVector(out, 0.55).addScaledVector(UP, 0.06).normalize();
      branch(end, d, len * (0.72 + rand() * 0.1), r1 * 0.95, depth + 1, g1);
    }
  }

  // Raízes: descem e se abrem, sempre abaixo da linha do solo.
  function root(p0: THREE.Vector3, dir: THREE.Vector3, len: number, r: number, depth: number, g0: number) {
    const end = p0.clone().addScaledVector(dir, len);
    if (end.y > -0.05) end.y = -0.05 - rand() * 0.1;
    const mid = p0.clone().lerp(end, 0.5).add(rndVec().multiplyScalar(len * 0.2));
    const r1 = Math.max(0.008, r * 0.62);
    const { g1 } = addTube(roots, [p0, mid, end], r, r1, g0, depth < 2 ? 7 : 4);
    maxRoot = Math.max(maxRoot, g1);
    if (depth >= 4) return;

    const d0 = end.clone().sub(mid).normalize();
    const n = depth < 1 || rand() < 0.6 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const out = V(end.x, 0, end.z).normalize();
      const d = turn(d0, 0.25 + rand() * 0.45).addScaledVector(V(0, -1, 0), 0.4).addScaledVector(out, 0.15).normalize();
      root(end, d, len * (0.72 + rand() * 0.1), r1 * 0.95, depth + 1, g1);
    }
  }

  // Tronco trançado: um núcleo e cinco fios que giram em volta dele.
  const H = 2.15;
  const NS = 5;
  const core: THREE.Vector3[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    core.push(V(Math.sin(t * 3) * 0.05, -0.1 + t * H, 0));
  }
  let trunkG = addTube(tree, core, 0.24, 0.15, 0, 10).g1;

  for (let k = 0; k < NS; k++) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const a = (k * Math.PI * 2) / NS + t * 2.6;
      const ro = 0.2 * (1 + 0.9 * Math.pow(1 - t, 3) + 0.6 * Math.pow(t, 4));
      pts.push(V(Math.cos(a) * ro + Math.sin(t * 3) * 0.05, -0.1 + t * H, Math.sin(a) * ro));
    }
    const { g1 } = addTube(tree, pts, 0.13, 0.095, 0, 7);
    trunkG = Math.max(trunkG, g1);
    const a0 = (k * Math.PI * 2) / NS;
    const a1 = a0 + 2.6;
    branch(pts[12], V(Math.cos(a1) * 1.25, 1, Math.sin(a1) * 1.25).normalize(), 1.15, 0.09, 1, g1);
    root(pts[0], V(Math.cos(a0), -0.5, Math.sin(a0)).normalize(), 0.85, 0.1, 0, 0);
  }
  branch(V(0.05, H, 0), turn(UP, 0.15), 0.95, 0.1, 1, trunkG);
  // Galhos que saem do meio do tronco preenchem a parte baixa e o centro da copa.
  for (let k = 0; k < 4; k++) {
    const a = k * (Math.PI / 2) + 0.4;
    const y = H * (0.78 + rand() * 0.1);
    branch(V(0, y, 0), V(Math.cos(a), 0.6, Math.sin(a)).normalize(), 0.95, 0.075, 2, trunkG * (y / H));
  }
  for (let k = 0; k < 3; k++) {
    const a = k * 2.1 + 0.6;
    root(
      V(Math.cos(a) * 0.15, -0.1, Math.sin(a) * 0.15),
      V(Math.cos(a) * 0.5, -1, Math.sin(a) * 0.5).normalize(),
      0.7,
      0.09,
      1,
      0,
    );
  }

  return { tree, roots, leaves, fruits, maxTree, maxRoot, trunkK: trunkG / maxTree };
}

/** Junta os tubos numa única geometria, com o atributo aGrow normalizado (0 = base, 1 = ponta mais distante). */
function merge(b: Bucket, max: number) {
  let nv = 0;
  let ni = 0;
  for (const g of b.geos) {
    nv += g.attributes.position.count;
    ni += g.index!.count;
  }
  const pos = new Float32Array(nv * 3);
  const nor = new Float32Array(nv * 3);
  const gr = new Float32Array(nv);
  const idx = new Uint32Array(ni);
  let vo = 0;
  let io = 0;
  b.geos.forEach((g, k) => {
    pos.set(g.attributes.position.array as Float32Array, vo * 3);
    nor.set(g.attributes.normal.array as Float32Array, vo * 3);
    const grows = b.grows[k];
    for (let i = 0; i < grows.length; i++) gr[vo + i] = grows[i] / max;
    const ia = g.index!.array;
    for (let i = 0; i < ia.length; i++) idx[io + i] = ia[i] + vo;
    vo += g.attributes.position.count;
    io += ia.length;
    g.dispose();
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  geo.setAttribute("aGrow", new THREE.BufferAttribute(gr, 1));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  return geo;
}

type Uniform = { value: number };

/** Madeira: descarta os fragmentos além do ponto de crescimento atual. */
function woodMaterial(color: number, u: Uniform) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.88 });
  m.onBeforeCompile = (s) => {
    s.uniforms.uGrow = u;
    s.vertexShader = s.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aGrow;\nvarying float vGrow;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvGrow = aGrow;");
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vGrow;\nuniform float uGrow;")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (vGrow > uGrow) discard;");
  };
  return m;
}

/** Folhas e frutos: brotam (escala 0 → 1) em ordem de dentro para fora e balançam de leve ao vento. */
function popMaterial(params: THREE.MeshStandardMaterialParameters, u: Uniform, time: Uniform, sway: number) {
  const m = new THREE.MeshStandardMaterial(params);
  m.onBeforeCompile = (s) => {
    s.uniforms.uPop = u;
    s.uniforms.uTime = time;
    s.vertexShader = s.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aDelay;\nuniform float uPop;\nuniform float uTime;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float k = smoothstep(aDelay, aDelay + 0.2, uPop);
        transformed *= k;
        transformed.x += sin(uTime * 1.4 + aDelay * 40.0) * ${sway.toFixed(3)} * position.y;`,
      );
  };
  return m;
}

export function createTreeScene(canvas: HTMLCanvasElement, opts: { reduced: boolean }): TreeScene {
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const U = {
    tree: { value: 0 },
    roots: { value: 0 },
    leaf: { value: 0 },
    fruit: { value: 0 },
    time: { value: 0 },
  };

  const t = buildTree(rand);
  const bark = 0x3d2619;
  const disposables: { dispose: () => void }[] = [];
  const add = <T extends THREE.Object3D>(o: T) => {
    group.add(o);
    return o;
  };

  const treeGeo = merge(t.tree, t.maxTree);
  const rootGeo = merge(t.roots, t.maxRoot);
  const treeMat = woodMaterial(bark, U.tree);
  const rootMat = woodMaterial(bark, U.roots);
  add(new THREE.Mesh(treeGeo, treeMat));
  add(new THREE.Mesh(rootGeo, rootMat));
  disposables.push(treeGeo, rootGeo, treeMat, rootMat);

  const gMin = Math.min(...t.leaves.map((l) => l.g));
  const gMax = Math.max(...t.leaves.map((l) => l.g));
  const rndVec = () => V(rand() - 0.5, rand() - 0.5, rand() - 0.5);

  function instanced(geo: THREE.BufferGeometry, mat: THREE.Material, list: Spot[], colors: string[], scale: number) {
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    const d = new THREE.Object3D();
    const delay = new Float32Array(list.length);
    const cols = colors.map((c) => new THREE.Color(c));
    list.forEach((l, i) => {
      d.position.copy(l.p);
      const out = l.p.clone().sub(V(0, 2.2, 0)).normalize();
      d.lookAt(l.p.clone().add(out).add(rndVec()));
      d.rotateZ(rand() * Math.PI * 2);
      const s = scale * (0.75 + rand() * 0.5);
      d.scale.set(s, s, s);
      d.updateMatrix();
      im.setMatrixAt(i, d.matrix);
      im.setColorAt(i, cols[Math.floor(rand() * cols.length)]);
      delay[i] = ((l.g - gMin) / (gMax - gMin)) * 0.75 + rand() * 0.05;
    });
    geo.setAttribute("aDelay", new THREE.InstancedBufferAttribute(delay, 1));
    disposables.push(geo, mat);
    return add(im);
  }

  // Folha em formato de amêndoa, levemente dobrada na nervura.
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.42, 0.42, 0, 1);
  shape.quadraticCurveTo(-0.42, 0.42, 0, 0);
  const leafGeo = new THREE.ShapeGeometry(shape, 5);
  const lp = leafGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < lp.count; i++) lp.setZ(i, Math.abs(lp.getX(i)) * 0.35);
  leafGeo.computeVertexNormals();

  instanced(
    leafGeo,
    popMaterial({ roughness: 0.5, metalness: 0.15, side: THREE.DoubleSide }, U.leaf, U.time, opts.reduced ? 0 : 0.07),
    t.leaves,
    ["#c89b4f", "#d6ad62", "#b8863f", "#e2c27f", "#b38065"],
    0.22,
  );
  instanced(
    new THREE.SphereGeometry(1, 12, 10),
    popMaterial({ roughness: 0.35 }, U.fruit, U.time, 0),
    t.fruits,
    ["#c2614a", "#d27a5f", "#a94f3c"],
    0.1,
  );

  // Linha do solo: um halo suave separando o que se vê do que sustenta.
  const sc = document.createElement("canvas");
  sc.width = sc.height = 128;
  const cx = sc.getContext("2d")!;
  const grd = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(138,90,66,.22)");
  grd.addColorStop(1, "rgba(138,90,66,0)");
  cx.fillStyle = grd;
  cx.fillRect(0, 0, 128, 128);
  const groundTex = new THREE.CanvasTexture(sc);
  const groundGeo = new THREE.PlaneGeometry(6, 6);
  const groundMat = new THREE.MeshBasicMaterial({ map: groundTex, transparent: true, depthWrite: false });
  const ground = add(new THREE.Mesh(groundGeo, groundMat));
  ground.rotation.x = -Math.PI / 2;
  disposables.push(groundTex, groundGeo, groundMat);

  scene.add(new THREE.HemisphereLight(0xfff4ec, 0xc9a48e, 1.5));
  const key = new THREE.DirectionalLight(0xffe6cf, 2.0);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xf3ddd2, 0.6);
  fill.position.set(-5, 1, -3);
  scene.add(fill);

  // Enquadramentos: raízes (perto, embaixo), tronco e árvore inteira.
  const STAGES = [
    { y: -1.0, h: 1.8, w: 2.7 },
    { y: 0.4, h: 2.7, w: 2.7 },
    { y: 1.2, h: 4.0, w: 3.4 },
  ];
  const target = V(0, 0, 0);
  let progress = opts.reduced ? 1 : 0;
  let cur = progress;
  let running = false;
  let raf = 0;
  const clock = new THREE.Clock();

  function frame() {
    const time = clock.getElapsedTime();
    U.time.value = time;
    cur += (progress - cur) * (opts.reduced ? 1 : 0.06);

    U.roots.value = sstep(0.0, 0.18, cur) * 1.01;
    U.tree.value = lerp(0, t.trunkK, sstep(0.25, 0.43, cur)) + (1.01 - t.trunkK) * sstep(0.5, 0.68, cur);
    U.leaf.value = sstep(0.72, 0.93, cur);
    U.fruit.value = sstep(0.86, 0.99, cur);

    const z1 = sstep(0.2, 0.32, cur);
    const z2 = sstep(0.45, 0.58, cur);
    const pick = (k: "y" | "h" | "w") => lerp(lerp(STAGES[0][k], STAGES[1][k], z1), STAGES[2][k], z2);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max(pick("h") / tan, pick("w") / (tan * camera.aspect)) * 1.05;
    const y = pick("y");
    target.set(0, y, 0);
    camera.position.set(0, y + 0.9, dist);
    camera.lookAt(target);

    if (!opts.reduced) group.rotation.y = time * 0.12;
    renderer.render(scene, camera);
  }

  function loop() {
    frame();
    raf = requestAnimationFrame(loop);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!running) frame();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Só anima enquanto a árvore está na tela.
  const io = new IntersectionObserver(([entry]) => {
    if (opts.reduced) return;
    if (entry.isIntersecting && !running) {
      running = true;
      loop();
    } else if (!entry.isIntersecting && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  });
  io.observe(canvas);
  frame();

  return {
    setProgress(p) {
      if (opts.reduced) return;
      progress = Math.min(1, Math.max(0, p));
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
