import { mapGetters, mapActions, mapMutations } from 'vuex';
import { Getters, Actions, Mutations } from 'paraview-lite/src/stores/types';

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
  computed: Object.assign(
    {
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
    },
    mapGetters({
      autoApply: Getters.APP_AUTO_APPLY,
      panel: Getters.MODULES_ACTIVE,
      pipeline: Getters.PROXY_PIPELINE,
      selectedSources: Getters.PROXY_SELECTED_IDS,
      proxyToPanel: Getters.PROXY_TO_MODULE_MAP,
      proxyToName: Getters.PROXY_NAME_MAP,
      moduleMap: Getters.MODULES_MAP,
      sourceToRepresentationMap: Getters.PROXY_SOURCE_TO_REPRESENTATION_MAP,
    })
  ),
  methods: Object.assign(
    mapActions({
      updatePipeline: Actions.PROXY_PIPELINE_FETCH,
      updateProxy: Actions.PROXY_UPDATE,
    }),
    mapMutations({
      updateSelectedSource: Mutations.PROXY_SELECTED_IDS_SET,
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
