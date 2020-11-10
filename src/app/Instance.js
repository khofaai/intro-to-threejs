import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Instance {
  
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.orbit = null;
    this.clock = null;
    this.mixer = null;
    this.actions = {};
		window.addEventListener('resize', () => this.onWindowResize());
  }

  init() {
    // set scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xC0C0C0);
    const grid = new THREE.GridHelper(50, 50, 0xffffff, 0x505050);
    this.scene.add(grid);

    //set camera 
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.x = 5;
    this.camera.position.y = 10;
    this.camera.position.z = 15;

    // lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x555555);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const directLight = new THREE.DirectionalLight(0xffffff, 3);
    directLight.position.set(0, 20, 10);
    this.scene.add(directLight);

    // set renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // controls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.addEventListener('change', () => this.render())
    this.orbit.update();


    // clock
    this.clock = new THREE.Clock();

    this.addCube();
    this.addGtlfObject();
    this.animate();

    setTimeout(() => {
      this.actions.Running.play();
      setTimeout(() => {
        this.actions.Running.stop();
        this.actions.Walking.fadeIn(0.2).play();
      }, 5000)
    }, 500)
  }

  animate() {
    
    const dt = this.clock.getDelta();
    if ( this.mixer ) this.mixer.update( dt );

    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  addGtlfObject() {
    const loader = new GLTFLoader();

    loader.load('static/gltf/RobotExpressive/RobotExpressive.glb',
      (gltf) => {

        const model = gltf.scene;
        const animations = gltf.animations;
        this.mixer = new THREE.AnimationMixer(model);
        animations.forEach(animation => this.actions[animation.name] = this.mixer.clipAction(animation));
        
        this.scene.add(model);
        this.addControlToCube(model)
      },
      (xhr) => {
        // calcul loading
      },
      (error) => {
        console.error({error});
      }
    )
  }

  addCube() {
    const cubeGeometry = new THREE.BoxBufferGeometry(3, 3, 3);
    const textureLoader = new THREE.TextureLoader();
    const cubeMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('static/crate.gif') });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const edgesMesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xff0000}));
    
    const group = new THREE.Group();
    group.add(cube).add(edgesMesh);
    group.position.set(0, 0, 10)
    this.scene.add(group);
    this.addControlToCube(group);
  }

  addControlToCube(cube) {
    const control = new TransformControls(this.camera, this.renderer.domElement);
    control.addEventListener('change', () => this.render());
    control.addEventListener('dragging-changed', (event) => {
      this.orbit.enabled = !event.value
    });
    control.attach(cube);
    this.scene.add(control);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Instance;