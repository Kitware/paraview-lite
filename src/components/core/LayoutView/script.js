import RepresentationToolbar from 'paraview-lite/src/components/core/RepresentationToolbar';
import VtkView from 'paraview-lite/src/components/core/View';
import { Breakpoints } from 'paraview-lite/src/constants';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

export default {
  name: 'LayoutView',
  computed: {
    smallScreen() {
      return this.$vuetify.breakpoint.width < Breakpoints.md;
    },
  },
  components: {
    RepresentationToolbar,
    VtkView,
  },
};
