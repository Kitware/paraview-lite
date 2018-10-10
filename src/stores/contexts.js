import { Actions } from 'paraview-lite/src/stores/types';

const NETWORK_BUFFER = {};
let networkCalls = 0;

export default {
  actions: {
    CONTEXTS_LINE({ rootState, dispatch }, { visible, point1, point2 }) {
      if (NETWORK_BUFFER.nextLineUpdate || networkCalls) {
        NETWORK_BUFFER.nextLineUpdate = { visible, point1, point2 };
        return;
      }
      const client = rootState.network.client;
      if (client) {
        networkCalls++;
        client.remote.Lite.updateLineContext(visible, point1, point2)
          .then(() => {
            networkCalls--;
            if (NETWORK_BUFFER.nextLineUpdate) {
              const arg = NETWORK_BUFFER.nextLineUpdate;
              NETWORK_BUFFER.nextLineUpdate = null;
              dispatch(Actions.CONTEXTS_LINE, arg);
            }
          })
          .catch(console.error);
      }
    },
  },
};
