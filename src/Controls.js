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

  addControl(desc, noise, parent) {
    const { state } = noise;
    const { type, name } = desc;
    const onChange = noise.updateFromState.bind(noise);
    switch (type) {
      case 'group':
        parent.addGroup(desc);
        break;
      case 'pad':
        state[name] = this.addPad(parent, desc, onChange);
        break;
      case 'slider':
        state[name] = this.addSlider(parent, desc, onChange);
        break;
      case 'select':
        state[name] = this.addSelect(parent, desc, onChange);
        break;
      case 'checkbox':
        state[name] = this.addCheckbox(parent, desc, onChange);
        break;
    }
  }

  addCheckbox(parent, desc, onChange) {
    const def = { value: false };
    const node = { desc, ...def, ...desc };
    parent.addCheckbox(node, 'value', {
      label: desc.name,
      onChange,
    });
    return node;
  }

  addSelect(parent, desc, onChange) {
    const node = { desc, options: desc.options, value: 0 };
    parent.addSelect(node, 'options', {
      label: desc.label || desc.name,
      selected: 1,
      onChange(idx) {
        node.value = idx;
        onChange(idx, desc.options[idx]);
      },
    });
    return node;
  }

  addSlider(parent, desc, onChange) {
    const def = { value: 0, range: [0, 1] };
    const node = { ...def, ...desc, desc };
    parent.addSlider(node, 'value', 'range', {
      label: desc.name,
      onChange,
    });
    return node;
  }

  addPad(parent, desc, onChange) {
    const node = {
      desc,
      str: '0, 0',
      value: [0, 0],
    };
    parent.addPad(node, 'value', {
      onChange() {
        const [x, y] = node.value;
        node.str = `${x.toFixed(3)}, ${y.toFixed(3)}`;
        onChange();
      }
    });
    parent.addStringOutput(node, 'str', {
      label: desc.name,
    });
    return node;
  }

  addColor(parent, desc, onChange) {
    const { colorMode, label } = desc;
    const color = colorMode === 'hex' ? '#000000' : [0, 0, 0];
    const node = { value: color };
    parent.addColor(node, 'value', {
      label,
      colorMode,
      onChange() {
        if (colorMode === 'rgbfv') {
          node.value.forEach((val, idx) => {
            node.value[idx] = Number(val.toFixed(3));
          });
          // reupdate control color text with new format
          this._updateColor();
        }
        onChange(node.value);
      }
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
