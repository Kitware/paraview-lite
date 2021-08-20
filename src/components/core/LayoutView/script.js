import RepresentationToolbar from 'paraview-lite/src/components/core/RepresentationToolbar';
// import VtkView from 'paraview-lite/src/components/core/View';
import { Breakpoints } from 'paraview-lite/src/constants';
import { mapGetters } from 'vuex';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

export default {
  name: 'LayoutView',
  computed: {
    ...mapGetters({
      wsClient: 'PVL_NETWORK_CLIENT',
      viewId: 'PVL_VIEW_ID',
    }),
    smallScreen() {
      return this.$vuetify.breakpoint.width < Breakpoints.md;
    },
  },
  components: {
    RepresentationToolbar,
    // VtkView,
  },
};
