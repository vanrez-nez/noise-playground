import TextureRenderer from "./TextureRenderer";
import fragment from "../shaders/noise/cellular-2x2.glsl";

export default class NoiseCellular2x2 extends TextureRenderer {
  constructor() {
    super({ fragment, uniforms: {
      manhattanDistance: { value: false },
      jitter: { value: 0.8 },
    } });
    this.title = "Cellular 2x2";
  }

  getControlDescriptors() {
    return [
      { type: 'pad', name: 'displacement' },
      { type: 'select', name: 'mode', options: ['F1', 'F2', 'F2 - F1'] },
      { type: 'checkbox', name: 'manhattanDistance', value: false },
      { type: 'slider', name: 'jitter', value: 0.8 },
      { type: 'slider', name: 'speed', range: [0, 10], value: 1 },
      { type: 'slider', name: 'frequency', range: [1, 50], value: 10 },
    ];
  }
}
