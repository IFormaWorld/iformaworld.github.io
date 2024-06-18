import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

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
    const splineIframe = document.createElement('iframe');
    splineIframe.src = "https://my.spline.design/roomgirlworkingcopy-b376e1ae9ed5dee18782669017f21f04/";
    splineIframe.id = "spline-scene";
    splineIframe.allow = "fullscreen";
    splineIframe.style.background = "transparent";
    splineIframe.style.position = "absolute";

    // Create anchor
    const anchor = mindarThree.addAnchor(0);

    // Use CSS 3D Renderer for placing iframe
    const css3dRenderer = new CSS3DRenderer();
    css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    css3dRenderer.domElement.style.position = "absolute";
    css3dRenderer.domElement.style.top = "0";
    css3dRenderer.domElement.style.left = "0";
    document.body.appendChild(css3dRenderer.domElement);

    const css3dObject = new CSS3DObject(splineIframe);
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
