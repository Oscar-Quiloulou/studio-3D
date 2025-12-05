import * as THREE from 'three';
import { createEnv } from './env.js';
import { Player } from './player.js';
import { Controls } from './controls.js';
import { loadGLB } from './loadGLB.js';

const canvas = document.getElementById('app');
const fileInput = document.getElementById('fileInput');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e0e);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 2, 6);

createEnv(scene);

const player = new Player();
scene.add(player.group);

const controls = new Controls(canvas);

// Optional: preload a scene asset
try {
  const pre = await loadGLB('/assets/scene.glb');
  pre.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  scene.add(pre);
} catch (e) {
  console.warn('No preload scene.glb found or failed to load:', e?.message || e);
}

fileInput.addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const model = await loadGLB(file);
  model.position.set(0, 0, 0);
  model.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  scene.add(model);
});

// Drag-and-drop .glb into window
window.addEventListener('dragover', e => { e.preventDefault(); });
window.addEventListener('drop', async e => {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (!file || !file.name.endsWith('.glb')) return;
  const model = await loadGLB(file);
  model.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  scene.add(model);
});

// Camera follow
function updateCamera() {
  const target = new THREE.Vector3().copy(player.group.position);
  const yaw = player.group.rotation.y;
  const behind = new THREE.Vector3(Math.sin(yaw), 0.4, Math.cos(yaw)).multiplyScalar(4);
  const camPos = new THREE.Vector3().copy(target).add(behind);
  camera.position.lerp(camPos, 0.15);
  camera.lookAt(target);
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  player.update(dt, controls);
  updateCamera();
  renderer.render(scene, camera);
  controls.postUpdate();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
