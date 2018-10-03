/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import registerModules from 'paraview-lite/src/modules/registerModules';

import App from 'paraview-lite/src/components/core/App';
import createStore from 'paraview-lite/src/stores';
import { Mutations, Actions } from 'paraview-lite/src/stores/types';

Vue.use(Vuex);
Vue.use(Vuetify);

/**
 * Sets the active proxy configuration to be used by createViewer.
 *
 * Once createViewer() is called, setActiveProxyConfiguration will do nothing.
 * Proxy config precedence (decreasing order):
 *   createViewer param, active proxy config, Generic config
 */
export function createConfigurationFromURLArgs(
  addOn = { application: 'paraview-lite' }
) {
  return Object.assign({}, vtkURLExtract.extractURLParameters(), addOn);
}

export function createViewer(
  container,
  config = createConfigurationFromURLArgs()
) {
  const store = createStore();
  store.commit(Mutations.NETWORK_CONFIG_SET, config);
  registerModules(store);
  setInterval(() => store.dispatch(Actions.BUSY_UPDATE_PROGRESS, 1), 50);

  // Fetch preset images
  store.commit(Mutations.COLOR_PRESET_NAMES_SET, [
    'Cool to Warm',
    'Cool to Warm (Extended)',
    'Rainbow Desaturated',
    'Cold and Hot',
    'erdc_rainbow_bright',
    '2hot',
    'erdc_iceFire_H',
    'erdc_iceFire_L',
    'Inferno (matplotlib)',
  ]);

  /* eslint-disable no-new */
  new Vue({
    el: container || '#root-container',
    components: { App },
    store,
    template: '<App />',
  });

  // support history-based navigation
  function onRoute(event) {
    const state = event.state || {};
    if (state.app) {
      store.dispatch(Actions.APP_ROUTE_RUN);
    } else {
      store.dispatch(Actions.APP_ROUTE_LANDING);
    }
  }
  store.watch(
    (state) => state.route,
    (route) => {
      const state = window.history.state || {};
      if (route === 'landing' && state.app) {
        window.history.back();
      }
      if (route === 'app' && !state.app) {
        window.history.pushState({ app: true }, '');
      }
    }
  );
  window.history.replaceState({ app: false }, '');
  window.addEventListener('popstate', onRoute);

  return {
    container,
    store,
  };
}
