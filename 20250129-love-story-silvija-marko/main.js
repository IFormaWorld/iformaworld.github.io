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
      imageTargetSrc: 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/20250129-love-story-silvija-marko/assets/targets/targets.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    // Add light to the scene
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load image models (bride & groom)
    const textureLoader = new THREE.TextureLoader();
    const modelUrls = [
      'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/20250129-love-story-silvija-marko/assets/models/bride/silvija1bg.png',
      'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/20250129-love-story-silvija-marko/assets/models/groom/marko1bg.png'
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
      video.src = 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/20250129-love-story-silvija-marko/assets/models/couple/theirstory.mp4';
      video.loop = false;  // Remove looping
      video.muted = false;
      video.playsInline = true;
      video.autoplay = false;
      video.style.display = 'none'; // Hide HTML video element
      document.body.appendChild(video);

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.generateMipmaps = false;

      const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
      const videoGeometry = new THREE.PlaneGeometry(1, 1);
      const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

      // Create anchor for couple video
      const videoAnchor = mindarThree.addAnchor(2);
      videoAnchor.group.add(videoMesh);

      // Adjust video aspect ratio dynamically
      video.addEventListener('loadedmetadata', () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        videoMesh.scale.set(aspectRatio, 1, 1);
      });

      // Play video when target is detected
      videoAnchor.onTargetFound = () => {
        video.play();
        videoMesh.visible = true;
      };

      videoAnchor.onTargetLost = () => {
        video.pause();
      };

      // Stop video & hide model when it ends
      video.addEventListener('ended', () => {
        console.log('Video končan, odstranjujem AR model.');
        videoMesh.visible = false;  // Hide the video mesh
      });

      await mindarThree.start();

      // === SMOOTHING AR OBJECT MOVEMENT ===
      const smoothFactor = 0.2;  // Between 0 and 1 (lower = more smoothing)

      const smoothTransform = (mesh, targetGroup) => {
        mesh.position.lerp(targetGroup.position, smoothFactor);
        mesh.quaternion.slerp(targetGroup.quaternion, smoothFactor);
      };

      renderer.setAnimationLoop(() => {
        models.forEach((model, index) => {
          const anchor = mindarThree.anchors[index];
          if (anchor.group.visible) {
            smoothTransform(model, anchor.group);
          }
        });

        if (videoAnchor.group.visible) {
          smoothTransform(videoMesh, videoAnchor.group);
        }

        renderer.render(scene, camera);
      });

    } catch (error) {
      console.error('Error loading models:', error);
    }
  };
});
