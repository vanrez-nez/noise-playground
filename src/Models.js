import {
  AxesHelper,
  VertexNormalsHelper,
  PlaneBufferGeometry,
  BoxBufferGeometry,
  SphereBufferGeometry,
  Mesh,
  Group,
} from 'three';

export default class Models {
  constructor(modelsGroup, helpersGroup) {
    this.modelIndex = 0;
    this.items = [
      this.getPlaneModel(),
      this.getBoxModel(),
      this.getSphereModel(),
    ];
    this.items.forEach(m => {
      modelsGroup.add(m.mesh);
    });
    this.axesHelper = this.getAxesHelper();
    this.normalsHelper = this.getNormalsHelper();
    helpersGroup.add(this.axesHelper);
    helpersGroup.add(this.normalsHelper);
    this.selectModel(this.modelIndex);
  }

  getPlaneModel() {
    const geo = new PlaneBufferGeometry(1, 1);
    const mesh = new Mesh(geo);
    const helper = new VertexNormalsHelper(mesh, 0.1);
    return { name: 'Plane', mesh, helper };
  }

  getBoxModel() {
    const geo = new BoxBufferGeometry(1, 1, 1);
    const mesh = new Mesh(geo);
    mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    const helper = new VertexNormalsHelper(mesh, 0.1);
    return { name: 'Box', mesh, helper };
  }

  getSphereModel() {
    const geo = new SphereBufferGeometry(1, 50, 50);
    const mesh = new Mesh(geo);
    const helper = new VertexNormalsHelper(mesh, 0.1);
    return { name: 'Sphere', mesh, helper };
  }

  getAxesHelper() {
    const axesHelper = new AxesHelper(2);
    axesHelper.position.z += 0.01;
    axesHelper.visible = false;
    return axesHelper;
  }

  getNormalsHelper() {
    const { items } = this;
    const group = new Group();
    group.visible = false;
    items.forEach(item => group.add(item.helper));
    return group;
  }

  selectModel(idx) {
    const { items } = this;
    items.forEach((m) => {
      m.mesh.visible = false;
      m.helper.visible = false;
    });
    const model = items[idx];
    if (model) {
      model.mesh.visible = true;
      model.helper.visible = true;
      this.modelIndex = idx;
    }
  }

  get currentModel() {
    return this.items[this.modelIndex];
  }
}