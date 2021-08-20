import { mapGetters, mapActions, mapMutations } from 'vuex';

import GitTree from 'paraview-lite/src/components/widgets/GitTree';
import GlobalSettings from 'paraview-lite/src/components/core/GlobalSettings';

// ----------------------------------------------------------------------------

export default {
  name: 'ControlsDrawer',
  components: {
    GlobalSettings,
    GitTree,
  },
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {
    proxyPanel() {
      if (this.selectedSources.length === 1) {
        const proxyMeta = this.proxyToName[this.selectedSources[0]];
        if (proxyMeta) {
          return this.moduleMap[
            this.proxyToPanel[proxyMeta.name] || this.proxyToPanel.default
          ];
        }
        return this.moduleMap[this.proxyToPanel.default];
      }
      return null;
    },
    ...mapGetters({
      autoApply: 'PVL_APP_AUTO_APPLY',
      panel: 'PVL_MODULES_ACTIVE',
      pipeline: 'PVL_PROXY_PIPELINE',
      selectedSources: 'PVL_PROXY_SELECTED_IDS',
      proxyToPanel: 'PVL_PROXY_TO_MODULE_MAP',
      proxyToName: 'PVL_PROXY_NAME_MAP',
      moduleMap: 'PVL_MODULES_MAP',
      sourceToRepresentationMap: 'PVL_PROXY_SOURCE_TO_REPRESENTATION_MAP',
    }),
  },
  methods: Object.assign(
    mapActions({
      updatePipeline: 'PVL_PROXY_PIPELINE_FETCH',
      updateProxy: 'PVL_PROXY_UPDATE',
    }),
    mapMutations({
      updateSelectedSource: 'PVL_PROXY_SELECTED_IDS_SET',
    }),
    {
      updateVisibility({ id, visible }) {
        this.updateProxy([
          {
            id: this.sourceToRepresentationMap[id],
            value: visible ? 1 : 0,
            name: 'Visibility',
          },
        ]);
      },
    }
  ),
};
