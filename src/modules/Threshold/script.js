import {
  generateComponentWithServerBinding,
  bool2int,
  toBoolean,
} from 'paraview-lite/src/proxyHelper';

import module from './module';

const SEPARATOR = ':|:';
const DEFAULT_RANGE = { min: 0, max: 1 };

export default generateComponentWithServerBinding(
  'Threshold',
  'Source',
  {
    thresholdBy: {
      name: 'SelectInputScalars',
      label: 'Scalars',
      clientToServer: ({ value }) => value.split(SEPARATOR),
      serverToClient: (v) => ({ text: v[1], value: v.join(SEPARATOR) }),
      autoApply: false,
      default: ['POINTS', ''],
    },
    thresholdRange: {
      name: 'ThresholdBetween',
      label: 'ThresholdRange',
      autoApply: false,
      default: [0, 1],
    },
    allScalars: {
      name: 'AllScalars',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: false,
      default: 1,
    },
    useContinuousCellRange: {
      name: 'UseContinuousCellRange',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: false,
      default: 0,
    },
  },
  {
    name: 'Threshold',
    data() {
      return {
        module,
        color: 'grey darken-2',
        dataRange: [0, 1],
        localRange: [0, 1],
        resetThresholdValues: false,
      };
    },
    mounted() {
      if (this.create) {
        this.resetThresholdValues = true;
        this.thresholdBy = this.thresholdByArrays[0];
      }
      this.updateRange();
    },
    computed: {
      thresholdByArrays() {
        return this.inputArrays
          .filter((array) => array.location !== 'FIELDS' && array.size === 1)
          .map((a) => ({
            text: a.name,
            value: `${a.location}${SEPARATOR}${a.name}`,
          }));
      },
    },
    watch: {
      thresholdBy() {
        this.updateRange();
      },
      inputArrays() {
        this.updateRange();
      },
      thresholdRange() {
        this.localRange = this.thresholdRange.slice();
      },
    },
    methods: {
      updateData(values, idx) {
        let newRange = this.localRange.slice();
        if (Array.isArray(values)) {
          newRange = values.slice();
        } else {
          newRange[idx] = Number(values);
        }
        this.localRange = newRange;
        return newRange;
      },
      pushData() {
        this.thresholdRange = this.localRange.slice();
      },
      updateRange() {
        const [location, name] = this.thresholdBy.value.split(SEPARATOR);
        const compute = this.resetThresholdValues;
        const newData = [0, 1];
        const activeArray = this.inputArrays.find(
          (array) => array.location === location && array.name === name
        );
        const { min, max } = activeArray ? activeArray.range[0] : DEFAULT_RANGE;

        newData[0] = min;
        newData[1] = max;
        if (compute) {
          this.localRange = [min, max];
          this.thresholdRange = [min, max];
          this.resetThresholdValues = false;
        }

        this.dataRange = newData;
      },
      blur() {
        this.resetThresholdValues = true;
        this.$nextTick(this.$refs.comboBox.blur);
      },
    },
  }
);
