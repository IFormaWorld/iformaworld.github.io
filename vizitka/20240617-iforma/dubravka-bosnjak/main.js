
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // Initialize MindAR
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/vizitka/20240617-iforma/dubravka-bosnjak/assets/targets/vizitka.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    // Add light to the scene
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const gltfLoader = new GLTFLoader();

    // Load models
    const modelUrls = [
      'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/vizitka/20240617-iforma/dubravka-bosnjak/assets/vizitka/vizitka.gltf',
      'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/vizitka/20240617-iforma/dubravka-bosnjak/assets/models/cloud/device_cloud.gltf',
    ];

  // Function to load model
    const loadModel = (url) => {
      return new Promise((resolve, reject) => {
        gltfLoader.load(url, (gltf) => {
          gltf.scene.scale.set(1, 1, 1);
          gltf.scene.position.set(0, -0.4, 0);
          resolve(gltf);
        }, undefined, reject);
      });
    };

    try {
      const models = await Promise.all(modelUrls.map(loadModel));

      // Create anchors for each model
      models.forEach((model, index) => {
        const anchor = mindarThree.addAnchor(index);
        anchor.group.add(model.scene);
      });

      await mindarThree.start();

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  start();
});
