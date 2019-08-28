import { Actions } from 'paraview-lite/src/stores/types';

const PVL_NETWORK_BUFFER = {};
let networkCalls = 0;

export default {
  actions: {
    PVL_CONTEXTS_LINE({ rootState, dispatch }, { visible, point1, point2 }) {
      if (PVL_NETWORK_BUFFER.nextLineUpdate || networkCalls) {
        PVL_NETWORK_BUFFER.nextLineUpdate = { visible, point1, point2 };
        return;
      }
      const client = rootState.network.client;
      if (client) {
        networkCalls++;
        client.remote.Lite.updateLineContext(visible, point1, point2)
          .then(() => {
            networkCalls--;
            if (PVL_NETWORK_BUFFER.nextLineUpdate) {
              const arg = PVL_NETWORK_BUFFER.nextLineUpdate;
              PVL_NETWORK_BUFFER.nextLineUpdate = null;
              dispatch(Actions.PVL_CONTEXTS_LINE, arg);
            }
          })
          .catch(console.error);
      }
    },
  },
};
