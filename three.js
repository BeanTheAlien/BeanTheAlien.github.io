import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js"; 
import { computeBoundsTree, disposeBoundsTree, computeBatchedBoundsTree, disposeBatchedBoundsTree, acceleratedRaycast } from "https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.9.1/+esm";
// import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/PointerLockControls.js";

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
// Flashlight setup: Increased intensity, enable shadows
const flashlight = new THREE.SpotLight(0xffffff, 10, 40, Math.PI / 6, 0.5, 2);
flashlight.castShadow = true;
flashlight.shadow.mapSize.width = 1024;
flashlight.shadow.mapSize.height = 1024;
flashlight.shadow.camera.near = 0.1;
flashlight.shadow.camera.far = 40; 
//const controls = new PointerLockControls(camera, document.body);
//scene.add(controls.getObject());

// Renderer setup: Enable shadow maps
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.shadowMap.enabled = true; // IMPORTANT: Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
document.addEventListener("click", () => renderer.domElement.requestPointerLock());

const geo = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geo, material);
// Make player cube cast and receive shadows
cube.castShadow = true;
cube.receiveShadow = true;
geo.computeBoundsTree();
scene.add(cube);
//camera.add(flashlight);
//flashlight.position.set(0, 0, 1); // Adjust as needed for desired flashlight placement
//flashlight.target = camera;
/*
    flashlight.castShadow = true;
    flashlight.shadow.mapSize.width = 1024;
    flashlight.shadow.mapSize.height = 1024;
    // ... other shadow settings
*/
// 1. Attach flashlight to the camera
camera.add(flashlight); 
// 2. Position it slightly in front of the camera
flashlight.position.set(0, 0, -1); 
// The flashlight will now point wherever the camera points.

// Add a ground plane to receive shadows
const planeGeo = new THREE.PlaneGeometry(50, 50);
const planeMat = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2; // Rotate to lie flat
plane.position.y = -0.5; // Below the cube
plane.receiveShadow = true;
scene.add(plane);

//TODO:
//make flashlight float in front of player
//add shadow settings

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

// REMOVE FollowMe function for first-person view.
// If you implement a full first-person controller (e.g., using PointerLockControls),
// the camera orientation will be handled there.

function animate() {
    requestAnimationFrame(animate);
    PlayerMove();
    
    // Update camera position to follow the cube's position (first-person)
    camera.position.copy(cube.position);
    camera.position.y += 0.5; // Adjust camera height
    camera.position.z -= 

    //controls.update();
    renderer.render(scene, camera);
}

animate();
// SEE https://discourse.threejs.org/t/first-person-shooter-game/26986