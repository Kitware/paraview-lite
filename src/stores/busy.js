/* eslint-disable no-unused-vars */
import { Mutations } from 'paraview-lite/src/stores/types';

export default {
  state: {
    count: 0,
    progress: 0,
  },
  getters: {
    PVL_BUSY_PROGRESS(state) {
      return state.progress;
    },
    PVL_BUSY_COUNT(state) {
      return state.count;
    },
  },
  mutations: {
    PVL_BUSY_PROGRESS_SET(state, value) {
      state.progress = value;
    },
    PVL_BUSY_COUNT_SET(state, value) {
      state.count = value;
    },
  },
  actions: {
    PVL_BUSY_UPDATE_PROGRESS({ state, commit }, delta = 0.5) {
      if (state.count) {
        commit(Mutations.PVL_BUSY_PROGRESS_SET, state.progress + delta);
      } else {
        commit(Mutations.PVL_BUSY_PROGRESS_SET, 0);
      }
    },
  },
};
