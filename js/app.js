import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
// import GUI from 'lil-gui'; 
// import gsap from "gsap";

import t0 from '../image1.jpg'
import t1 from '../image2.jpg'
import t2 from '../image3.jpg'
import maskUrl from '../mask.jpg'

// const createInputEvents = require('simple-input-events');
// import createInputEvents from 'simple-input-events';

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1); 
    this.renderer.useLegacyLights = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      60,
      this.width / this.height,
      1,
      3000
    );

    // this.event = createInputEvents(this.renderer.domElement)
        
    this.camera.position.set(0, 0, 900);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    // this.mouse = new THREE.Vector2()
    // this.mouseTarget = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    this.isPlaying = true;
    
    this.addObjects();
    

    // this.setUpSettings();
    this.resize();
    this.render();
    this.setupResize();

    this.mouseEvent()
  }

  addObjects() {
    // this.material = new THREE.ShaderMaterial({
    //   extensions: {
    //     derivatives: "#extension GL_OES_standard_derivatives : enable"
    //   },
    //   side: THREE.DoubleSide,
    //   uniforms: {
    //     time: { value: 0 },
    //     resolution: { value: new THREE.Vector4() },
    //   },
    //   // wireframe: true,
    //   // transparent: true,
    //   vertexShader: vertex,
    //   fragmentShader: fragment
    // })

    this.textures = [t0, t1, t2]
    this.maskTexture = new THREE.TextureLoader().load(maskUrl)
    this.textures = this.textures.map(t => new THREE.TextureLoader().load(t))
    // this.material = new THREE.MeshBasicMaterial({
    //   map: this.textures[1]
    // })
    this.geometry = new THREE.PlaneGeometry(1920, 1880, 1, 1);
    this.group = new THREE.Group()
    this.scene.add(this.group)
    for (let i = 0; i < 3; i++) {
      let m = new THREE.MeshBasicMaterial({
        map: this.textures[2]
      })

      if(i > 0) {
        m = new THREE.MeshBasicMaterial({
          map: this.textures[2],
          alphaMap: this.maskTexture,
          transparent: true
        })
  
      }

      let mesh = new THREE.Mesh(
        this.geometry, m
      )

      mesh.position.z = (i+1)*100

      this.group.add(mesh)
    }
    // this.geometry = new THREE.PlaneGeometry(1920, 1880, 1, 1);

    // this.plane = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.plane);
  } 

  // events() {
  //   this.event.on('move', ({ uv }) => {
  //     this.mouse.x = uv(0)
  //     this.mouse.y = uv(t)
  //     console.log(this.mouse)
  //   });
  // }

  mouseEvent() {
    let that = this;
    this.mouse = new THREE.Vector2()
    this.mouseTarget = new THREE.Vector2()

    console.log(this.mouse)

    function onMouseMove( event ) {

	    // calculate mouse position in normalized device coordinates
	    // (-1 to +1) for both components

	    that.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      that.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      
      that.raycaster.setFromCamera( that.mouse, that.camera );

	    // calculate objects intersecting the picking ray
      // const intersects = that.raycaster.intersectObjects( that.scene.children );
      const intersects = that.raycaster.intersectObjects( that.scene.children );
      
      if(intersects.length > 0 && intersects[ 0 ].uv) {
        // that.material.uniforms.mouse.value = intersects[0].point;
        // this.mouse.x = uv(0)
        // this.mouse.y = uv(t)
        const uv = intersects[ 0 ].uv;
        that.mouse.x = uv.x(0)
        that.mouse.y = uv.y(t)
        console.log(that.mouse)
      }
      console.log(intersects);
	    // for ( let i = 0; i < intersects.length; i ++ ) {
		  //   intersects[ i ].object.material.color.set( 0xff0000 );
	    // }
    }

    window.addEventListener( 'mousemove', onMouseMove, false );
  }

  // setUpSettings() {
  //   this.settings = {
  //     progress: 0,
  //   };
  //   this.gui = new GUI();
  //   this.gui.add(this.settings, "progress", 0, 1, 0.01).onChange((val)=>{})
  // }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  // addLights() {
  //   const light1 = new THREE.AmbientLight(0xffffff, 0.5);
  //   this.scene.add(light1);

  //   const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  //   light2.position.set(0.5, 0, 0.866); // ~60º
  //   this.scene.add(light2);
  // }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying){
      this.isPlaying = true;
      this.render()
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    // this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container")
});