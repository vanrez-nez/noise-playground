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
    noise.setupControls(this, panel);
    panel.disable();
  }

  addGroup(parent, opts) {
    parent.addGroup(opts);
  }

  addCheckbox(parent, opts, onChange) {
    const def = { value: false };
    const node = { opts, ...def, ...opts };
    parent.addCheckbox(node, 'value', {
      label: opts.label || opts.name,
      onChange() {
        onChange(node.value);
      },
    });
    return node;
  }

  addSelect(parent, opts, onChange) {
    const node = { opts, options: opts.options, value: opts.options[0] };
    parent.addSelect(node, 'options', {
      label: opts.label || opts.name,
      target: 'value',
      onChange(idx) {
        onChange(idx, opts.options[idx]);
      },
    });
    return node;
  }

  addSlider(parent, opts, onChange) {
    const def = { value: 0, range: [0, 1] };
    const node = { ...def, ...opts, opts };
    parent.addSlider(node, 'value', 'range', {
      label: opts.label || opts.name,
      onChange() {
        onChange(node.value);
      },
    });
    return node;
  }

  addPad(parent, opts, onChange) {
    const node = {
      opts,
      str: '0, 0',
      value: [0, 0],
    };
    parent.addPad(node, 'value', {
      onChange() {
        const [x, y] = node.value;
        node.str = `${x.toFixed(3)}, ${y.toFixed(3)}`;
        onChange(node.value);
      }
    });
    parent.addStringOutput(node, 'str', {
      label: opts.label || opts.name,
    });
    return node;
  }

  addColor(parent, opts, onChange) {
    const { colorMode } = opts;
    const color = colorMode === 'hex' ? '#000000' : [0, 0, 0];
    const node = { value: color };
    parent.addColor(node, 'value', {
      label: opts.label || opts.name,
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
