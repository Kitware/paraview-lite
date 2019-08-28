import { mapGetters, mapActions } from 'vuex';
import { Getters, Actions } from 'paraview-lite/src/stores/types';

export default {
  name: 'ActionModules',
  props: {
    smallScreen: {
      default: false,
    },
  },
  computed: mapGetters({
    modules: Getters.PVL_MODULES_LIST,
    activeSources: Getters.PVL_PROXY_SELECTED_IDS,
    proxyDataMap: Getters.PVL_PROXY_DATA_MAP,
    proxyPipeline: Getters.PVL_PROXY_PIPELINE,
  }),
  methods: mapActions({
    activate: Actions.PVL_MODULES_ACTIVE_BY_NAME,
  }),
};
