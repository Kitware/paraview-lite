import { generateComponentWithServerBinding } from 'paraview-lite/src/proxyHelper';

import module from './module';

export default generateComponentWithServerBinding(
  'Sphere',
  'Source',
  {
    startPhi: {
      name: 'StartPhi',
      autoApply: false,
      default: 0,
    },
    endPhi: {
      name: 'EndPhi',
      autoApply: false,
      default: 180,
    },
    phiResolution: {
      name: 'PhiResolution',
      autoApply: false,
      default: 8,
    },
    startTheta: {
      name: 'StartTheta',
      autoApply: false,
      default: 0,
    },
    endTheta: {
      name: 'EndTheta',
      autoApply: false,
      default: 360,
    },
    thetaResolution: {
      name: 'ThetaResolution',
      autoApply: false,
      default: 8,
    },
    radius: {
      name: 'Radius',
      autoApply: false,
      default: 0.5,
    },
    center: {
      name: 'Center',
      autoApply: false,
      default: [0, 0, 0],
    },
  },
  {
    name: 'Sphere',
    data() {
      return {
        module,
        color: 'grey darken-2',
        domains: {
          xCenter: {
            min: -5,
            max: 5,
            step: 1,
          },
          yCenter: {
            min: -5,
            max: 5,
            step: 1,
          },
          zCenter: {
            min: -5,
            max: 5,
            step: 1,
          },
        },
      };
    },
    computed: {
      phi: {
        get() {
          return [this.startPhi, this.endPhi];
        },
        set(value) {
          this.startPhi = Number(value[0]);
          this.endPhi = Number(value[1]);
        },
      },
      theta: {
        get() {
          return [this.startTheta, this.endTheta];
        },
        set(value) {
          this.startTheta = Number(value[0]);
          this.endTheta = Number(value[1]);
        },
      },
      xCenter: {
        get() {
          // register dependency
          this.mtime; // eslint-disable-line
          return this.center[0];
        },
        set(value) {
          this.mtime++;
          const newCenter = this.center.slice();
          newCenter[0] = value;
          this.center = newCenter.map(Number);
          this.$forceUpdate();
        },
      },
      yCenter: {
        get() {
          // register dependency
          this.mtime; // eslint-disable-line
          return this.center[1];
        },
        set(value) {
          this.mtime++;
          const newCenter = this.center.slice();
          newCenter[1] = value;
          this.center = newCenter.map(Number);
          this.$forceUpdate();
        },
      },
      zCenter: {
        get() {
          // register dependency
          this.mtime; // eslint-disable-line
          return this.center[2];
        },
        set(value) {
          this.mtime++;
          const newCenter = this.center.slice();
          newCenter[2] = value;
          this.center = newCenter;
          this.$forceUpdate();
        },
      },
    },
  }
);
