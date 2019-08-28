import { Mutations } from 'paraview-lite/src/stores/types';

export default {
  name: 'LookupTableToolbar',
  props: {
    lookupTable: {
      type: Object,
      default: null,
    },
  },
  computed: {
    floating: {
      get() {
        return (
          this.$store.getters.PVL_COLOR_LOOKUP_TABLE_WINDOWS[
            this.lookupTable.name
          ] &&
          this.$store.getters.PVL_COLOR_LOOKUP_TABLE_WINDOWS[
            this.lookupTable.name
          ].visible
        );
      },
      set(value) {
        const obj = Object.assign(
          {
            position: [15, 65],
            orientation: 'HORIZONTAL',
          },
          this.$store.getters.PVL_COLOR_ARRAYS[this.lookupTable.name],
          this.$store.getters.PVL_COLOR_LOOKUP_TABLE_WINDOWS[
            this.lookupTable.name
          ]
        );
        obj.visible = value;
        this.$store.commit(Mutations.PVL_COLOR_LOOKUP_TABLE_WINDOWS_SET, obj);
      },
    },
  },
  methods: {
    toggleFloatingWindow() {
      this.floating = !this.floating;
    },
  },
};
