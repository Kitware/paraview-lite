import { mapGetters } from 'vuex';
import { Getters, Actions, Mutations } from 'paraview-lite/src/stores/types';

import module from './module';

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'DefaultModule',
  data() {
    return {
      module,
      color: 'grey darken-2',
    };
  },
  computed: Object.assign(
    {
      name() {
        const nameMeta = this.names[this.proxies[0]];
        return nameMeta ? nameMeta.label : 'No name';
      },
    },
    mapGetters({
      proxies: Getters.PROXY_SELECTED_IDS,
      names: Getters.PROXY_NAME_MAP,
    })
  ),
  methods: {
    deleteProxy() {
      const id = this.proxies[0];
      this.$store.dispatch(Actions.PROXY_DELETE, id);
      this.$store.commit(Mutations.PROXY_SELECTED_IDS_SET, []);
    },
  },
};
