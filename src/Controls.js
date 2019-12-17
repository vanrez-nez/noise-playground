import ControlKit from "controlkit";

export default class Controls {
  constructor() {
    this.kit = new ControlKit();
    this.panel = this.kit.addPanel();
    this.folders = {};
    this.state = {
      noiseOptions: [],
      noiseSelect: ""
    };
  }

  addNoiseSelect() {
    const { panel, state, folders } = this;
    for (const key in folders) {
      const f = folders[key];
      state.noiseOptions.push(f.name);
    }
    const controller = panel.addSelect(this.state, "noiseOptions", {
      selected: state.noiseSelect
    });
    this.selectController = controller;
  }

  addNoiseFolder(id, noise) {
    const { panel, folders } = this;
    const folder = panel.addGroup({ label: noise.title });
    folders[id] = folder;
  }

  selectNoiseFolder(id) {
    const { folders, state } = this;
    const prev = this.folders[state.noiseId];
    if (prev) {
      //prev.hide();
    }
    //folders[id].show();
    state.noiseId = "Cellular 2D";
  }
}
