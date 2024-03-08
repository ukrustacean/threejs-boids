import * as THREE from "three";
import { Plane, Scene, Vector3 } from "three";
import { randFloatSpread, randInt } from "three/src/math/MathUtils.js";

const X = 20;
const Y = 20;
const Z = 20;

const bounds = [
  new Plane(new Vector3(-1,  0,  0),  X),
  new Plane(new Vector3( 1,  0,  0), -X),
  new Plane(new Vector3( 0, -1,  0),  Y),
  new Plane(new Vector3( 0,  1,  0), -Y),
  new Plane(new Vector3( 0,  0, -1),  Z),
  new Plane(new Vector3( 0,  0,  1), -Z),
];

bounds.forEach(x => {
  console.log(x.normal)
})

type Cone = THREE.Mesh<
  THREE.ConeGeometry,
  THREE.MeshLambertMaterial,
  THREE.Object3DEventMap
>;

// const SEPARATION = 0.33
// const ALIGNMENT = 0.33
// const COHESION = 0.33
const RADIUS = 50

export class Boid {
  body: Cone;
  boids: Boid[];
  vel: Vector3;
  acc: Vector3 = new Vector3();

  constructor(scene: Scene, boids: Boid[], velocity?: Vector3) {
    const geometry = new THREE.ConeGeometry(1, 2.5, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0xaa5555 });

    this.boids = boids
    this.body = new THREE.Mesh(geometry, material);
    this.body.position.set(randInt(-5, 5), randInt(-5, 5), randInt(-5, 5));
    this.vel =
      velocity ||
      new Vector3(
        randFloatSpread(20),
        randFloatSpread(20),
        randFloatSpread(20),
      );
    this.acc.copy(this.vel);
    scene.add(this.body);

    console.log(this.body.position)
    console.log(this.acc)
  }

  update(time: DOMHighResTimeStamp) {
    let count = 0

    let separation = new Vector3()
    let alignment = new Vector3()
    let cohesion = new Vector3()

    for (const boid of this.boids) {
      if (this.body.position.distanceTo(boid.body.position) > RADIUS) continue;
      count += 1

      let s = boid.body.position.clone()
      s.sub(this.body.position)

      separation.add(s)
      alignment.add(boid.vel)
      cohesion.add(boid.body.position)
    }

    separation.divideScalar(count).negate()
    alignment.divideScalar(count)
    cohesion.divideScalar(count)

    // this.vel.set(0, 0, 0)
    // this.vel.add(separation.multiplyScalar(SEPARATION))
    // this.vel.add(alignment.multiplyScalar(ALIGNMENT))
    // this.vel.add(cohesion.multiplyScalar(COHESION))
    // this.vel.multiplyScalar(time)

    if (this.body.position.x > X) {
      // let d = Math.abs(bounds[0].distanceToPoint(this.body.position))
      this.body.position.x = X-1
      // this.vel.x = -(1/d)
      this.vel.x = -1/time
    }
    if (this.body.position.x < -X) {
      // let d = Math.abs(this.body.position.x + X)
      this.body.position.x = 1-X
      // this.vel.x += d
      this.acc.x = 1/time
    }
    if (this.body.position.y > Y) {
      this.body.position.y = Y-1
      this.vel.y = -1/time
      // this.acc.y *= -1
    }
    if (this.body.position.y < -Y) {
      this.body.position.y = 1-Y
      this.vel.y = 1/time
      // this.acc.y *= -1
    }
    if (this.body.position.z > Z) {
      this.body.position.z = Z-1
      this.vel.z = -1/time
      // this.acc.z *= -1
    }
    if (this.body.position.z < -Z) {
      this.body.position.z = 1-Z
      this.vel.z = 1/time
      // this.acc.z *= -1
    }

    // this.vel.add(this.acc).clampLength(0, 10)
    this.body.position.add(this.vel.clone().multiplyScalar(time))
  }
}
