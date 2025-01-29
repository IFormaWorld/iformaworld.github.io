import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;
let basePath = 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/20250129-love-story-silvija-marko/assets/models/';
let images = [
    'silvija1.jpg', 'silvija1bg.png', 'silvija2.jpg', 'silvija2bg.png', 'silvija3.jpg',
    'silvija3bg.png', 'silvija4.jpeg', 'silvija4bg.png', 'silvija5.jpeg', 'silvija5bg.png',
    'marko1.jpg', 'marko1bg.png', 'marko2.jpg', 'marko2bg.png', 'marko3.jpg',
    'marko3bg.png', 'marko4.jpg', 'marko4bg.png', 'marko5.jpg', 'marko5bg.png',
    'zajedno1.jpg', 'zajedno1bg.png', 'zajedno2.jpg', 'zajedno2bg.png', 'zajedno3.jpg', 'zajedno3bg.png'
].map(img => basePath + img);

let index = 0;
let textureLoader = new THREE.TextureLoader();
let currentMesh = null;

init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    
    let arButton = ARButton.createButton(renderer);
    document.body.appendChild(arButton);
    
    arButton.addEventListener('click', () => {
        console.log("AR session started");
        startSlideshow();
    });

    animate();
}

function startSlideshow() {
    if (index >= images.length) return;

    console.log(`Loading image: ${images[index]}`);

    textureLoader.load(images[index], (texture) => {
        let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        let geometry = new THREE.PlaneGeometry(1, 1);
        let newMesh = new THREE.Mesh(geometry, material);
        newMesh.position.set(0, 1, -1.5);
        scene.add(newMesh);

        if (currentMesh) {
            let previousMesh = currentMesh;
            setTimeout(() => {
                scene.remove(previousMesh);
            }, 3000);
        }

        currentMesh = newMesh;
        setTimeout(() => {
            index++;
            startSlideshow();
        }, 3000);
    }, undefined, (err) => {
        console.error(`Error loading image: ${images[index]}`, err);
        index++;
        startSlideshow();
    });
}

function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
