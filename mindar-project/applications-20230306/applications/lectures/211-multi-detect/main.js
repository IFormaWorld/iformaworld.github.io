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
    dobavitelj.dobavitelj.scale.set(0.1, 0.1, 0.1);
    dobavitelj.dobavitelj.position.set(0, -0.4, 0);

    const smm = await loadGLTF('../../assets/models/razlaga-racuna-smm/smm.gltf');
    smm.smm.scale.set(0.1, 0.1, 0.1);
    smm.smm.position.set(0, -0.4, 0);

    const dobaviteljAnchor = mindarThree.addAnchor(0);
    dobaviteljAnchor.group.add(dobavitelj.dobavitelj);

    const smmAnchor = mindarThree.addAnchor(1);
    smmAnchor.group.add(smm.smm);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
