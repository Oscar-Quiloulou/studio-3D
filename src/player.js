import * as THREE from 'three';

export class Player {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 1, 0);

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1.2, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x55aaff })
    );
    body.castShadow = true;
    body.position.y = 0.6;
    this.group.add(body);

    this.vel = new THREE.Vector3();
    this.dir = new THREE.Vector3();
    this.speed = 4.0;
    this.turnSpeed = 3.0;
  }

  update(dt, input) {
    this.dir.set(0, 0, 0);

    if (input.forward) this.dir.z -= 1;
    if (input.backward) this.dir.z += 1;
    if (input.left) this.dir.x -= 1;
    if (input.right) this.dir.x += 1;

    if (this.dir.lengthSq() > 0) this.dir.normalize();

    // Orientation with mouse yaw
    this.group.rotation.y -= input.mouseDeltaX * 0.002;

    // Move in local forward/right
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.group.rotation);
    const right = new THREE.Vector3(1, 0, 0).applyEuler(this.group.rotation);
    const move = new THREE.Vector3()
      .addScaledVector(forward, this.dir.z)
      .addScaledVector(right, this.dir.x)
      .normalize()
      .multiplyScalar(this.speed * dt);

    this.group.position.add(move);

    // Simple ground clamp
    this.group.position.y = Math.max(1, this.group.position.y);
  }
}
