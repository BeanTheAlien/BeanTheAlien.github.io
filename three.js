import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js"; 
import { computeBoundsTree, disposeBoundsTree, computeBatchedBoundsTree, disposeBatchedBoundsTree, acceleratedRaycast } from "https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.9.1/+esm";

// add extension functions
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;
/*
import * as THREE from 'three';
import {
	computeBoundsTree, disposeBoundsTree,
	computeBatchedBoundsTree, disposeBatchedBoundsTree, acceleratedRaycast,
} from 'three-mesh-bvh';

// Add the extension functions
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;

// Generate geometry and associated BVH
const geom = new THREE.TorusKnotGeometry( 10, 3, 400, 100 );
const mesh = new THREE.Mesh( geom, material );
geom.computeBoundsTree();

// Or generate BatchedMesh and associated BVHs
const batchedMesh = new THREE.BatchedMesh( ... );
const geomId = batchedMesh.addGeometry( geom );
const instId = batchedMesh.addGeometry( geom );

// Generate bounds tree for sub geometry
batchedMesh.computeBoundsTree( geomId );

// Setting "firstHitOnly" to true means the Mesh.raycast function will use the
// bvh "raycastFirst" function to return a result more quickly.
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;
raycaster.intersectObjects( [ mesh ] );
*/

var keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);
window.addEventListener("keydown", (e) => {
    if(e.key == " " && !isJumping) isJumping = true;
});

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
document.addEventListener("click", () => renderer.domElement.requestPointerLock());

const geo = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geo, material);
geo.computeBoundsTree();
scene.add(cube);

var isJumping = false;
var jumpHeight = 0.9;
var jumpSpd = 0.1;
var jumpDir = 1;
const startY = cube.position.y;

function PlayerMove() {
    const spd = 0.05;
    const dir = new THREE.Vector3();
    const axisR = new THREE.Vector3(1, 0, 0); // Local X-axis (right)
    if(keys["w"] || keys["ArrowUp"]) {
        cube.getWorldDirection(dir);
        cube.position.add(dir.multiplyScalar(-spd));
    }
    if(keys["a"] || keys["ArrowLeft"]) {
        cube.translateOnAxis(axisR, -spd);
    }
    if(keys["d"] || keys["ArrowRight"]) {
        cube.translateOnAxis(axisR, spd);
    }
    if(keys["s"] || keys["ArrowDown"]) {
        cube.getWorldDirection(dir);
        cube.position.addScaledVector(dir, spd);
    }
    if(isJumping) {
        cube.position.y += jumpSpd * jumpDir;
        if(jumpDir == 1 && cube.position.y >= startY + jumpHeight) {
            jumpDir = -1; // Start falling
        } else if(jumpDir == -1 && cube.position.y <= startY) {
            cube.position.y = startY; // Reset to ground
            isJumping = false;
            jumpDir = 1; // Reset for next jump
        }
    }
}

function FollowMe() {
    const targetPos = cube.position.clone();
    const alpha = 0.1; // Speed of the follow
    camera.position.lerp(targetPos, alpha);
    camera.lookAt(cube.position); // Keep the camera looking at the mesh
}

function animate() {
    requestAnimationFrame(animate);
    PlayerMove();
    FollowMe();
    renderer.render(scene, camera);
}

animate();

// SEE https://discourse.threejs.org/t/first-person-shooter-game/26986