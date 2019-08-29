// Import polyfills
import 'core-js/modules/web.immediate';

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
import { createStore } from 'paraview-lite/src/stores';

Vue.use(Vuex);
Vue.use(Vuetify);

/**
 * Sets the active proxy configuration to be used by createViewer.
 *
 * Once createViewer() is called, setActiveProxyConfiguration will do nothing.
 * Proxy config precedence (decreasing order):
 *   createViewer param, active proxy config, Generic config
 */
function createConfigurationFromURLArgs(
  addOn = { application: 'paraview-lite' }
) {
  return Object.assign({}, vtkURLExtract.extractURLParameters(), addOn);
}

const store = createStore();
store.commit('PVL_NETWORK_CONFIG_SET', createConfigurationFromURLArgs());
registerModules(store);
setInterval(() => store.dispatch('PVL_BUSY_UPDATE_PROGRESS', 1), 50);

// Fetch preset images
store.commit('PVL_COLOR_PRESET_NAMES_SET', [
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

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
