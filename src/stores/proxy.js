function getInputRepresentation(repStr) {
  switch (repStr) {
    case '3D Glyphs':
    case 'Feature Edges':
    case 'Outline':
    case 'Point Gaussian':
    case 'Points':
    case 'Wireframe':
      return repStr;
    case 'Surface':
    case 'Surface With Edges':
    case 'Volume':
    default:
      return 'Outline';
  }
}

export default {
  state: {
    selectedSources: [], // list of ids of the selected sources
    pipeline: [], // pipeline list
    proxyToModuleMap: {}, // xmlName(string) => moduleName(string)
    sourceToRepresentationMap: {}, // id(string) => id(string)
    proxyDataMap: {}, // id(string) => { data, properties, ui, id }
    proxyNames: {}, // id(string) => { group(str), name(str), label(str) }
  },
  getters: {
    PVL_PROXY_SELECTED_IDS(state) {
      return state.selectedSources;
    },
    PVL_PROXY_PIPELINE(state) {
      return state.pipeline;
    },
    PVL_PROXY_TO_MODULE_MAP(state) {
      return state.proxyToModuleMap;
    },
    PVL_PROXY_SOURCE_TO_REPRESENTATION_MAP(state) {
      return state.sourceToRepresentationMap;
    },
    PVL_PROXY_DATA_MAP(state) {
      return state.proxyDataMap;
    },
    PVL_PROXY_NAME_MAP(state) {
      return state.proxyNames;
    },
  },
  mutations: {
    PVL_PROXY_SELECTED_IDS_SET(state, idList) {
      state.selectedSources = idList.slice();
    },
    PVL_PROXY_PIPELINE_SET(state, sources) {
      state.pipeline = sources;
    },
    PVL_PROXY_MODULE_BIND(state, { name, module }) {
      state.proxyToModuleMap[name] = module;
    },
    PVL_PROXY_SOURCE_TO_REPRESENTATION_SET(state, { id, rep }) {
      state.sourceToRepresentationMap = Object.assign(
        {},
        state.sourceToRepresentationMap,
        { [id]: rep }
      );
    },
    PVL_PROXY_DATA_SET(state, proxy) {
      const newValue = Object.assign({}, state.proxyDataMap[proxy.id], proxy);
      state.proxyDataMap = Object.assign({}, state.proxyDataMap, {
        [proxy.id]: newValue,
      });
    },
    PVL_PROXY_NAME_SET(state, proxyMeta) {
      state.proxyNames = Object.assign({}, state.proxyNames, {
        [proxyMeta.id]: proxyMeta,
      });
    },
  },
  actions: {
    PVL_PROXY_CREATE(
      { state, getters, commit, dispatch },
      { name, parentId, initialValues, skipDomain, subProxyValues }
    ) {
      // console.log(
      //   'CREATE',
      //   JSON.stringify(
      //     { name, parentId, initialValues, subProxyValues },
      //     null,
      //     2
      //   )
      // );
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.getRemote().ProxyManager.create(
          name,
          parentId,
          initialValues,
          skipDomain,
          subProxyValues
        )
          .then((proxy) => {
            // Handle replaceInput hint
            if (proxy.hints && proxy.hints.replaceInput !== undefined) {
              const rep =
                state.proxyDataMap[state.sourceToRepresentationMap[parentId]];
              if (rep && proxy.hints.replaceInput === 2) {
                const changeset = rep.properties.filter(
                  (p) => p.name === 'Representation'
                );
                changeset[0].value = getInputRepresentation(
                  changeset[0].value,
                  proxy.hints.replaceInput
                );
                dispatch('PVL_PROXY_UPDATE', changeset);
              }
            }

            // Fetch new data
            commit('PVL_PROXY_DATA_SET', proxy);
            commit('PVL_PROXY_SELECTED_IDS_SET', [proxy.id]);
            dispatch('PVL_PROXY_PIPELINE_FETCH');
            dispatch('PVL_MODULES_ACTIVE_CLEAR');

            // Make sure we pull the actual server values
            dispatch('PVL_PROXY_DATA_FETCH', { proxyId: proxy.id });
          })
          .catch(console.error);
      }
    },
    PVL_PROXY_UPDATE({ getters, dispatch }, changeset) {
      // console.log('UPDATE', JSON.stringify(changeset, null, 2));
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        // const idToUpdate = new Set(changeset.map((i) => i.id));
        client.getRemote().ProxyManager.update(changeset)
          .then(() => {
            // idToUpdate.forEach((id) => {
            //   dispatch(Actions.PVL_PROXY_DATA_FETCH, id, false);
            // });
            dispatch('PVL_PROXY_PIPELINE_FETCH');
          })
          .catch(console.error);
      }
    },
    PVL_PROXY_DELETE({ getters, dispatch }, id) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.getRemote().ProxyManager.delete(id)
          .then((/* { sources, view } */) => {
            dispatch('PVL_PROXY_PIPELINE_FETCH');
            dispatch('PVL_TIME_FETCH_VALUES');
          })
          .catch(console.error);
      }
    },
    PVL_PROXY_NAME_FETCH({ getters, commit }, id) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.getRemote().Lite.getProxyName(id)
          .then((info) => {
            commit('PVL_PROXY_NAME_SET', info);
          })
          .catch(console.error);
      }
    },
    PVL_PROXY_PIPELINE_FETCH({ state, getters, commit, dispatch }) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.getRemote().ProxyManager.list()
          .then(({ sources, view }) => {
            commit('PVL_PROXY_PIPELINE_SET', sources);
            commit('PVL_VIEW_ID_SET', view);

            // Fetch view data if first time
            if (!state.proxyDataMap[view]) {
              dispatch('PVL_PROXY_DATA_FETCH', { proxyId: view });
            }

            // Update source -> rep mapping
            sources.forEach((proxy) => {
              commit('PVL_PROXY_SOURCE_TO_REPRESENTATION_SET', proxy);

              // Fetch proxy data if not available
              if (!state.proxyDataMap[proxy.id]) {
                dispatch('PVL_PROXY_DATA_FETCH', { proxyId: proxy.id });
              }

              // Fetch proxy name if not available
              if (!state.proxyNames[proxy.id]) {
                dispatch('PVL_PROXY_NAME_FETCH', proxy.id);
              }

              // Fetch representation data if not available
              if (!state.proxyDataMap[proxy.rep]) {
                dispatch('PVL_PROXY_DATA_FETCH', { proxyId: proxy.rep });
              }

              // Fetch representation name if not available
              if (!state.proxyNames[proxy.rep]) {
                dispatch('PVL_PROXY_NAME_FETCH', proxy.rep);
              }
            });

            // If only one source trigger a reset camera
            if (sources.length === 1) {
              dispatch('PVL_VIEW_RESET_CAMERA');
            }

            // Fetch new time values
            dispatch('PVL_TIME_FETCH_VALUES');
          })
          .catch(console.error);
      }
    },
    PVL_PROXY_DATA_FETCH({ getters, commit }, { proxyId, needUI = true }) {
      // console.log('fetch', proxyId, needUI);
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.getRemote().ProxyManager.get(proxyId, needUI)
          .then((proxy) => {
            commit('PVL_PROXY_DATA_SET', proxy);
          })
          .catch(console.error);
      }
    },
    PVL_PROXY_DATA_REFETCH({ getters, commit, state }) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        const proxies = state.pipeline;
        for (let i = 0; i < proxies.length; i++) {
          client.getRemote().ProxyManager.get(proxies[i].id, false)
            .then((proxy) => {
              commit('PVL_PROXY_DATA_SET', proxy);
            })
            .catch(console.error);
        }
      }
    },
  },
};
