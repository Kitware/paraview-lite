import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ActionModules',
  props: {
    smallScreen: {
      default: false,
    },
  },
  computed: mapGetters({
    modules: 'PVL_MODULES_LIST',
    activeSources: 'PVL_PROXY_SELECTED_IDS',
    proxyDataMap: 'PVL_PROXY_DATA_MAP',
    proxyPipeline: 'PVL_PROXY_PIPELINE',
  }),
  methods: mapActions({
    activate: 'PVL_MODULES_ACTIVE_BY_NAME',
  }),
};
