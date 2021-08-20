import PalettePicker from 'paraview-lite/src/components/widgets/PalettePicker';
import vtkMath from 'vtk.js/Sources/Common/Core/Math';

import { generateComponentWithServerBinding } from 'paraview-lite/src/proxyHelper';

const BG_SOLID = 0; // 'Single Color';
const BG_GRADIENT = 1; // 'Gradient';

function storeItem(key, value) {
  window.localStorage.setItem(
    `paraview.lite.config.${key.name}`,
    key.set(value)
  );
}

function retreiveItem(key, defaultValue) {
  const vStr = window.localStorage.getItem(`paraview.lite.config.${key.name}`);
  if (vStr === undefined || vStr === null) {
    return defaultValue || key.defaultValue;
  }
  return key.get(vStr);
}

function booleanSet(v) {
  return v ? '1' : '0';
}

function booleanGet(v) {
  return !!Number(v);
}

function numberSet(v) {
  return `${v}`;
}

function numberGet(v) {
  return Number(v);
}

const KEYS = {
  DARK_MODE: {
    name: 'darkmode',
    set: booleanSet,
    get: booleanGet,
    defaultValue: false,
    variable: 'darkMode',
  },
  AUTO_APPLY: {
    name: 'autoapply',
    set: booleanSet,
    get: booleanGet,
    defaultValue: true,
    variable: 'autoApply',
  },
  MAX_FPS: {
    name: 'fps',
    set: numberSet,
    get: numberGet,
    defaultValue: 30,
    variable: 'maxFPS',
  },
  MOUSE_THROTTLE: {
    name: 'throttle',
    set: numberSet,
    get: numberGet,
    defaultValue: 16.6,
    variable: 'mouseThottle',
  },
  RATIO: {
    name: 'ratio',
    set: numberSet,
    get: numberGet,
    defaultValue: 1,
    variable: 'interactiveRatio',
  },
  QUALITY: {
    name: 'quality',
    set: numberSet,
    get: numberGet,
    defaultValue: 80,
    variable: 'interactiveQuality',
  },
};

// function purgeLocalStorage() {
//   Object.values(KEYS).forEach(({ name }) => {
//     localStorage.removeItem(`paraview.lite.config.${name}`);
//   });
// }

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default generateComponentWithServerBinding(
  null, // We don't aim to create proxy
  'View',
  {
    bg: { name: 'Background', noAutoApply: true },
    bg2: { name: 'Background2', noAutoApply: true },
    gradient: { name: 'BackgroundColorMode', noAutoApply: true },
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
    methods: {
      wrapGet(storeGetKey, storeSetKey, storageKey) {
        const originalValue = this.$store.getters[storeGetKey];
        const value = retreiveItem(KEYS[storageKey], originalValue);
        if (value !== originalValue) {
          this.$store.commit(storeSetKey, value);
        }
        return value;
      },
      wrapSet(storeSetKey, storageKey, value) {
        storeItem(KEYS[storageKey], value);
        this.$store.commit(storeSetKey, value);
      },
      resetSettings() {
        Object.values(KEYS).forEach(({ variable, defaultValue }) => {
          this[variable] = defaultValue;
        });
      },
    },
    computed: {
      hasChanges() {
        let changeDetected = false;
        Object.values(KEYS).forEach(({ variable, defaultValue }) => {
          if (this[variable] !== defaultValue) {
            changeDetected = true;
          }
        });
        return changeDetected;
      },
      darkMode: {
        get() {
          return this.wrapGet(
            'PVL_APP_DARK_THEME',
            'PVL_APP_DARK_THEME_SET',
            'DARK_MODE'
          );
        },
        set(value) {
          return this.wrapSet('PVL_APP_DARK_THEME_SET', 'DARK_MODE', value);
        },
      },
      interactiveQuality: {
        get() {
          return this.wrapGet(
            'PVL_VIEW_QUALITY_INTERACTIVE',
            'PVL_VIEW_QUALITY_INTERACTIVE_SET',
            'QUALITY'
          );
        },
        set(value) {
          this.wrapSet('PVL_VIEW_QUALITY_INTERACTIVE_SET', 'QUALITY', value);
        },
      },
      interactiveRatio: {
        get() {
          return this.wrapGet(
            'PVL_VIEW_RATIO_INTERACTIVE',
            'PVL_VIEW_RATIO_INTERACTIVE_SET',
            'RATIO'
          );
        },
        set(value) {
          this.wrapSet('PVL_VIEW_RATIO_INTERACTIVE_SET', 'RATIO', value);
        },
      },
      maxFPS: {
        get() {
          return this.wrapGet(
            'PVL_VIEW_FPS_MAX',
            'PVL_VIEW_FPS_MAX_SET',
            'MAX_FPS'
          );
        },
        set(value) {
          this.wrapSet('PVL_VIEW_FPS_MAX_SET', 'MAX_FPS', value);
          this.mouseThottle = 1000 / (2 * value);
        },
      },
      mouseThottle: {
        get() {
          return this.wrapGet(
            'PVL_VIEW_MOUSE_THROTTLE',
            'PVL_VIEW_MOUSE_THROTTLE_SET',
            'MOUSE_THROTTLE'
          );
        },
        set(value) {
          this.wrapSet('PVL_VIEW_MOUSE_THROTTLE_SET', 'MOUSE_THROTTLE', value);
        },
      },
      showRenderingStats: {
        get() {
          return this.$store.getters.PVL_VIEW_STATS;
        },
        set(value) {
          this.$store.commit('PVL_VIEW_STATS_SET', value);
          this.$store.dispatch('PVL_VIEW_RENDER');
        },
      },
      autoApply: {
        get() {
          return this.wrapGet(
            'PVL_APP_AUTO_APPLY',
            'PVL_APP_AUTO_APPLY_SET',
            'AUTO_APPLY'
          );
        },
        set(value) {
          this.wrapSet('PVL_APP_AUTO_APPLY_SET', 'AUTO_APPLY', value);
        },
      },
      background: {
        get() {
          if (!this.bg) {
            return '#000000';
          }
          if (this.gradient === BG_GRADIENT) {
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
            this.gradient = BG_GRADIENT;
            this.bg = values[1];
            this.bg2 = values[0];
          } else {
            this.bg = vtkMath.hex2float(value);
            this.gradient = BG_SOLID;
          }
          // Apply the 3 properties at once
          this.apply();
        },
      },
    },
  }
);
