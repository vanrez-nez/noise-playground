import {
  PlaneBufferGeometry,
  BoxBufferGeometry,
  SphereBufferGeometry,
  TorusBufferGeometry,
  TorusKnotBufferGeometry,
  Mesh,
  Points,
  Group,
  Vector3,
} from 'three';

export default class Models {
  constructor(scene) {
    this.group = new Group();
    scene.add(this.group);
    this.modelIndex = 0;
    this.items = this.createModels(1);
    this.selectModel(this.modelIndex);
  }

  createModels(quality) {
    const { group } = this;
    const items = [
      this.getPlaneModel(quality),
      this.getBoxModel(quality),
      this.getSphereModel(quality),
      this.getTorusModel(quality),
      this.getTorusKnotModel(quality),
    ];
    items.forEach(m => {
      group.add(m.points);
      group.add(m.mesh);
      m.points.visible = false;
    });
    return items;
  }

  removeModels() {
    const { group } = this;
    group.remove(...group.children);
  }

  changeModelsQuality(quality) {
    this.removeModels();
    this.items = this.createModels(quality);
    this.selectModel(this.modelIndex);
  }

  getPlaneModel(q) {
    const geo = new PlaneBufferGeometry(1, 1, 50 * q, 50 * q);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    return { name: 'Plane', mesh, points };
  }

  getBoxModel(q) {
    const geo = new BoxBufferGeometry(1, 1, 1, 50 * q, 50 * q, 50 * q);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    const rot = new Vector3(Math.PI / 4, Math.PI / 4, 0);
    mesh.rotation.setFromVector3(rot);
    points.rotation.setFromVector3(rot);
    return { name: 'Box', mesh, points };
  }

  getSphereModel(q) {
    const geo = new SphereBufferGeometry(1, 50 * q, 50 * q);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    return { name: 'Sphere', mesh, points };
  }

  getTorusModel(q) {
    const geo = new TorusBufferGeometry(0.5, 0.15, 25 * q, 80 * q);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    return { name: 'Torus', mesh, points }
  }

  getTorusKnotModel(q) {
    const geo = new TorusKnotBufferGeometry(0.5, 0.2, 100 * q, 20 * q);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    return { name: 'Torus Knot', mesh, points }
  }

  selectModel(idx) {
    const { items, currentModel } = this;
    const lastState = {
      mesh: currentModel.mesh.visible,
      points: currentModel.points.visible,
    };
    items.forEach((m) => {
      m.mesh.visible = false;
      m.points.visible = false;
    });
    const model = items[idx];
    if (model) {
      model.mesh.visible = lastState.mesh;
      model.points.visible = lastState.points;
      this.modelIndex = idx;
    }
  }

  get currentModel() {
    return this.items[this.modelIndex];
  }
}