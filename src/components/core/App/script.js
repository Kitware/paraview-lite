import { mapGetters } from 'vuex';
import RootNode from 'paraview-lite/src/components/core/RootNode';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'PVLiteApp',
  components: {
    RootNode,
  },
  computed: mapGetters({
    darkMode: 'PVL_APP_DARK_THEME',
  }),
};
