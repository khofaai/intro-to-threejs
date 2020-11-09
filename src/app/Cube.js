import * as THREE from 'three';

class Cube {
  create({size, color = null, texture = null, edgeColor = null}) {
    const geometry = new THREE.BoxBufferGeometry(...size);
    const material = this.addMaterial({color, texture});
    const cube = new THREE.Mesh( geometry, material );

    if(edgeColor) {
      return this.addEdges({ cube, geometry, edgeColor });
    }

    return cube;
  }

  addEdges({cube, geometry, edgeColor}) {
    const edges = new THREE.EdgesGeometry(geometry)
    const mesh2 = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: edgeColor}))
    const group = new THREE.Group();
    group.add(cube);
    group.add(mesh2);
    return group;
  }

  addMaterial({color = 0xff0000, texture}) {
    if(texture) {
      const loader = new THREE.TextureLoader();
      return new THREE.MeshBasicMaterial({ map: loader.load(texture) });
    }
    return new THREE.MeshBasicMaterial({ color });
  }
}

export default new Cube();