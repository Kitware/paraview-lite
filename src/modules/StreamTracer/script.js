import {
  generateComponentWithServerBinding,
  bool2int,
  toBoolean,
} from 'paraview-lite/src/proxyHelper';

import module from './module';

const SEPARATOR = ':|:';
const ITEMS = {
  interpolatorType: [
    { text: 'Interpolator with Point Locator', value: 0 },
    { text: 'Interpolator with Cell Locator', value: 1 },
  ],
  integrationDirection: [
    { text: 'Forward', value: 0 },
    { text: 'Backward', value: 1 },
    { text: 'Both', value: 2 },
  ],
  integratorType: [
    { text: 'Runge-Kutta 2', value: 0 },
    { text: 'Runge-Kutta 4', value: 1 },
    { text: 'Runge-Kutta 4-5', value: 2 },
  ],
  integrationStepUnit: [
    { text: 'Length', value: 1 },
    { text: 'Cell Length', value: 2 },
  ],
};

export default generateComponentWithServerBinding(
  'StreamTracer',
  'Source',
  {
    inputVector: {
      name: 'SelectInputVectors',
      label: 'Vectors',
      clientToServer: ({ value }) => value.split(SEPARATOR),
      serverToClient: (v) => ({ text: v[1], value: v.join(SEPARATOR) }),
      autoApply: false,
      default: ['POINTS', ''],
    },
    interpolatorType: {
      name: 'InterpolatorType',
      clientToServer: ({ value }) => Number(value),
      serverToClient: (v) => ITEMS.interpolatorType[v],
      autoApply: false,
      default: 0,
    },
    integrationDirection: {
      name: 'IntegrationDirection',
      clientToServer: ({ value }) => Number(value),
      serverToClient: (v) => ITEMS.integrationDirection[v],
      autoApply: false,
      default: 2,
    },
    integratorType: {
      name: 'IntegratorType',
      clientToServer: ({ value }) => Number(value),
      serverToClient: (v) => ITEMS.integratorType[v],
      autoApply: false,
      default: 2,
    },
    integrationStepUnit: {
      name: 'IntegrationStepUnit',
      clientToServer: ({ value }) => Number(value),
      serverToClient: (v) => ITEMS.integrationStepUnit[v - 1],
      autoApply: false,
      default: 2,
    },
    surfaceStreamlines: {
      name: 'Surface Streamlines',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: false,
      default: 0,
    },
    point1: {
      name: 'Point1',
      autoApply: false,
      default: [-1, -1, -1],
      subProxy: 'SeedType',
    },
    point2: {
      name: 'Point2',
      autoApply: false,
      default: [1, 1, 1],
      subProxy: 'SeedType',
    },
    resolution: {
      name: 'Resolution',
      autoApply: false,
      clientToServer: Number,
      default: 100,
      subProxy: 'SeedType',
    },
    initialIntegrationStep: {
      name: 'InitialIntegrationStep',
      label: 'Initial Step Length',
      autoApply: false,
      clientToServer: Number,
      default: 0.2,
    },
    minimumIntegrationStep: {
      name: 'MinimumIntegrationStep',
      label: 'Minimum Step Length',
      autoApply: false,
      clientToServer: Number,
      default: 0.01,
    },
    maximumIntegrationStep: {
      name: 'MaximumIntegrationStep',
      label: 'Maximum Step Length',
      autoApply: false,
      clientToServer: Number,
      default: 0.5,
    },
    maximumNumberOfSteps: {
      name: 'MaximumNumberOfSteps',
      label: 'Maximum Steps',
      autoApply: false,
      clientToServer: Number,
      default: 2000,
    },
    maximumPropagation: {
      name: 'MaximumPropagation',
      label: 'Maximum Streamline Length',
      autoApply: false,
      clientToServer: Number,
      default: 1,
    },
    terminalSpeed: {
      name: 'TerminalSpeed',
      label: 'Terminal Speed',
      autoApply: false,
      clientToServer: Number,
      default: 0.000000000001,
    },
    maximumError: {
      name: 'MaximumError',
      autoApply: false,
      clientToServer: Number,
      default: 0.000001,
    },
    computeVorticity: {
      name: 'ComputeVorticity',
      autoApply: false,
      clientToServer: bool2int,
      serverToClient: toBoolean,
      default: 1,
    },
  },
  {
    name: 'StreamTracer',
    data() {
      return {
        module,
        color: 'grey darken-2',
        allItems: ITEMS,
        contextVisibility: false,
      };
    },
    mounted() {
      if (this.create) {
        this.inputVector = this.vectorArrays[0];
        this.xSpan = [this.inputBounds[0], this.inputBounds[1]];
        this.ySpan = [this.inputBounds[2], this.inputBounds[3]];
        this.zSpan = [this.inputBounds[4], this.inputBounds[5]];
      }
    },
    beforeDestroy() {
      if (this.contextVisibility) {
        this.contextVisibility = false;
        this.updateContext();
      }
    },
    computed: {
      xSpan: {
        get() {
          const span = [this.point1[0], this.point2[0]];
          span.sort();
          return span;
        },
        set(value) {
          const p1 = this.point1.slice();
          const p2 = this.point2.slice();
          if (this.xSwap) {
            p2[0] = value[0];
            p1[0] = value[1];
          } else {
            p1[0] = value[0];
            p2[0] = value[1];
          }
          if (this.point1[0] !== p1[0]) {
            this.point1 = p1;
          }
          if (this.point2[0] !== p2[0]) {
            this.point2 = p2;
          }
        },
      },
      ySpan: {
        get() {
          const span = [this.point1[1], this.point2[1]];
          span.sort();
          return span;
        },
        set(value) {
          const p1 = this.point1.slice();
          const p2 = this.point2.slice();
          if (this.ySwap) {
            p2[1] = value[0];
            p1[1] = value[1];
          } else {
            p1[1] = value[0];
            p2[1] = value[1];
          }
          if (this.point1[1] !== p1[1]) {
            this.point1 = p1;
          }
          if (this.point2[1] !== p2[1]) {
            this.point2 = p2;
          }
        },
      },
      zSpan: {
        get() {
          const span = [this.point1[2], this.point2[2]];
          span.sort();
          return span;
        },
        set(value) {
          const p1 = this.point1.slice();
          const p2 = this.point2.slice();
          if (this.zSwap) {
            p2[2] = value[0];
            p1[2] = value[1];
          } else {
            p1[2] = value[0];
            p2[2] = value[1];
          }
          if (this.point1[2] !== p1[2]) {
            this.point1 = p1;
          }
          if (this.point2[2] !== p2[2]) {
            this.point2 = p2;
          }
        },
      },
      xSwap: {
        get() {
          return this.point1[0] > this.point2[0];
        },
        set(value) {
          const values = this.xSpan;
          const p1 = this.point1.slice();
          const p2 = this.point2.slice();
          if (value) {
            p2[0] = values[0];
            p1[0] = values[1];
          } else {
            p1[0] = values[0];
            p2[0] = values[1];
          }
          this.point1 = p1;
          this.point2 = p2;
        },
      },
      ySwap: {
        get() {
          return this.point1[1] > this.point2[1];
        },
        set(value) {
          const values = this.ySpan;
          const p1 = this.point1.slice();
          const p2 = this.point2.slice();
          if (value) {
            p2[1] = values[0];
            p1[1] = values[1];
          } else {
            p1[1] = values[0];
            p2[1] = values[1];
          }
          this.point1 = p1;
          this.point2 = p2;
        },
      },
      zSwap: {
        get() {
          return this.point1[2] > this.point2[2];
        },
        set(value) {
          const values = this.zSpan;
          const p1 = this.point1.slice();
          const p2 = this.point2.slice();
          if (value) {
            p2[2] = values[0];
            p1[2] = values[1];
          } else {
            p1[2] = values[0];
            p2[2] = values[1];
          }
          this.point1 = p1;
          this.point2 = p2;
        },
      },
      vectorArrays() {
        return this.inputArrays
          .filter((array) => array.location !== 'FIELDS' && array.size === 3)
          .map((a) => ({
            text: a.name,
            value: `${a.location}${SEPARATOR}${a.name}`,
          }));
      },
    },
    watch: {
      point1() {
        this.updateContext();
      },
      point2() {
        this.updateContext();
      },
      contextVisibility() {
        this.updateContext();
      },
    },
    methods: {
      blur(name) {
        this.$nextTick(this.$refs[name].blur);
      },
      updateContext() {
        const visible = this.contextVisibility;
        const { point1 } = this;
        const { point2 } = this;
        this.$store.dispatch('PVL_CONTEXTS_LINE', {
          visible,
          point1,
          point2,
        });
      },
      toggleContext() {
        this.contextVisibility = !this.contextVisibility;
      },
    },
  }
);
