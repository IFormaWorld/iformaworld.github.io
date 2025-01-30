import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  // Function to hide landing page and start AR
  const startAR = () => {
    document.getElementById('landing-page').style.display = 'none';
    startMindAR();
  };

  // Event listener for the button
  document.getElementById('enter-ar-button').addEventListener('click', startAR);

  const startMindAR = async () => {
    // Initialize MindAR
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: 'assets/targets/targets.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    // Add light to the scene
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load image models (bride & groom)
    const textureLoader = new THREE.TextureLoader();
    const modelUrls = [
      'assets/models/bride/silvija1bg.png',
      'assets/models/groom/marko1bg.png',
    ];

    // Function to load image model
    const loadImageModel = (url) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(url, (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
          const geometry = new THREE.PlaneGeometry(1, 1);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(0.5, 0.5, 0.5);  // Adjust scale
          resolve(mesh);
        }, undefined, reject);
      });
    };

    try {
      const models = await Promise.all(modelUrls.map(loadImageModel));

      // Create anchors for bride and groom
      models.forEach((model, index) => {
        const anchor = mindarThree.addAnchor(index);
        anchor.group.add(model);
      });

      // Load video for couple target
      const video = document.createElement('video');
      video.src = 'assets/models/couple/theirstory.mp4';
      video.loop = false;  // Remove looping
      video.muted = false;
      video.playsInline = true;
      video.autoplay = fal
