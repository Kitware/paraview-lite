/* eslint-disable no-unused-vars */
import { Mutations } from 'paraview-lite/src/stores/types';

export default {
  state: {
    count: 0,
    progress: 0,
  },
  getters: {
    BUSY_PROGRESS(state) {
      return state.progress;
    },
    BUSY_COUNT(state) {
      return state.count;
    },
  },
  mutations: {
    BUSY_PROGRESS_SET(state, value) {
      state.progress = value;
    },
    BUSY_COUNT_SET(state, value) {
      state.count = value;
    },
  },
  actions: {
    BUSY_UPDATE_PROGRESS({ state, commit }, delta = 0.5) {
      if (state.count) {
        commit(Mutations.BUSY_PROGRESS_SET, state.progress + delta);
      } else {
        commit(Mutations.BUSY_PROGRESS_SET, 0);
      }
    },
  },
};
