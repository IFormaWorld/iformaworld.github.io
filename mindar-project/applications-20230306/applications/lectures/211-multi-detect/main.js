import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/razlaga-racuna.mind'
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const dobavitelj = await loadGLTF('../../assets/models/razlaga-racuna-dobavitelj/dobavitelj.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    const smm = await loadGLTF('../../assets/models/razlaga-racuna-smm/smm.gltf');
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(dobavitelj.scene);

    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(smm.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
