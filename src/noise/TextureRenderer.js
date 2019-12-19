import {
  Clock,
  Scene,
  OrthographicCamera,
  WebGLRenderTarget,
  RGBFormat,
  LinearFilter,
  NearestFilter,
  BufferGeometry,
  BufferAttribute,
  RawShaderMaterial,
  RepeatWrapping,
  Mesh,
  Vector2,
  Vector3
} from "three";

import vert from "../shaders/vertex-pass-through.glsl";
import frag from "../shaders/frag-color.glsl";

export default class TextureRenderer {
  constructor({ fragment = frag, vertex = vert, uniforms = {} }) {
    this.state = {};
    this.globalDescriptors = [];
    this.customDescriptors = [];
    this.shader = { fragment, vertex };
    this.uniforms = uniforms;
    this.clock = new Clock();
    this.scene = new Scene();
    this.camera = new OrthographicCamera();
    this.target = this.createTarget();
    this.material = this.createMaterial();
    this.triangle = this.createTriangleMesh();
    this.scene.add(this.triangle);
    this.setGlobalDescriptors();
  }

  createTarget() {
    return new WebGLRenderTarget(1, 1, {
      format: RGBFormat,
      stencilBuffer: false,
      depthBuffer: false,
      minFilter: LinearFilter,
      magFilter: NearestFilter,
      wrapS: RepeatWrapping,
      wrapT: RepeatWrapping
    });
  }

  createTriangleMesh() {
    const { material } = this;
    const geo = new BufferGeometry();
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]);
    geo.setAttribute("position", new BufferAttribute(vertices, 2));
    const mesh = new Mesh(geo, material);
    mesh.frustumCulled = false;
    return mesh;
  }

  createMaterial() {
    const { target, shader, uniforms } = this;
    return new RawShaderMaterial({
      fragmentShader: shader.fragment,
      vertexShader: shader.vertex,
      uniforms: {
        map: { value: target.texture },
        resolution: { value: new Vector2() },
        displacement: { value: new Vector2(0.0, 1.0) },
        time: { value: 0 },
        mode: { value: 0 },
        frequency: { value: 10.0 },
        ...uniforms
      }
    });
  }

  setSize(width, height) {
    const { target, material } = this;
    target.setSize(width, height);
    material.uniforms.resolution.value.set(width, height);
  }

  updateUniforms() {
    const { clock, material, state } = this;
    const { uniforms: u } = material;
    u.time.value += clock.getDelta() * state.speed.value;
  }

  setGlobalDescriptors() {
    this.baseDescriptors = [
      { type: 'group', label: 'Base' },
      { type: 'slider', name: 'speed', range: [0, 10], value: 1 },
      { type: 'slider', name: 'frequency', range: [1, 50], value: 10 },
      { type: 'pad', name: 'displacement' },
    ];
  }

  getControlDescriptors() {
    return this.baseDescriptors.concat(this.customDescriptors);
  }

  setUniformValue(uniform, prop) {
    const { type } = prop.desc;
    switch(type) {
      case 'pad':
        uniform.value.fromArray(prop.value);
        break;
      case 'slider':
      case 'select':
        uniform.value = prop.value;
        break;
      case 'checkbox':
        uniform.value = Boolean(prop.value);
    }
  }

  updateFromState() {
    const { state, material } = this;
    const { uniforms } = material;
    for (const key in state) {
      const prop = state[key];
      const uniform = uniforms[key];
      if (prop && uniform) {
        this.setUniformValue(uniform, prop);
      }
    }
  }

  render(renderer) {
    const { scene, camera, target } = this;
    this.updateUniforms();
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
  }
}
