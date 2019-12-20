import "./styles.css";
import {
  Group,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Controls from "./Controls";
import Models from "./Models";
import Generators from "./Generators";

class Demo {
  constructor() {
    this.navigationMode = 0;
    this.initWorld();
    this.attachEvents();
    this.updateSize();
    this.generators = new Generators();
    this.models = new Models(this.modelsGroup, this.helpersGroup);
    this.orbitControls = this.createOrbitControls();
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
    this.helpersGroup = new Group();
    this.modelsGroup = new Group();
    this.scene.add(this.helpersGroup, this.modelsGroup);
    document.body.appendChild(this.renderer.domElement);
  }

  createOrbitControls() {
    const { camera, renderer } = this;
    const oc = new OrbitControls(camera, renderer.domElement);
    oc.autoRotate = true;
    oc.enableDamping = true;
    oc.enablePan = false;
    oc.maxDistance = 10;
    oc.minDistance = 1;
    return oc;
  }

  selectNavigationMode(idx) {
    const { orbitControls: oc } = this;
    oc.autoRotate = idx === 1;
    oc.enabled = idx < 2;
    this.navigationMode = idx;
    oc.reset();
  }

  createControls() {
    const { generators, models, scene } = this;
    const ctrl = new Controls();
    const { mainPanel: parent } = ctrl;
    generators.items.forEach(gen => ctrl.addNoisePanel(gen));

    // Noise Select
    ctrl.addSelect(parent, {
      label: 'Type',
      options: generators.items.map(g => g.title)
    }, (idx) => {
      generators.selectGenerator(idx);
      ctrl.selectNoisePanel(idx);
    });

    ctrl.selectNoisePanel(generators.index);

    // Model Select
    ctrl.addSelect(parent, {
      label: 'Model',
      options: models.items.map(m => m.name),
    }, (idx) => {
      models.selectModel(idx);
    });

    // Background Color
    ctrl.addColor(parent, {
      label: 'Background',
      colorMode: 'rgbfv',
    }, (color) => {
      scene.background.fromArray(color);
    });

    // Navigation Mode
    this.selectNavigationMode(this.navigationMode);
    ctrl.addSelect(parent, {
      label: 'Navigation',
      options: ['Interactive', 'Auto-rotate', 'Static'],
    }, (idx) => {
      this.selectNavigationMode(idx);
    });

    // Axis Helper Checkbox
    ctrl.addCheckbox(parent, {
      label: 'Axes Helper',
    }, (val) => {
      models.axesHelper.visible = val;
    });

    // Normal Helper Checkbox
    ctrl.addCheckbox(parent, {
      label: 'Normals Helper',
    }, (val) => {
      models.normalsHelper.visible = val;
    });

    return ctrl;
  }

  attachEvents() {
    window.addEventListener("resize", this.updateSize.bind(this));
  }

  updateSize() {
    const { renderer, camera } = this;
    const { innerWidth: w, innerHeight: h } = window;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  onFrame() {
    const { renderer, scene, camera, models, generators, orbitControls } = this;
    const { currentModel } = models;
    const { currentGenerator } = generators;
    requestAnimationFrame(this.onFrame.bind(this));
    camera.lookAt(scene.position);
    currentGenerator.update();
    orbitControls.update();
    currentModel.mesh.material = currentGenerator.material;
    renderer.render(scene, camera);
  }
}
window.demo = new Demo();
