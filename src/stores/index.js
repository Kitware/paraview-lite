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

import { Mutations } from 'paraview-lite/src/stores/types';

// http://jsperf.com/typeofvar
// function typeOf(o) {
//   return {}.toString
//     .call(o)
//     .slice(8, -1)
//     .toLowerCase();
// }

// quick object merge using Vue.set
/* eslint-disable no-param-reassign */
// function merge(dst, src) {
//   const keys = Object.keys(src);
//   for (let i = 0; i < keys.length; ++i) {
//     const key = keys[i];
//     if (typeOf(dst[key]) === 'object' && typeOf(src[key]) === 'object') {
//       Vue.set(dst, key, merge(dst[key], src[key]));
//     } else {
//       Vue.set(dst, key, src[key]);
//     }
//   }
//   return dst;
// }
/* eslint-enable no-param-reassign */

function createStore() {
  return new Vuex.Store({
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
      APP_AUTO_APPLY(state) {
        return state.autoApply;
      },
      APP_DARK_THEME(state) {
        return state.dark;
      },
    },
    mutations: {
      APP_ROUTE_SET(state, route) {
        state.route = route;
      },
      APP_AUTO_APPLY_SET(state, auto) {
        state.autoApply = auto;
      },
      APP_DARK_THEME_SET(state, isDark) {
        state.dark = isDark;
      },
    },
    actions: {
      APP_ROUTE_LANDING({ commit }) {
        commit(Mutations.APP_ROUTE_SET, 'landing');
      },
      APP_ROUTE_RUN({ commit }) {
        commit(Mutations.APP_ROUTE_SET, 'app');
      },
    },
  });
}

export default createStore;
