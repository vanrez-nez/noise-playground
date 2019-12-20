import NoiseGenerator from "./NoiseGenerator";
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

export default class NoiseCellular extends NoiseGenerator {
  constructor({ type, title }) {
    super({
      fragment: FRAG_TYPES[type],
      uniforms: {
        manhattanDistance: { value: false },
        jitter: { value: 0.8 },
        mode: { value: 0 },
      }
    });
    this.title = title;
  }

  setupControls(instance, panel) {
    super.setupControls(instance, panel);
    const onMode = this.getUniformProxy('mode', 'number');
    const onMdst = this.getUniformProxy('manhattanDistance', 'number');
    const onJitter = this.getUniformProxy('jitter', 'number');
    instance.addGroup(panel, { label: 'Noise' });
    instance.addSlider(panel, { label: 'Jitter', value: 0.8 }, onJitter);
    instance.addSelect(panel, { label: 'Mode', options: ['F1', 'F2', 'F2 - F1'] }, onMode);
    instance.addCheckbox(panel, { label: 'Manhattan Dst', value: false }, onMdst);
  }
}
