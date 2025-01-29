import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';
import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mindar-image-three/dist/mindar-image-three.js';

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
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Začnemo z AR izkušnjo
    startAR();
}

function startAR() {
    // Inicializacija MindAR za AR izkušnjo
    const mindarThree = new MindARThree({
        container: document.body, // AR bo prikazan na celotni strani
        imageTargetSrc: 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/20250129-love-story-silvija-marko/assets/targets/razlaga-racuna.mind', // URL AR cilja
    });

    const { renderer: arRenderer, scene: arScene, camera: arCamera } = mindarThree;

    scene.add(arScene); // Dodajemo AR sceno v glavno sceno
    camera = arCamera; // Nastavimo AR kamero
    
    // Začnemo z MindAR
    mindarThree.start();

    // Zagon AR slajdov
    startSlideshow(arScene);
}

function startSlideshow(arScene) {
    if (index >= images.length) return;
    
    let material = new THREE.MeshBasicMaterial({ map: textureLoader.load(images[index]) });
    let geometry = new THREE.PlaneGeometry(1, 1);
    nextMesh = new THREE.Mesh(geometry, material);
    nextMesh.position.set(0, 1, -1.5);
    arScene.add(nextMesh);

    if (currentMesh) {
        let scaleFactor = 1.4;
        let growAnimation = { scale: scaleFactor };
        let shrinkAnimation = { scale: 1 };
        
        setTimeout(() => {
            arScene.remove(currentMesh);
            currentMesh = nextMesh;
            setTimeout(() => {
                arScene.remove(currentMesh);
                index++;
                startSlideshow(arScene);
            }, 3000);
        }, 2000);
    } else {
        currentMesh = nextMesh;
        setTimeout(() => {
            arScene.remove(currentMesh);
            index++;
            startSlideshow(arScene);
        }, 3000);
    }
}

function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
