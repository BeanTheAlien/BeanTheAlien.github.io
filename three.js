import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubes = [];
for(let i = 0; i < 5; i++) cubes.push(new THREE.Mesh(geometry, material));
// const cube = new THREE.Mesh(geometry, material);
// const cube2 = new THREE.Mesh(geometry, material);
// const cube3 = new THREE.Mesh(geometry, material);
// scene.add(cube);
// scene.add(cube2);
// scene.add(cube3);
cubes.forEach(c => scene.add(c));

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.03;
    // cube.rotation.y += 0.03;
    // cube2.rotation.x -= 0.07;
    // cube2.rotation.y -= 0.07;
    // cube3.rotation.x += 0.04;
    // cube3.rotation.y += 0.04;
    cubes.forEach(c => {
        c.rotation.x += random(-0.05, 0.05);
        c.rotation.y += random(-0.05, 0.05);
    });
    renderer.render(scene, camera);
}

animate();
