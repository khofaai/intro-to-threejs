import { GLTFLoader}  from 'three/examples/jsm/loaders/GLTFLoader.js';

class GltfFileLoader {
  load(path, loadingFn = function() {}) {
    const loader = new GLTFLoader();
    return (new Promise((resolve, reject) => {
      loader.load(
        path,
        resolve,
        loadingFn,
        reject
      )
    }));
  }
}

export default GltfFileLoader;