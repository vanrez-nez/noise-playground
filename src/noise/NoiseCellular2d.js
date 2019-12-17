import TextureRenderer from "./TextureRenderer";
import fragment from "../shaders/noise/cellular-2d.glsl";

export default class NoiseCellular2d extends TextureRenderer {
  constructor() {
    super({ fragment });
    this.title = "Cellular 2D";
  }
}
