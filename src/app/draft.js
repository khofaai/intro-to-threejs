import * as THREE from 'three';

class Viewer {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xC0C0C0 );
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.x = 2;
    this.camera.position.y = 2;
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.animate();
    this.createBox();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  createBox() {
    const boxGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const boxMatrial = new THREE.MeshBasicMaterial({color: 0xff0000});
    const box = new THREE.Mesh(boxGeometry, boxMatrial);

    this.scene.add(box);
  }
}

(new Viewer).init();