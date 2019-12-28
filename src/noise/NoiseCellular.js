import NoiseGenerator from "./NoiseGenerator";
import cellular2d_f from "../shaders/noise/cellular-2d.fs.glsl";
import cellular2d_v from "../shaders/noise/cellular-2d.vs.glsl";
import cellular2x2_f from "../shaders/noise/cellular-2x2.fs.glsl";
import cellular2x2_v from "../shaders/noise/cellular-2x2.vs.glsl";
import cellular2x2x2_f from "../shaders/noise/cellular-2x2x2.fs.glsl";
import cellular2x2x2_v from "../shaders/noise/cellular-2x2x2.vs.glsl";

// http://www.rhythmiccanvas.com/research/papers/worley.pdf
// http://webstaff.itn.liu.se/~stegu/GLSL-cellular/GLSL-cellular-notes.pdf

const SHADER_TYPES = {
  '2d': { fs: cellular2d_f, vs: cellular2d_v },
  '2x2': { fs: cellular2x2_f, vs: cellular2x2_v },
  '2x2x2': { fs: cellular2x2x2_f, vs: cellular2x2x2_v }
};

export default class NoiseCellular extends NoiseGenerator {
  constructor({ type, title }) {
    super({
      fragment: SHADER_TYPES[type].fs,
      vertex: SHADER_TYPES[type].vs,
      uniforms: {
        manhattanDistance: { value: false },
        jitter: { value: 0.8 },
        fragmentMode: { value: 0 },
        vertexMode: { value: 0 },
      },
      defines: {
        VERT_MODE: 0,
        FRAG_MODE: 0,
      }
    });
    this.title = title;
  }

  setupControls(instance, panel) {
    super.setupControls(instance, panel);
    const onVertMode = this.getDefinesProxy('VERT_MODE');
    const onFragMode = this.getDefinesProxy('FRAG_MODE');
    const onMdst = this.getUniformProxy('manhattanDistance', 'number');
    const onJitter = this.getUniformProxy('jitter', 'number');
    instance.addGroup(panel, { label: 'Noise' });
    instance.addSlider(panel, { label: 'Jitter', value: 0.8 }, onJitter);
    instance.addSelect(panel, { label: 'Vertex Mode', options: ['F1', 'F2', 'F2 - F1'] }, onVertMode);
    instance.addSelect(panel, { label: 'Fragment Mode', options: ['F1', 'F2', 'F2 - F1', 'UV'] }, onFragMode);
    instance.addCheckbox(panel, { label: 'Manhattan Dst', value: false }, onMdst);
  }
}
