import {
  Clock,
  ShaderMaterial,
  DoubleSide,
  Vector2,
  Vector3,
} from "three";

import vert from "../shaders/vertex-pass-through.glsl";
import frag from "../shaders/frag-color.glsl";

const V3Temp = new Vector3();

export default class NoiseGenerator {
  constructor({ fragment = frag, vertex = vert, uniforms = {}, defines = {} }) {
    this.speed = 0.15;
    this.direction = new Vector2();
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
        displacement: { value: new Vector2(0.0, 0.0) },
        time: { value: 0 },
        scale: { value: 0.2 },
        frequency: { value: 2.0 },
        ...uniforms
      }
    });
  }

  updateUniforms() {
    const { clock, material, speed, direction } = this;
    const { uniforms: u } = material;
    V3Temp.copy(direction).multiplyScalar(speed * 0.1);
    u.displacement.value.add(V3Temp);
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
    const onDirection = v => this.direction.fromArray(v);
    const onFreq = this.getUniformProxy('frequency', 'number');
    const onScale = this.getUniformProxy('scale', 'number');
    instance.addGroup(panel, { label: 'Generator' });
    instance.addSlider(panel, { label: 'Speed', range: [0, 1], value: 0.15 }, onSpeed);
    instance.addSlider(panel, { label: 'Freq', range: [0.1, 10], value: 2 }, onFreq);
    instance.addSlider(panel, { label: 'Scale', value: 0.2, range: [0.01, 1] }, onScale);
    instance.addPad(panel, { label: 'Direction' }, onDirection);
  }

  update() {
    this.updateUniforms();
  }
}
