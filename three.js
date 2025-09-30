import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

function random(a = null, b = null) {
    if(a == null && b == null) {
        return Math.floor(Math.random() * 101);
    } else if(a != null && b == null) {
        return Math.floor(Math.random() * a);
    } else if(a != null && b != null) {
        let min;
        let max;
        if(a > b) {
            min = Math.ceil(b);
            max = Math.floor(a);
            return Math.floor(Math.random() * (max - min)) + min;
        } else if(a < b) {
            min = Math.ceil(a);
            max = Math.floor(b);
            return Math.floor(Math.random() * (max - min)) + min;
        } else {
            return Math.floor(Math.random() * a);
        }
    }
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
