import * as THREE from "three";
import { Boid } from "./Boid.ts";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  85,
  135,
);
camera.position.z = 110;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light1 = new THREE.AmbientLight(0xffffff, 1);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 5);
light2.position.set(1, 1, 1);
scene.add(light2);

let boids: Boid[] = [];
for (let i = 0; i < 30; i += 1) {
  boids.push(new Boid(scene, boids))
  console.log(boids[i])
}

function animate(time: number, prev: number) {
  boids.forEach((x) => x.update((time - prev) / 1000));
  renderer.render(scene, camera);
  requestAnimationFrame((t) => animate(t, time));
}
requestAnimationFrame((t) => animate(t, 0));
