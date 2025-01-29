import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.136.0/examples/jsm/webxr/ARButton.js';

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
let currentMesh, nextMesh;

init();
animate();

function init() {
    scene = new THREE.Scene();
    
    // Dodamo svetlobo, da bodo slike vidne
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    
    document.body.appendChild(ARButton.createButton(renderer));
    
    startSlideshow();
}

function startSlideshow() {
    if (index >= images.length) return;
    
    console.log(`Loading image: ${images[index]}`);
    
    textureLoader.load(images[index], (texture) => {
        let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        let geometry = new THREE.PlaneGeometry(1, 1);
        nextMesh = new THREE.Mesh(geometry, material);
        nextMesh.position.set(0, 1, -1.5);
        scene.add(nextMesh);
        
        if (currentMesh) {
            let previousMesh = currentMesh;
            
            // Počasi povečamo sliko za 40%
            let scaleFactor = 1.4;
            let growthDuration = 2000; // 2 sekundi
            
            let growInterval = setInterval(() => {
                if (previousMesh.scale.x < scaleFactor) {
                    previousMesh.scale.x += 0.02;
                    previousMesh.scale.y += 0.02;
                } else {
                    clearInterval(growInterval);
                }
            }, growthDuration / 20);

            setTimeout(() => {
                scene.remove(previousMesh);
            }, 3000);
        }
        
        currentMesh = nextMesh;
        
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

