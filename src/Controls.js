import ControlKit from "controlkit";

export default class Controls {
  constructor() {
    this.kit = new ControlKit();
    this.panels = [];
    this.mainPanel = this.kit.addPanel({
      label: 'Options',
      align: 'left',
      width: 300
    });
  }

  addNoisePanel(noise) {
    const { panels, kit, state } = this;
    const panel = kit.addPanel({
      label: noise.title,
      align: 'right',
      width: 300,
    });
    panels.push({ noise, panel });
    // populate panel with controls and link them to noise state
    noise.getControlDescriptors().forEach((descriptor) => {
      this.addControl(descriptor, noise, panel);
    });
    noise.updateFromState();
    panel.disable();
  }

  addControl(desc, noise, panel) {
    const { state } = noise;
    const { type, name } = desc;
    const onChange = noise.updateFromState.bind(noise);
    switch (type) {
      case 'group':
        panel.addGroup(desc);
        break;
      case 'pad':
        state[name] = this.addPad(panel, desc, onChange);
        break;
      case 'slider':
        state[name] = this.addSlider(panel, desc, onChange);
        break;
      case 'select':
        state[name] = this.addSelect(panel, desc, onChange);
        break;
      case 'checkbox':
        state[name] = this.addCheckbox(panel, desc, onChange);
        break;
    }
  }

  addCheckbox(panel, desc, onChange) {
    const def = { value: false };
    const node = { desc, ...def, ...desc };
    panel.addCheckbox(node, 'value', {
      label: desc.name,
      onChange,
    });
    return node;
  }

  addSelect(panel, desc, onChange) {
    const node = { desc, options: desc.options, value: 0 };
    panel.addSelect(node, 'options', {
      label: desc.label || desc.name,
      selected: 1,
      onChange(idx) {
        node.value = idx;
        onChange(idx, desc.options[idx]);
      },
    });
    return node;
  }

  addSlider(panel, desc, onChange) {
    const def = { value: 0, range: [0, 1] };
    const node = { ...def, ...desc, desc };
    panel.addSlider(node, 'value', 'range', {
      label: desc.name,
      onChange,
    });
    return node;
  }

  addPad(panel, desc, onChange) {
    const node = {
      desc,
      str: '0, 0',
      value: [0, 0],
    };
    panel.addPad(node, 'value', {
      onChange() {
        const [x, y] = node.value;
        node.str = `${x.toFixed(3)}, ${y.toFixed(3)}`;
        onChange();
      }
    });
    panel.addStringOutput(node, 'str', {
      label: desc.name,
    });
    return node;
  }

  selectNoisePanel(idx) {
    const { panels } = this;
    const target = panels[idx];
    if (target) {
      panels.forEach(p => p.panel.disable());
      target.panel.enable();
    }
  }
}
