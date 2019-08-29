import { mapGetters } from 'vuex';
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
      proxies: 'PVL_PROXY_SELECTED_IDS',
      names: 'PVL_PROXY_NAME_MAP',
    })
  ),
  methods: {
    deleteProxy() {
      const id = this.proxies[0];
      this.$store.dispatch('PVL_PROXY_DELETE', id);
      this.$store.commit('PVL_PROXY_SELECTED_IDS_SET', []);
    },
  },
};
