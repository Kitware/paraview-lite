/* eslint-disable no-unused-vars */
import { Mutations, Actions } from 'paraview-lite/src/stores/types';

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
    PVL_TIME_FETCH_VALUES({ rootState, state, dispatch, commit }) {
      const client = rootState.network.client;
      if (client) {
        client.remote.TimeHandler.getTimeValues()
          .then((times) => {
            if (
              times.length &&
              times.length !== state.values.length &&
              times[0] !== state.values[0] &&
              times[times.length - 1] !== state.values[times.length - 1]
            ) {
              commit(Mutations.PVL_TIME_VALUES_SET, times);
              if (state.activeIndex < 0 || state.activeIndex >= times.length) {
                dispatch(Actions.PVL_TIME_ACTIVATE_INDEX, 0);
              }
            }
          })
          .catch(console.error);
      }
    },
    PVL_TIME_FETCH_ACTIVE_INDEX({ rootState, commit }) {
      const client = rootState.network.client;
      if (client) {
        client.remote.TimeHandler.getTimeStep().then((idx) => {
          commit(Mutations.PVL_TIME_ACTIVE_IDX_SET, idx);
        });
      }
    },
    PVL_TIME_ACTIVATE_INDEX({ rootState, state, commit, dispatch }, timeIndex) {
      const client = rootState.network.client;
      if (client) {
        commit(Mutations.PVL_TIME_ACTIVE_IDX_SET, timeIndex);
        if (state.busy) {
          state.busyTask.activeIdx = timeIndex;
        } else {
          state.busy = true;
          client.remote.TimeHandler.setTimeStep(timeIndex).then(() => {
            dispatch(Actions.PVL_PROXY_DATA_REFETCH);
            state.busy = false;
            if (state.busyTask.activeIdx !== undefined) {
              const idx = state.busyTask.activeIdx;
              delete state.busyTask.activeIdx;
              dispatch(Actions.PVL_TIME_ACTIVATE_INDEX, idx);
            }
          });
        }
      }
    },
  },
};
