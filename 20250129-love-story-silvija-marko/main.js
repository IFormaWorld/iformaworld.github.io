import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
      imageTargetSrc: 'assets/targets/targets.mind',  // Updated to your .mind file
    });
    const { renderer, scene, camera } = mindarThree;

    // Add light to the scene
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load models (images for bride, groom, and couple)
    const textureLoader = new THREE.TextureLoader();
    const modelUrls = [
      'assets/models/bride/silvija1bg.png',
      'assets/models/groom/marko1bg.png',
      'assets/models/couple/zajedno1bg.png',
    ];

    // Function to load model
    const loadModel = (url) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(url, (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
          const geometry = new THREE.PlaneGeometry(1, 1);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(0.5, 0.5, 0.5);  // Scale the models
          resolve(mesh);
        }, undefined, reject);
      });
    };

    try {
      const models = await Promise.all(modelUrls.map(loadModel));

      // Create anchors for each model
      models.forEach((model, index) => {
        const anchor = mindarThree.addAnchor(index);
        anchor.group.add(model);
      });

      await mindarThree.start();

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

    } catch (error) {
      console.error('Error loading models:', error);
    }
  };
});
