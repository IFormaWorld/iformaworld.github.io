import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // Initialize MindAR
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: 'https://cdn.jsdelivr.net/gh/IFormaWorld/iformaworld.github.io/20240531-razlaga-racuna-ee/assets/targets/razlaga-racuna.mind',
    });

    const { renderer, scene, camera } = mindarThree;

    // Define the URLs for each target
    const splineUrls = [
      'https://my.spline.design/untitled-1c5ee70e28f264b5e98eb2316a564f38/', // dobavitelj
      // Add more URLs for the other targets as needed
    ];

    // Create an iframe for each Spline model
    const iframes = splineUrls.map((url, index) => {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.classList.add('iframe-container');
      iframe.style.zIndex = index + 1;
      document.body.appendChild(iframe);
      return iframe;
    });

    // Create anchors and toggle the corresponding iframe visibility
    splineUrls.forEach((url, index) => {
      const anchor = mindarThree.addAnchor(index);
      anchor.onTargetFound = () => {
        iframes.forEach((iframe, i) => {
          iframe.style.display = i === index ? 'block' : 'none';
        });
      };
      anchor.onTargetLost = () => {
        iframes[index].style.display = 'none';
      };
    });

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  start();
});
