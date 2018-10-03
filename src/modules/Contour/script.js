import {
  generateComponentWithServerBinding,
  bool2int,
  toBoolean,
} from 'paraview-lite/src/proxyHelper';

import module from './module';

export default generateComponentWithServerBinding(
  'Contour',
  'Source',
  {
    computeNormals: {
      name: 'ComputeNormals',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: false,
      default: 1,
    },
    computeGradients: {
      name: 'ComputeGradients',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: false,
      default: 0,
    },
    computeScalars: {
      name: 'ComputeScalars',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: false,
      default: 1,
    },
    generateTriangles: {
      name: 'GenerateTriangles',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: false,
      default: 1,
    },
    isosurfaces: {
      name: 'ContourValues',
      label: 'Isosurfaces',
      autoApply: false,
      default: [0],
    },
    contourBy: {
      name: 'SelectInputScalars',
      label: 'ContourBy',
      autoApply: false,
      clientToServer: (v) => ['POINTS', v],
      serverToClient: (v) => (v ? v[1] : ''),
      default: ['POINTS'],
    },
  },
  {
    name: 'Contour',
    data() {
      return {
        module,
        color: 'grey darken-2',
        sliderData: [0, 1, 0.5],
        computeIsoValue: false,
      };
    },
    mounted() {
      if (this.create) {
        this.computeIsoValue = true;
        this.contourBy = this.contourByArrays[0];
      }
      this.updateRange();
    },
    computed: {
      contourByArrays() {
        return this.inputArrays
          .filter((array) => array.location === 'POINTS' && array.size === 1)
          .map((a) => a.name);
      },
    },
    watch: {
      contourBy() {
        this.updateRange();
      },
    },
    methods: {
      updateData(value) {
        const iso = Number(value);
        const sliderData = this.sliderData.slice();
        sliderData[2] = iso;
        this.sliderData = sliderData;
        return iso;
      },
      updateIsoValue(value) {
        this.isosurfaces = [this.updateData(value)];
      },
      updateRange() {
        const name = this.contourBy;
        const compute = this.computeIsoValue;
        const newData = [0, 1, this.isosurfaces[0]];

        const { min, max } = this.inputArrays.find(
          (array) =>
            array.location === 'POINTS' &&
            array.size === 1 &&
            array.name === name
        ).range[0];
        const mean = (min + max) * 0.5;

        newData[0] = min;
        newData[1] = max;
        if (compute) {
          newData[2] = mean;
          this.isosurfaces = [mean];
          this.computeIsoValue = false;
        }

        this.sliderData = newData;
      },
      blur() {
        this.computeIsoValue = true;
        this.$nextTick(this.$refs.comboBox.blur);
      },
    },
  }
);
