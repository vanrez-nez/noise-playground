import "./styles.css";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneBufferGeometry,
  BoxBufferGeometry,
  Mesh,
  Color,
  MeshBasicMaterial,
  SphereBufferGeometry
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import NoiseCellular from "./noise/NoiseCellular";
import Controls from "./Controls";

class Demo {
  constructor() {
    this.noiseIndex = 0;
    this.modelIndex = 1;
    this.initWorld();
    this.attachEvents();
    this.initNoise();
    this.updateSize();
    this.models = this.createModels();
    this.controls = this.createControls();
    this.onFrame();
  }

  initWorld() {
    this.renderer = new WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.scene = new Scene();
    this.scene.background = new Color(0x0);
    this.camera = new PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 3);
    document.body.appendChild(this.renderer.domElement);
  }

  selectModel(idx) {
    const { models } = this;
    models.forEach(m => (m.mesh.visible = false));
    models[idx].mesh.visible = true;
  }

  createControls() {
    const { generators, models, scene } = this;
    const ctrl = new Controls();
    generators.forEach(gen => ctrl.addNoisePanel(gen));

    // Noise Select
    ctrl.addSelect(ctrl.mainPanel, {
      label: 'Type',
      options: generators.map(g => g.title)
    }, (idx) => {
      ctrl.selectNoisePanel(idx);
      this.noiseIndex = idx;
      this.updateSize();
    });
    ctrl.selectNoisePanel(this.noiseIndex);

    // Model Select
    ctrl.addSelect(ctrl.mainPanel, {
      label: 'Model',
      selected: 1,
      options: models.map(m => m.name),
    }, (idx) => {
      this.modelIndex = idx;
      this.selectModel(idx);
    });
    this.selectModel(this.modelIndex);

    // Background Color
    ctrl.addColor(ctrl.mainPanel, {
      label: 'Background',
      colorMode: 'rgbfv',
    }, (color) => {
      scene.background.fromArray(color);
    });
  }

  createModels() {
    const { scene } = this;
    const mat = new MeshBasicMaterial({});
    const models = [
      { name: 'Plane', mesh: this.getPlaneMesh(mat) },
      { name: 'Box', mesh: this.getBoxMesh(mat) },
      { name: 'Sphere', mesh: this.getSphereMesh(mat) },
    ]
    models.forEach(m => scene.add(m.mesh));
    return models;
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

  getSphereMesh(mat) {
    const geo = new SphereBufferGeometry(1, 50, 50);
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
      new NoiseCellular({ type: '2d', title: "Cellular 2D" }),
      new NoiseCellular({ type: '2x2', title: "Cellular 2x2" }),
      new NoiseCellular({ type: '2x2x2', title: "Cellular 2x2x2" }),
    ];
  }

  onFrame() {
    const { renderer, scene, camera, selectedModel, selectedNoise } = this;
    requestAnimationFrame(this.onFrame.bind(this));
    camera.lookAt(scene.position);
    selectedNoise.update();
    selectedModel.mesh.material = selectedNoise.material;
    renderer.render(scene, camera);
  }

  get selectedNoise() {
    return this.generators[this.noiseIndex];
  }

  get selectedModel() {
    return this.models[this.modelIndex];
  }
}
window.demo = new Demo();
