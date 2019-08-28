import Client from 'paraview-lite/src/io/Client';
import { Mutations, Actions } from 'paraview-lite/src/stores/types';

export default {
  state: {
    client: null,
    config: null,
  },
  getters: {
    PVL_NETWORK_CLIENT(state) {
      return state.client;
    },
    PVL_NETWORK_CONFIG(state) {
      return state.config;
    },
  },
  mutations: {
    PVL_NETWORK_CLIENT_SET(state, client) {
      state.client = client;
    },
    PVL_NETWORK_CONFIG_SET(state, config) {
      state.config = config;
    },
  },
  actions: {
    PVL_NETWORK_CONNECT({ commit, dispatch, state }) {
      const { config, client } = state;
      if (client && client.isConnected()) {
        client.disconnect();
      }
      const clientToConnect = client || new Client();

      clientToConnect.setBusyCallback((count) => {
        commit(Mutations.PVL_BUSY_COUNT_SET, count);
      });

      clientToConnect.updateBusy(+1);

      clientToConnect.setConnectionErrorCallback((type, httpReq) => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          `Connection ${type}`;
        console.error(message);
        console.log(httpReq);
      });

      clientToConnect
        .connect(config)
        .then((validClient) => {
          commit(Mutations.PVL_NETWORK_CLIENT_SET, validClient);
          dispatch(Actions.PVL_TIME_FETCH_ACTIVE_INDEX);
          dispatch(Actions.PVL_PROXY_PIPELINE_FETCH);
          dispatch(Actions.PVL_APP_ROUTE_RUN);
          dispatch(Actions.PVL_COLOR_FETCH_PRESET_NAMES, 500);
          clientToConnect.updateBusy(-1);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
