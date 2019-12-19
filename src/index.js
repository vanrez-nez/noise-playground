import "./styles.css";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneBufferGeometry,
  BoxBufferGeometry,
  Mesh,
  Color,
  MeshBasicMaterial
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import NoiseCellular2d from "./noise/NoiseCellular2d";
import NoiseCellular2x2 from './noise/NoiseCellular2x2';
import Controls from "./Controls";

class Demo {
  constructor() {
    this.noiseIndex = 0;
    this.initWorld();
    this.attachEvents();
    this.initNoise();
    this.updateSize();
    this.initMeshes();
    this.initControls();
    this.onFrame();
  }

  initWorld() {
    this.renderer = new WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);
    this.camera = new PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 3);
    document.body.appendChild(this.renderer.domElement);
  }

  selectMesh(obj) {
    const { scene } = this;
    scene.children.forEach(obj => (obj.visible = false));
    this.selectedMesh = obj;
    obj.visible = true;
  }

  initControls() {
    const { generators } = this;
    const controls = new Controls();
    generators.forEach(gen => controls.addNoisePanel(gen));
    controls.addNoiseSelect({
      onChange: (idx) => {
        this.noiseIndex = idx;
        this.updateSize();
      }
    });
    controls.selectNoisePanel(this.noiseIndex);
    this.controls = controls;
  }

  initMeshes() {
    const mat = new MeshBasicMaterial({});
    this.meshes = {
      plane: this.getPlaneMesh(mat),
      box: this.getBoxMesh(mat)
    };
    for (const name in this.meshes) {
      this.scene.add(this.meshes[name]);
    }
    this.selectMesh(this.meshes.plane);
  }

  getBoxMesh(mat) {
    const geo = new BoxBufferGeometry(1, 1, 1);
    const m = new Mesh(geo, mat);
    m.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    return m;
  }

  getPlaneMesh(mat) {
    const geo = new PlaneBufferGeometry(1, 1);
    return new Mesh(geo, mat);
  }

  attachEvents() {
    window.addEventListener("resize", this.updateSize.bind(this));
  }

  updateSize() {
    const { renderer, camera, selectedNoise } = this;
    const { innerWidth: w, innerHeight: h } = window;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    selectedNoise.setSize(512, 512);
  }

  initNoise() {
    this.generators = [
      //new NoiseCellular2d(),
      new NoiseCellular2x2()];
  }

  onFrame() {
    const { renderer, scene, camera, selectedMesh, selectedNoise } = this;
    requestAnimationFrame(this.onFrame.bind(this));
    camera.lookAt(scene.position);
    selectedNoise.render(renderer);
    selectedMesh.material.map = selectedNoise.target.texture;
    renderer.render(scene, camera);
  }

  get selectedNoise() {
    return this.generators[this.noiseIndex];
  }
}
window.demo = new Demo();
