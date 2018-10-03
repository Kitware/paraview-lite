import { generateComponentWithServerBinding } from 'paraview-lite/src/proxyHelper';

import module from './module';

export default generateComponentWithServerBinding(
  'Cone',
  'Source',
  {
    radius: {
      name: 'Radius',
      autoApply: true,
      default: 0.5,
      clientToServer: Number,
    },
    resolution: {
      name: 'Resolution',
      autoApply: true,
      default: 6,
      clientToServer: Number,
    },
    height: {
      name: 'Height',
      autoApply: true,
      default: 1,
      clientToServer: Number,
    },
    center: {
      name: 'Center',
      autoApply: true,
      default: [0, 0, 0],
    },
    direction: {
      name: 'Direction',
      autoApply: true,
      default: [1, 0, 0],
    },
    capping: {
      name: 'Capping',
      autoApply: true,
      default: 1,
    },
  },
  {
    name: 'Cone',
    data() {
      return {
        module,
        color: 'grey darken-2',
      };
    },
    computed: {
      xCenter: {
        get() {
          return this.center[0];
        },
        set(value) {
          const center = this.center.slice();
          center[0] = Number(value);
          this.center = center;
        },
      },
      yCenter: {
        get() {
          return this.center[1];
        },
        set(value) {
          const center = this.center.slice();
          center[1] = Number(value);
          this.center = center;
        },
      },
      zCenter: {
        get() {
          return this.center[2];
        },
        set(value) {
          const center = this.center.slice();
          center[2] = Number(value);
          this.center = center;
        },
      },
      xDirection: {
        get() {
          return this.direction[0];
        },
        set(value) {
          const tmp = this.direction.slice();
          tmp[0] = Number(value);
          this.direction = tmp;
        },
      },
      yDirection: {
        get() {
          return this.direction[1];
        },
        set(value) {
          const tmp = this.direction.slice();
          tmp[1] = Number(value);
          this.direction = tmp;
        },
      },
      zDirection: {
        get() {
          return this.direction[2];
        },
        set(value) {
          const tmp = this.direction.slice();
          tmp[2] = Number(value);
          this.direction = tmp;
        },
      },
    },
  }
);
