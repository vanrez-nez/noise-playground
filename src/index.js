import "./styles.css";
import {
  AxesHelper,
  VertexNormalsHelper,
  Group,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  Color,
  PlaneBufferGeometry,
  BoxBufferGeometry,
  SphereBufferGeometry
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import NoiseCellular from "./noise/NoiseCellular";
import Controls from "./Controls";

class Demo {
  constructor() {
    this.noiseIndex = 0;
    this.modelIndex = 0;
    this.navigationMode = 0;
    this.initWorld();
    this.attachEvents();
    this.initNoise();
    this.updateSize();
    this.helpers = this.createHelpers();
    this.models = this.createModels();
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

  selectModel(idx) {
    const { models } = this;
    models.forEach((m) => {
      m.mesh.visible = false;
      m.helper.visible = false;
    });
    const model = models[idx];
    if (model) {
      model.mesh.visible = true;
      model.helper.visible = true;
      this.modelIndex = idx;
    }
  }

  selectGenerator(idx) {
    const { controls } = this;
    this.noiseIndex = idx;
    controls.selectNoisePanel(idx);
  }

  selectNavigationMode(idx) {
    const { orbitControls: oc } = this;
    oc.autoRotate = idx === 1;
    oc.enabled = idx < 2;
    this.navigationMode = idx;
    oc.reset();
  }

  createHelpers() {
    const { scene } = this;
    const axesHelper = new AxesHelper(2);
    axesHelper.position.z += 0.01;
    axesHelper.visible = false;
    const normalHelperGroup = new Group();
    normalHelperGroup.visible = false;
    scene.add(axesHelper, normalHelperGroup);
    return {
      axesHelper,
      normalHelperGroup,
    };
  }

  createControls() {
    const { generators, models, scene, helpers } = this;
    const ctrl = new Controls();
    const { mainPanel: parent } = ctrl;
    generators.forEach(gen => ctrl.addNoisePanel(gen));

    // Noise Select
    ctrl.addSelect(parent, {
      label: 'Type',
      options: generators.map(g => g.title)
    }, (idx) => {
      this.selectGenerator(idx);
    });
    ctrl.selectNoisePanel(this.noiseIndex);

    // Model Select
    ctrl.addSelect(parent, {
      label: 'Model',
      options: models.map(m => m.name),
    }, (idx) => {
      this.selectModel(idx);
    });
    this.selectModel(this.modelIndex);

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
      helpers.axesHelper.visible = val;
    });

    // Normal Helper Checkbox
    ctrl.addCheckbox(parent, {
      label: 'Normals Helper',
    }, (val) => {
      helpers.normalHelperGroup.visible = val;
    });

    return ctrl;
  }

  createModels() {
    const { scene, helpers } = this;
    const models = [
      this.getPlaneModel(),
      this.getBoxModel(),
      this.getSphereModel(),
    ];
    models.forEach(m => {
      helpers.normalHelperGroup.add(m.helper);
      scene.add(m.mesh);
    });
    return models;
  }

  getPlaneModel() {
    const geo = new PlaneBufferGeometry(1, 1);
    const mesh = new Mesh(geo);
    const helper = new VertexNormalsHelper(mesh, 0.1);
    return { name: 'Plane', mesh, helper };
  }

  getBoxModel() {
    const geo = new BoxBufferGeometry(1, 1, 1);
    const mesh = new Mesh(geo);
    mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    const helper = new VertexNormalsHelper(mesh, 0.1);
    return { name: 'Box', mesh, helper };
  }

  getSphereModel() {
    const geo = new SphereBufferGeometry(1, 50, 50);
    const mesh = new Mesh(geo);
    const helper = new VertexNormalsHelper(mesh, 0.1);
    return { name: 'Sphere', mesh, helper };
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

  initNoise() {
    this.generators = [
      new NoiseCellular({ type: '2d', title: "Cellular 2D" }),
      new NoiseCellular({ type: '2x2', title: "Cellular 2x2" }),
      new NoiseCellular({ type: '2x2x2', title: "Cellular 2x2x2" }),
    ];
  }

  onFrame() {
    const { renderer, scene, camera, selectedModel, selectedNoise, orbitControls } = this;
    requestAnimationFrame(this.onFrame.bind(this));
    camera.lookAt(scene.position);
    selectedNoise.update();
    orbitControls.update();
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
