import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/brosura/20240619-geometrijska-telesa/assets/targets/targets.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    // Add light to the scene
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Function to create 3D geometries
    const createGeometry = (type) => {
      let geometry;
      switch (type) {
        case 'sphere':
          geometry = new THREE.SphereGeometry(0.5, 32, 32);
          break;
        case 'cube':
          geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
          break;
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
          break;
        case 'rectangularPrism':
          geometry = new THREE.BoxGeometry(0.5, 0.3, 0.2);
          break;
        case 'pyramid':
          geometry = new THREE.ConeGeometry(0.3, 0.5, 4);
          break;
        default:
          geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      }
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      return new THREE.Mesh(geometry, material);
    };

    // Create anchors for each shape
    const shapes = ['sphere', 'cube', 'cylinder', 'rectangularPrism', 'pyramid'];
    shapes.forEach((shape, index) => {
      const anchor = mindarThree.addAnchor(index);
      const mesh = createGeometry(shape);
      anchor.group.add(mesh);
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
