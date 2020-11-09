import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import Cube from './Cube';
// import GltfFileLoader from './GltfFileLoader';

class Viewer {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.orbit = null;
    this.objects = {};
		window.addEventListener('resize', () => this.onWindowResize())
  }

  addScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xC0C0C0 );
    const grid = new THREE.GridHelper( 50, 50, 0xffffff, 0x555555 );
    this.scene.add( grid );
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  }

  addTextureCube(name = null) {
    const cubeWithTexture = Cube.create({
      size: [3, 3, 3], 
      texture: 'static/crate.gif', 
      edgeColor: 0xff0000,
    });
    this.scene.add(cubeWithTexture)
    cubeWithTexture.position.set(5, 0, 0);
    if(name) this.objects[name] = cubeWithTexture;
  }

  addCube(name = null) {
    const cube = Cube.create({
      size: [5, 5, 5], 
      color: 0x00ff00, 
      edgeColor: 0xff0000,
    });
    this.scene.add( cube );
    if(name) this.objects[name] = cube;
  }

  addLight() {
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    this.scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 20, 10 );
    this.scene.add( dirLight );

    // this.light = new THREE.DirectionalLight( 0xffffff );
    // this.light.position.set( 50, 50, 50 );
    // this.scene.add( this.light );

    // this.light = new THREE.DirectionalLight( 0x002288 );
    // this.light.position.set( -50, -50, -50 );
    // this.scene.add( this.light );

    // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 ); 
    // this.scene.add( hemiLight );
  
  }

  addControlToObjectByName(name) {
    const control = new TransformControls( this.camera, this.renderer.domElement );
    control.addEventListener( 'change', () => this.render() );

    control.addEventListener( 'dragging-changed', function ( event ) {
    	this.orbit.enabled = !event.value;
    });
    
    control.attach( this.objects[name] );
    this.scene.add( control );
  }

  addControls() {
    this.orbit = new OrbitControls( this.camera, this.renderer.domElement );
    this.orbit.addEventListener( 'change', () => this.render() );
    this.orbit.update();
  }

  init() {
    this.addScene();
    this.addCamera();
    this.addCube('firstCube');
    this.addTextureCube('firstTextureCube');
    // this.loadGltfFile();
    // this.addText(); later
    this.addLight();
    this.clock = new THREE.Clock();
    this.camera.position.x = 15;
    this.camera.position.y = 15;
    this.camera.position.z = 30;
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true/* , canvas: document.getElementById('scene') */});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    this.animate();
    this.addControls();
    this.addControlToObjectByName('firstCube');
    this.addControlToObjectByName('firstTextureCube');
  }

  animate() {
    const dt = this.clock.getDelta();

    if ( this.mixer ) this.mixer.update( dt );
    requestAnimationFrame(() => this.animate());

    // this.group.rotation.x += 0.01;
    // this.group.rotation.y += 0.01;

    // this.cube2.rotation.x += 0.1;
    // this.cube2.rotation.y += 0.1;
    // this.cube2.rotation.z += 0.1;

    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

export default Viewer;