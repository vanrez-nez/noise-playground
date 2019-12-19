import TextureRenderer from "./TextureRenderer";
import cellular2d from "../shaders/noise/cellular-2d.glsl";
import cellular2x2 from "../shaders/noise/cellular-2x2.glsl";
import cellular2x2x2 from "../shaders/noise/cellular-2x2x2.glsl";

// http://www.rhythmiccanvas.com/research/papers/worley.pdf
// http://webstaff.itn.liu.se/~stegu/GLSL-cellular/GLSL-cellular-notes.pdf

const FRAG_TYPES = {
  '2d': cellular2d,
  '2x2': cellular2x2,
  '2x2x2': cellular2x2x2,
};

export default class NoiseCellular extends TextureRenderer {
  constructor({ type, title }) {
    super({
      fragment: FRAG_TYPES[type],
      uniforms: {
        manhattanDistance: { value: false },
        jitter: { value: 0.8 },
      }
    });
    this.title = title;
    this.setCustomDescriptors();
  }

  setCustomDescriptors() {
    this.customDescriptors = [
      { type: 'group', label: 'Custom' },
      { type: 'select', name: 'mode', options: ['F1', 'F2', 'F2 - F1'], selected: 1 },
      { type: 'checkbox', name: 'manhattanDistance', value: false },
      { type: 'slider', name: 'jitter', value: 0.8 },
    ];
  }
}
