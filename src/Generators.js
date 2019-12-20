import NoiseCellular from "./noise/NoiseCellular";

export default class Generators {
  constructor() {
    this.index = 0;
    this.items = [
      new NoiseCellular({ type: '2d', title: "Cellular 2D" }),
      new NoiseCellular({ type: '2x2', title: "Cellular 2x2" }),
      new NoiseCellular({ type: '2x2x2', title: "Cellular 2x2x2" }),
    ];
  }

  selectGenerator(idx) {
    this.index = idx;
  }

  get currentGenerator() {
    return this.items[this.index];
  }

}