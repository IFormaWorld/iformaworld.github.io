import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/vizitka/20240617-iforma/dubravka-bosnjak/assets/targets/vizitka.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    // Add light to the scene
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load GLTF model
    const gltfLoader = new GLTFLoader();
    const modelUrl = 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/vizitka/20240617-iforma/dubravka-bosnjak/assets/models/iforma-girl-working/iforma_girl_working.gltf';

    gltfLoader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.4, 0.4, 0.4); // Adjust scale as needed
      model.position.set(0, 0, 0); // Adjust position as needed

      // Rotate the model 90 degrees on the X axis
      model.rotateX(Math.PI / 2);

      // Create anchor and add model
      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(model);
    }, undefined, (error) => {
      console.error('Error loading model:', error);
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  start();
});
