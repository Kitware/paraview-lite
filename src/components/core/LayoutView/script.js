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
      quality: 'PVL_VIEW_QUALITY_INTERACTIVE',
      ratio: 'PVL_VIEW_RATIO_INTERACTIVE',
    }),
    smallScreen() {
      return this.$vuetify.breakpoint.width < Breakpoints.md;
    },
  },
  watch: {
    quality(q) {
      this.$refs.remoteView.setInteractiveQuality(q);
    }
  },
  components: {
    RepresentationToolbar,
    // VtkView,
  },
};
