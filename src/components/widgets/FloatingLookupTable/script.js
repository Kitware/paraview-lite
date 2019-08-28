import { Actions } from 'paraview-lite/src/stores/types';

export default {
  name: 'FloatingLookupTable',
  props: {
    floatingWindow: {
      type: Object,
      default: null,
    },
    lookupTable: {
      type: Object,
      default: null,
    },
    dataFields: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dragging: false,
      dragInfo: {},
      advanced: false,
      showPresets: false,
    };
  },
  created() {
    this.onMouseRelease = () => {
      this.dragging = false;
      document.removeEventListener('mouseup', this.onMouseRelease);
      document.removeEventListener('mousemove', this.onMouseMove);
    };
    this.onMouseMove = (e) => {
      if (this.dragging) {
        const { clientX, clientY } = e;
        this.floatingWindow.position = [
          this.dragInfo.x + clientX - this.dragInfo.clientX,
          this.dragInfo.y + clientY - this.dragInfo.clientY,
        ];
      }
    };
  },
  computed: {
    presets() {
      return Object.values(this.$store.getters.PVL_COLOR_PRESETS);
    },
    darkMode() {
      return this.$store.getters.PVL_APP_DARK_THEME;
    },
  },
  methods: {
    onMousePress(e) {
      this.dragInfo = {
        x: this.floatingWindow.position[0],
        y: this.floatingWindow.position[1],
        clientX: e.clientX,
        clientY: e.clientY,
      };
      this.dragging = true;
      document.addEventListener('mouseup', this.onMouseRelease);
      document.addEventListener('mousemove', this.onMouseMove);
    },
    close() {
      this.floatingWindow.visible = false;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    togglePresets() {
      this.showPresets = !this.showPresets;
    },
    usePreset(presetName) {
      const arrayName = this.lookupTable.name;
      this.$store.dispatch(Actions.PVL_COLOR_APPLY_PRESET, {
        presetName,
        arrayName,
      });
    },
    updateDataRange() {
      this.lookupTable.range = this.lookupTable.range.map(Number);
      const range = this.lookupTable.range.slice();
      const name = this.lookupTable.name;
      this.$store.dispatch(Actions.PVL_COLOR_CUSTOM_DATA_RANGE, {
        name,
        range,
      });
    },
    resetDataRange() {
      const name = this.lookupTable.name;
      const dataRanges = this.dataFields[name];
      if (dataRanges) {
        const range = [dataRanges[0].min, dataRanges[0].max];
        this.$store.dispatch(Actions.PVL_COLOR_CUSTOM_DATA_RANGE, {
          name,
          range,
        });
        this.lookupTable.range = range;
      }
    },
  },
};
