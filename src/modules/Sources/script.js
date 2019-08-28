import { mapActions } from 'vuex';
import { Actions } from 'paraview-lite/src/stores/types';

import module from './module';

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'Sources',
  props: {
    sources: {
      type: Array,
      default: () => [
        // 'Box',
        'Cone',
        // 'Cylinder',
        'Sphere',
        // 'Text',
        'Wavelet',
      ],
    },
  },
  data() {
    return {
      module,
      color: 'grey darken-2',
    };
  },
  methods: Object.assign(
    {
      addSource(idx) {
        const name = this.sources[idx];
        this.createProxy({ name });
      },
    },
    mapActions({
      removeActiveModule: Actions.PVL_MODULES_ACTIVE_CLEAR,
      createProxy: Actions.PVL_PROXY_CREATE,
    })
  ),
};
