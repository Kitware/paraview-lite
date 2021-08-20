// Import polyfills
import 'core-js/modules/web.immediate';

/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueVtk from 'vue-vtk-js';

import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

import registerModules from 'paraview-lite/src/modules/registerModules';

import App from 'paraview-lite/src/components/core/RootNode';
import { createStore } from 'paraview-lite/src/stores';

Vue.use(Vuex);
Vue.use(Vuetify, {
  iconfont: 'mdi',
  icons: {
    pvLite: {
      connect: 'mdi-cast-connected',
      close: 'mdi-close',
      error: 'mdi-alert-circle',
      edit: 'mdi-pencil',
      resetCamera: 'mdi-image-filter-center-focus',
      rotateLeft: 'mdi-rotate-left',
      rotateRight: 'mdi-rotate-right',
      undo: 'mdi-undo',
      floating: 'mdi-map-marker-plus',
      cancel: 'mdi-close-circle',
      caretDown: 'mdi-menu-down',
      check: 'mdi-check',
      advanced: 'mdi-settings',
      piecewise: 'mdi-chart-timeline-variant',
      expandRange: 'mdi-arrow-expand-horizontal',
      colorPalette: 'mdi-palette',
      delete: 'mdi-trash-can-outline',
      upDirectory: 'mdi-arrow-top-left',
      directory: 'mdi-folder',
      group: 'mdi-folder-star',
      file: 'mdi-file',
      show: 'mdi-eye-outline',
      hide: 'mdi-eye-off-outline',

      representationType: 'mdi-widgets',
      representationColor: 'mdi-palette',
      representationOpacity: 'mdi-contrast-box',
      time: 'mdi-clock-outline',
      pointSize: 'mdi-chart-bubble',
      lineWidth: 'mdi-format-line-weight',
    },
  },
});
Vue.use(VueVtk);

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
  return { ...vtkURLExtract.extractURLParameters(), ...addOn };
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
