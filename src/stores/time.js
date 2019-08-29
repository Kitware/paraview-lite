export default {
  state: {
    values: [],
    activeIndex: 0,
    busy: false,
    busyTask: {},
  },
  getters: {
    PVL_TIME_VALUES(state) {
      return state.values;
    },
    PVL_TIME_ACTIVE_IDX(state) {
      return state.activeIndex;
    },
    PVL_TIME_ACTIVE_VALUE(state) {
      return state.values[state.activeIndex];
    },
  },
  mutations: {
    PVL_TIME_VALUES_SET(state, values) {
      state.values = values;
    },
    PVL_TIME_ACTIVE_IDX_SET(state, idx) {
      state.activeIndex = idx;
    },
  },
  actions: {
    PVL_TIME_FETCH_VALUES({ getters, state, dispatch, commit }) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.remote.TimeHandler.getTimeValues()
          .then((times) => {
            if (
              times.length &&
              times.length !== state.values.length &&
              times[0] !== state.values[0] &&
              times[times.length - 1] !== state.values[times.length - 1]
            ) {
              commit('PVL_TIME_VALUES_SET', times);
              if (state.activeIndex < 0 || state.activeIndex >= times.length) {
                dispatch('PVL_TIME_ACTIVATE_INDEX', 0);
              }
            }
          })
          .catch(console.error);
      }
    },
    PVL_TIME_FETCH_ACTIVE_INDEX({ getters, commit }) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.remote.TimeHandler.getTimeStep().then((idx) => {
          commit('PVL_TIME_ACTIVE_IDX_SET', idx);
        });
      }
    },
    PVL_TIME_ACTIVATE_INDEX({ getters, state, commit, dispatch }, timeIndex) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        commit('PVL_TIME_ACTIVE_IDX_SET', timeIndex);
        if (state.busy) {
          state.busyTask.activeIdx = timeIndex;
        } else {
          state.busy = true;
          client.remote.TimeHandler.setTimeStep(timeIndex).then(() => {
            dispatch('PVL_PROXY_DATA_REFETCH');
            state.busy = false;
            if (state.busyTask.activeIdx !== undefined) {
              const idx = state.busyTask.activeIdx;
              delete state.busyTask.activeIdx;
              dispatch('PVL_TIME_ACTIVATE_INDEX', idx);
            }
          });
        }
      }
    },
  },
};
