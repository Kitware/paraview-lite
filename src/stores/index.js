// import Vue from 'vue';
import Vuex from 'vuex';

import busy from 'paraview-lite/src/stores/busy';
import color from 'paraview-lite/src/stores/color';
import contexts from 'paraview-lite/src/stores/contexts';
import modules from 'paraview-lite/src/stores/modules';
import network from 'paraview-lite/src/stores/network';
import proxy from 'paraview-lite/src/stores/proxy';
import time from 'paraview-lite/src/stores/time';
import view from 'paraview-lite/src/stores/view';

export const ROOT_STATE = {
  state: {
    route: 'landing', // valid values: landing, app
    autoApply: true,
    dark: false,
  },
  modules: {
    busy,
    color,
    contexts,
    modules,
    network,
    proxy,
    time,
    view,
  },
  getters: {
    PVL_APP_AUTO_APPLY(state) {
      return state.autoApply;
    },
    PVL_APP_DARK_THEME(state) {
      return state.dark;
    },
    PVL_LANDING_VISIBLE(state) {
      return state.route === 'landing';
    },
  },
  mutations: {
    PVL_APP_ROUTE_SET(state, route) {
      state.route = route;
    },
    PVL_APP_AUTO_APPLY_SET(state, auto) {
      state.autoApply = auto;
    },
    PVL_APP_DARK_THEME_SET(state, isDark) {
      state.dark = isDark;
    },
  },
  actions: {
    PVL_APP_ROUTE_LANDING({ commit }) {
      commit('PVL_APP_ROUTE_SET', 'landing');
    },
    PVL_APP_ROUTE_RUN({ commit }) {
      commit('PVL_APP_ROUTE_SET', 'app');
    },
  },
};

export function createStore() {
  return new Vuex.Store(ROOT_STATE);
}

export default createStore;
