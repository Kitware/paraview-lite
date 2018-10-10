/* eslint-disable no-unused-vars */
import { Mutations, Actions } from 'paraview-lite/src/stores/types';

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
    PROXY_SELECTED_IDS(state) {
      return state.selectedSources;
    },
    PROXY_PIPELINE(state) {
      return state.pipeline;
    },
    PROXY_TO_MODULE_MAP(state) {
      return state.proxyToModuleMap;
    },
    PROXY_SOURCE_TO_REPRESENTATION_MAP(state) {
      return state.sourceToRepresentationMap;
    },
    PROXY_DATA_MAP(state) {
      return state.proxyDataMap;
    },
    PROXY_NAME_MAP(state) {
      return state.proxyNames;
    },
  },
  mutations: {
    PROXY_SELECTED_IDS_SET(state, idList) {
      state.selectedSources = idList.slice();
    },
    PROXY_PIPELINE_SET(state, sources) {
      state.pipeline = sources;
    },
    PROXY_MODULE_BIND(state, { name, module }) {
      state.proxyToModuleMap[name] = module;
    },
    PROXY_SOURCE_TO_REPRESENTATION_SET(state, { id, rep }) {
      state.sourceToRepresentationMap = Object.assign(
        {},
        state.sourceToRepresentationMap,
        { [id]: rep }
      );
    },
    PROXY_DATA_SET(state, proxy) {
      const newValue = Object.assign({}, state.proxyDataMap[proxy.id], proxy);
      state.proxyDataMap = Object.assign({}, state.proxyDataMap, {
        [proxy.id]: newValue,
      });
    },
    PROXY_NAME_SET(state, proxyMeta) {
      state.proxyNames = Object.assign({}, state.proxyNames, {
        [proxyMeta.id]: proxyMeta,
      });
    },
  },
  actions: {
    PROXY_CREATE(
      { rootState, commit, dispatch },
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
      const client = rootState.network.client;
      if (client) {
        client.remote.ProxyManager.create(
          name,
          parentId,
          initialValues,
          skipDomain,
          subProxyValues
        )
          .then((proxy) => {
            commit(Mutations.PROXY_DATA_SET, proxy);
            commit(Mutations.PROXY_SELECTED_IDS_SET, [proxy.id]);
            dispatch(Actions.PROXY_PIPELINE_FETCH);
            dispatch(Actions.MODULES_ACTIVE_CLEAR);

            // Make sure we pull the actual server values
            dispatch(Actions.PROXY_DATA_FETCH, { proxyId: proxy.id });
          })
          .catch(console.error);
      }
    },
    PROXY_UPDATE({ rootState, state, dispatch }, changeset) {
      // console.log('UPDATE', JSON.stringify(changeset, null, 2));
      const client = rootState.network.client;
      if (client) {
        // const idToUpdate = new Set(changeset.map((i) => i.id));
        client.remote.ProxyManager.update(changeset)
          .then((result) => {
            // idToUpdate.forEach((id) => {
            //   dispatch(Actions.PROXY_DATA_FETCH, id, false);
            // });
            dispatch(Actions.PROXY_PIPELINE_FETCH);
          })
          .catch(console.error);
      }
    },
    PROXY_DELETE({ dispatch, rootState }, id) {
      const client = rootState.network.client;
      if (client) {
        client.remote.ProxyManager.delete(id)
          .then(({ sources, view }) => {
            dispatch(Actions.PROXY_PIPELINE_FETCH);
            dispatch(Actions.TIME_FETCH_VALUES);
          })
          .catch(console.error);
      }
    },
    PROXY_NAME_FETCH({ rootState, commit }, id) {
      const client = rootState.network.client;
      if (client) {
        client.remote.Lite.getProxyName(id)
          .then((info) => {
            commit(Mutations.PROXY_NAME_SET, info);
          })
          .catch(console.error);
      }
    },
    PROXY_PIPELINE_FETCH({ rootState, state, commit, dispatch }) {
      const client = rootState.network.client;
      if (client) {
        client.remote.ProxyManager.list()
          .then(({ sources, view }) => {
            commit(Mutations.PROXY_PIPELINE_SET, sources);
            commit(Mutations.VIEW_ID_SET, view);

            // Fetch view data if first time
            if (!state.proxyDataMap[view]) {
              dispatch(Actions.PROXY_DATA_FETCH, { proxyId: view });
            }

            // Update source -> rep mapping
            sources.forEach((proxy) => {
              commit(Mutations.PROXY_SOURCE_TO_REPRESENTATION_SET, proxy);

              // Fetch proxy data if not available
              if (!state.proxyDataMap[proxy.id]) {
                dispatch(Actions.PROXY_DATA_FETCH, { proxyId: proxy.id });
              }

              // Fetch proxy name if not available
              if (!state.proxyNames[proxy.id]) {
                dispatch(Actions.PROXY_NAME_FETCH, proxy.id);
              }

              // Fetch representation data if not available
              if (!state.proxyDataMap[proxy.rep]) {
                dispatch(Actions.PROXY_DATA_FETCH, { proxyId: proxy.rep });
              }

              // Fetch representation name if not available
              if (!state.proxyNames[proxy.rep]) {
                dispatch(Actions.PROXY_NAME_FETCH, proxy.rep);
              }
            });

            // If only one source trigger a reset camera
            if (sources.length === 1) {
              dispatch(Actions.VIEW_RESET_CAMERA);
            }

            // Fetch new time values
            dispatch(Actions.TIME_FETCH_VALUES);
          })
          .catch(console.error);
      }
    },
    PROXY_DATA_FETCH({ rootState, commit, state }, { proxyId, needUI = true }) {
      // console.log('fetch', proxyId, needUI);
      const client = rootState.network.client;
      if (client) {
        client.remote.ProxyManager.get(proxyId, needUI)
          .then((proxy) => {
            commit(Mutations.PROXY_DATA_SET, proxy);
          })
          .catch(console.error);
      }
    },
    PROXY_DATA_REFETCH({ rootState, commit, state }) {
      const client = rootState.network.client;
      if (client) {
        const proxies = state.pipeline;
        for (let i = 0; i < proxies.length; i++) {
          client.remote.ProxyManager.get(proxies[i].id, false)
            .then((proxy) => {
              commit(Mutations.PROXY_DATA_SET, proxy);
            })
            .catch(console.error);
        }
      }
    },
  },
};
