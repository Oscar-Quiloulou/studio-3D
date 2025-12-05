import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export async function loadGLB(urlOrFile) {
  return new Promise((resolve, reject) => {
    const url = typeof urlOrFile === 'string'
      ? urlOrFile
      : URL.createObjectURL(urlOrFile);

    loader.load(
      url,
      gltf => {
        const root = gltf.scene || gltf.scenes?.[0];
        resolve(root);
      },
      undefined,
      err => reject(err)
    );
  });
}
