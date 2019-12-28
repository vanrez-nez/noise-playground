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
    this.items = [
      this.getPlaneModel(),
      this.getBoxModel(),
      this.getSphereModel(),
      this.getTorusModel(),
      this.getTorusKnotModel(),
    ];
    this.items.forEach(m => {
      this.group.add(m.points);
      this.group.add(m.mesh);
    });
    this.selectModel(this.modelIndex);
  }

  getPlaneModel() {
    const geo = new PlaneBufferGeometry(1, 1, 50, 50);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    return { name: 'Plane', mesh, points };
  }

  getBoxModel() {
    const geo = new BoxBufferGeometry(1, 1, 1, 50, 50, 50);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    const rot = new Vector3(Math.PI / 4, Math.PI / 4, 0);
    mesh.rotation.setFromVector3(rot);
    points.rotation.setFromVector3(rot);
    return { name: 'Box', mesh, points };
  }

  getSphereModel() {
    const geo = new SphereBufferGeometry(1, 50, 50);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    return { name: 'Sphere', mesh, points };
  }

  getTorusModel() {
    const geo = new TorusBufferGeometry(2, 0.5, 25, 80);
    const mesh = new Mesh(geo);
    const points = new Points(geo);
    return { name: 'Torus', mesh, points }
  }

  getTorusKnotModel() {
    const geo = new TorusKnotBufferGeometry(0.5, 0.2, 100, 20);
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