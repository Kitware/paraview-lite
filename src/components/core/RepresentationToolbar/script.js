import { mapGetters } from 'vuex';

import vtkMath from 'vtk.js/Sources/Common/Core/Math';

import { generateComponentWithServerBinding } from 'paraview-lite/src/proxyHelper';

import CollapsableItem from 'paraview-lite/src/components/widgets/CollapsableItem';
import LookupTableToolbar from 'paraview-lite/src/components/widgets/LookupTableToolbar';
import PalettePicker from 'paraview-lite/src/components/widgets/PalettePicker';

const SEPARATOR = ':|:';
const SOLID_COLOR_ITEM = {
  text: 'Solid Color',
  value: `SOLID${SEPARATOR}${SEPARATOR}`,
};

export default generateComponentWithServerBinding(
  null,
  'Representation',
  {
    representation: {
      name: 'Representation',
      autoApply: true,
      default: 'Surface',
    },
    opacity: {
      name: 'Opacity',
      autoApply: true,
      default: 1,
    },
    pointSize: {
      name: 'PointSize',
      clientToServer: Number,
      autoApply: true,
      default: 1,
    },
    lineWidth: {
      name: 'LineWidth',
      clientToServer: Number,
      autoApply: true,
      default: 1,
    },
    diffuseColor: {
      name: 'DiffuseColor',
      clientToServer: (str) => vtkMath.hex2float(str),
      serverToClient: (float3) => vtkMath.floatRGB2HexCode(float3),
      autoApply: true,
      default: 1,
    },
  },
  {
    name: 'RepresentationToolbar',
    data() {
      return {
        SOLID_COLOR_ITEM,
        vectorComponent: 0,
      };
    },
    components: {
      CollapsableItem,
      LookupTableToolbar,
      PalettePicker,
    },
    computed: {
      lookupTable() {
        const name = this.activeProxyData.colorBy.array[1];
        const lut = this.lookupTables[name];
        return lut;
      },
      colorValue() {
        if (this.activeProxyData) {
          const [location, name, vectorComponent] =
            this.activeProxyData.colorBy.array;
          const mode =
            location && name.length && this.activeProxyData.colorBy.mode;
          this.vectorComponent = vectorComponent;

          // console.log(JSON.stringify(this.activeProxyData.colorBy, null, 2));

          if (mode !== 'array') {
            return SOLID_COLOR_ITEM;
          }

          // Fetch LookupTable for any array available
          if (!this.lookupTables[name]) {
            this.$store.dispatch('PVL_COLOR_FETCH_LOOKUP_IMAGE', name);
          }

          return {
            text: name,
            value: `${mode}${SEPARATOR}${location}${SEPARATOR}${name}`,
          };
        }
        return SOLID_COLOR_ITEM;
      },
      representationItems() {
        if (this.activeProxyData) {
          return this.activeProxyData.ui.find(
            (prop) => prop.name === 'Representation'
          ).values;
        }
        return [];
      },
      colorByItems() {
        const list = [SOLID_COLOR_ITEM];
        this.inputArrays.forEach((array) => {
          if (array.size < 4 && array.location !== 'FIELDS') {
            list.push({
              value: `array${SEPARATOR}${array.location}${SEPARATOR}${array.name}`,
              text: array.name,
            });
            // for (let i = 0; i < array.range.length; i++) {
            //   list.push(`${array.location}|${array.name}|${i - 1}`);
            // }
          }
        });
        // console.log('LIST', this.inputArrays, list.join('\n'));
        return list;
      },
      timeIndex: {
        get() {
          return this.timeActiveIdx;
        },
        set(idx) {
          this.$store.dispatch('PVL_TIME_ACTIVATE_INDEX', idx);
        },
      },
      ...mapGetters({
        lookupTables: 'PVL_COLOR_ARRAYS',
        timeValues: 'PVL_TIME_VALUES',
        timeActiveIdx: 'PVL_TIME_ACTIVE_IDX',
      }),
    },
    methods: {
      updateColor(solidColor) {
        this.diffuseColor = solidColor;
      },
      applyColor(arg) {
        if (!arg || !arg.value) {
          return;
        }
        const { value } = arg;
        const representationId = this.activeRepresentationId;
        const [colorMode, arrayLocation, arrayName] = value.split(SEPARATOR);
        const vectorMode = 'Magnitude';
        const { vectorComponent } = this;
        const rescale = true;

        this.$store.dispatch('PVL_COLOR_BY', {
          colorMode,
          representationId,
          arrayLocation,
          arrayName,
          vectorMode,
          vectorComponent,
          rescale,
        });

        this.blur('colorBy');
      },
      blur(componentName) {
        this.$nextTick(this.$refs[componentName].blur);
        // console.log(JSON.stringify(this.activeProxyData, null, 2));
      },
    },
  }
);
