import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

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

    // Load 3D model from Spline
    const splineIframe = document.getElementById('spline-scene');

    // Create anchor
    const anchor = mindarThree.addAnchor(0);

    // Use CSS 3D Renderer for placing iframe
    const css3dRenderer = new THREE.CSS3DRenderer();
    css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(css3dRenderer.domElement);

    const css3dObject = new THREE.CSS3DObject(splineIframe);
    css3dObject.position.set(0, 0, 0);
    css3dObject.scale.set(0.005, 0.005, 0.005); // Adjust scale as needed
    anchor.group.add(css3dObject);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      css3dRenderer.render(scene, camera);
    });
  };

  start();
});
