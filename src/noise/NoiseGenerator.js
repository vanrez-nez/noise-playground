import {
  Clock,
  ShaderMaterial,
  DoubleSide,
  Vector2,
} from "three";

import vert from "../shaders/vertex-pass-through.glsl";
import frag from "../shaders/frag-color.glsl";

export default class NoiseGenerator {
  constructor({ fragment = frag, vertex = vert, uniforms = {}, defines = {} }) {
    this.speed = 0;
    this.shader = { defines, uniforms, fragment, vertex };
    this.clock = new Clock();
    this.material = this.createMaterial();
  }

  createMaterial() {
    const { fragment, vertex, uniforms, defines } = this.shader;
    return new ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      side: DoubleSide,
      defines,
      uniforms: {
        wireframeLinewidth: 2,
        displacement: { value: new Vector2(0.0, 1.0) },
        time: { value: 0 },
        frequency: { value: 10.0 },
        ...uniforms
      }
    });
  }

  updateUniforms() {
    const { clock, material, speed } = this;
    const { uniforms: u } = material;
    u.time.value += clock.getDelta() * speed;
  }

  getDefinesProxy(name) {
    const { material } = this;
    const { defines } = material;
    return function(val) {
      defines[name] = val;
      material.needsUpdate = true;
    }
  }

  getUniformProxy(name, type) {
    const { uniforms: u } = this.material;
    const target = u[name];
    return function(val) {
      switch(type) {
        case 'array':
          target.value.fromArray(val);
          break;
        case 'boolean':
          target.value = Boolean(val);
          break;
        case 'number':
          target.value = val;
          break;
      }
    }
  }

  setupControls(instance, panel) {
    const onSpeed = v => this.speed = v;
    const onFreq = this.getUniformProxy('frequency', 'number');
    const onDisplacement = this.getUniformProxy('displacement', 'array');
    instance.addGroup(panel, { label: 'Generator' });
    instance.addSlider(panel, { label: 'Speed', range: [0, 10], value: 1 }, onSpeed);
    instance.addSlider(panel, { label: 'Freq', range: [1, 50], value: 10 }, onFreq);
    instance.addPad(panel, { label: 'Displacement' }, onDisplacement);
  }

  update() {
    this.updateUniforms();
  }
}
