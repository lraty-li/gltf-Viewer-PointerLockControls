import * as THREE from 'three';

import {
    PointerLockControls
} from 'https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/controls/PointerLockControls.js';
import {
    GLTFLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/loaders/GLTFLoader.js';
let camera, scene, renderer, controls;

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;


let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

var locationSet = {};
var locationSetKeys = [];


let searchBar = document.getElementById('searchBar');
let searchResults = document.getElementById('searchResults');
let eventSource;


//searching location
function keyDownUp() {
    var input = searchBar.value.toUpperCase();
    console.log(input)
    var resutlLiSet = [];
    if (input.length == 0) return
    var resultKeySet = [];
    for (let index = 0; index < locationSetKeys.length; index++) {
        if (locationSetKeys[index].indexOf(input) > -1) {
            resultKeySet.push(locationSetKeys[index])
        }
    }

    searchResults.innerHTML = '';

    for (let index = 0; index < resultKeySet.length; index++) {
        let newResult = document.createElement('option');
        newResult.innerText = resultKeySet[index];
        searchResults.appendChild(newResult)
    }
    console.log(resultKeySet)
}

searchBar.addEventListener('keydown', (e) => {
    eventSource = e.key ? 'input' : 'list';
});
searchBar.addEventListener('input', (e) => {
    var value = e.target.value;
    keyDownUp();
    if (eventSource === 'list') {
        camera.position.set(locationSet[value].x, locationSet[value].y, locationSet[value].z)
    }
});

//file upload
let upLoader = document.getElementById('fileUpload');

function loadScene() {
    const files = upLoader.files;
    if (files.length == 0) {
        alert("no file selected");
        return
    }
    console.log(files[0]);
    var objectURL = window.URL.createObjectURL(files[0]);
    init(objectURL)
    animate()
    upLoader.style.display="none"

}
upLoader.addEventListener('change', loadScene)


// init();
// animate();

function init(gtlfUrl) {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xA5C8E3);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();
    camera.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    camera.add(ambientLight);

    // scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 0, 0.866);
    scene.add(light);

    const loader = new GLTFLoader();

    loader.load(gtlfUrl, function (gltf) {

        locationSet = {}
        locationSetKeys = [];
        for (let index = 0; index < gltf.scene.children.length; index++) {
            var mesh = gltf.scene.children[index];
            locationSet[mesh['name']] = mesh['position']

        }
        locationSetKeys = Object.keys(locationSet);

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        camera.position.set(-870, 4023, 1285);
        controls.maxDistance = size * 10;

        camera.near = size / 100;
        camera.far = size * 100;

        scene.add(gltf.scene);

    }, undefined, function (error) {

        console.error(error);

    });

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {

        controls.lock();

    });

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    });

    scene.add(controls.getObject());

    const onKeyDown = function (event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'KeyX':
                moveDown = true;
                break;

            case 'KeyF':
                moveUp = true;
                break;

        }

    };

    const onKeyUp = function (event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
            case 'KeyX':
                moveDown = false;
                break;

            case 'KeyF':
                moveUp = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);


    //

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    const time = performance.now();

    if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects(objects, false);

        const onObject = intersections.length > 0;

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;
        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.y = Number(moveDown) - Number(moveUp);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        if (moveUp || moveDown) velocity.y -= direction.y * 400.0 * delta;
        if (onObject === true) {

            velocity.y = Math.max(0, velocity.y);
            canJump = true;

        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < 10) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

    }

    prevTime = time;

    renderer.render(scene, camera);

}