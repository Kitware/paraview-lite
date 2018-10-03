import PalettePicker from 'paraview-lite/src/components/widgets/PalettePicker';
import vtkMath from 'vtk.js/Sources/Common/Core/Math';

import { Actions, Mutations } from 'paraview-lite/src/stores/types';

import {
  generateComponentWithServerBinding,
  bool2int,
  toBoolean,
} from 'paraview-lite/src/proxyHelper';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default generateComponentWithServerBinding(
  null, // We don't aim to create proxy
  'View',
  {
    bg: { name: 'Background', noAutoApply: true },
    bg2: { name: 'Background2', noAutoApply: true },
    gradient: { name: 'UseGradientBackground', noAutoApply: true },
    axis: {
      name: 'OrientationAxesVisibility',
      clientToServer: bool2int,
      serverToClient: toBoolean,
      autoApply: true,
    },
  },
  {
    name: 'GlobalSettings',
    components: {
      PalettePicker,
    },
    data() {
      return {
        palette: [
          '#000000',
          '#393939',
          'linear-gradient(#393939, #666666)',
          '#666666',
          'linear-gradient(#393939, #727272)',
          '#727272',
          'linear-gradient(#666666, #aaaaaa)',
          '#aaaaaa',
          '#ffffff',
          //
          'linear-gradient(#7478be, #c1c3ca)', // from 3D Slicer default
          '#c1c3ca',
          // -
          'linear-gradient(#00002a, #52576e)', // from ParaView
          '#52576e',
          // -
          '#7aba7b',
          '#66c2a5',
          '#9dd9ff',
          '#889cba',
          '#9689aa',
        ],
      };
    },
    computed: {
      darkMode: {
        get() {
          return this.$store.getters.APP_DARK_THEME;
        },
        set(value) {
          this.$store.commit(Mutations.APP_DARK_THEME_SET, value);
        },
      },
      interactiveQuality: {
        get() {
          return this.$store.getters.VIEW_QUALITY_INTERACTIVE;
        },
        set(value) {
          this.$store.commit(Mutations.VIEW_QUALITY_INTERACTIVE_SET, value);
        },
      },
      interactiveRatio: {
        get() {
          return this.$store.getters.VIEW_RATIO_INTERACTIVE;
        },
        set(value) {
          this.$store.commit(Mutations.VIEW_RATIO_INTERACTIVE_SET, value);
        },
      },
      maxFPS: {
        get() {
          return this.$store.getters.VIEW_FPS_MAX;
        },
        set(value) {
          this.$store.commit(Mutations.VIEW_FPS_MAX_SET, value);
          this.$store.commit(
            Mutations.VIEW_MOUSE_THROTTLE_SET,
            1000 / (2 * value)
          );
        },
      },
      mouseThottle() {
        return this.$store.getters.VIEW_MOUSE_THROTTLE;
      },
      showRenderingStats: {
        get() {
          return this.$store.getters.VIEW_STATS;
        },
        set(value) {
          this.$store.commit(Mutations.VIEW_STATS_SET, value);
          this.$store.dispatch(Actions.VIEW_RENDER);
        },
      },
      autoApply: {
        get() {
          return this.$store.getters.APP_AUTO_APPLY;
        },
        set(value) {
          this.$store.commit(Mutations.APP_AUTO_APPLY_SET, value);
        },
      },
      background: {
        get() {
          if (!this.bg) {
            return '#000000';
          }
          if (this.gradient) {
            return `linear-gradient(${vtkMath.floatRGB2HexCode(
              this.bg2
            )}, ${vtkMath.floatRGB2HexCode(this.bg)})`;
          }
          return vtkMath.floatRGB2HexCode(this.bg);
        },
        set(value) {
          if (value.indexOf('gradient') !== -1) {
            const values = value
              .replace(/[()]/g, '')
              .split(',')
              .map((i) => i.slice(-7))
              .map((i) => vtkMath.hex2float(i));
            this.gradient = 1;
            this.bg = values[1];
            this.bg2 = values[0];
          } else {
            this.bg = vtkMath.hex2float(value);
            this.gradient = 0;
          }
          // Apply the 3 properties at once
          this.apply();
        },
      },
    },
  }
);
