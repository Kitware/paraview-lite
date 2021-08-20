// import Client from 'paraview-lite/src/io/Client';
import SmartConnect from 'wslink/src/SmartConnect';
import vtkWSLinkClient from 'vtk.js/Sources/IO/Core/WSLinkClient';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

import ColorManager from 'paraview-lite/src/io/protocols/ColorManager';
import FileListing from 'paraview-lite/src/io/protocols/FileListing';
import KeyValuePairStore from 'paraview-lite/src/io/protocols/KeyValuePairStore';
import MouseHandler from 'paraview-lite/src/io/protocols/MouseHandler';
import ProgressUpdate from 'paraview-lite/src/io/protocols/ProgressUpdate';
import ProxyManager from 'paraview-lite/src/io/protocols/ProxyManager';
import SaveData from 'paraview-lite/src/io/protocols/SaveData';
import TimeHandler from 'paraview-lite/src/io/protocols/TimeHandler';
import ViewPort from 'paraview-lite/src/io/protocols/ViewPort';
import ViewPortGeometryDelivery from 'paraview-lite/src/io/protocols/ViewPortGeometryDelivery';
import ViewPortImageDelivery from 'paraview-lite/src/io/protocols/ViewPortImageDelivery';
import VtkGeometryDelivery from 'paraview-lite/src/io/protocols/VtkGeometryDelivery';
import VtkImageDelivery from 'paraview-lite/src/io/protocols/VtkImageDelivery';

import Lite from 'paraview-lite/src/io/protocols/Lite';

// Process arguments from URL
const userParams = vtkURLExtract.extractURLParameters();

const REMOTE_API = {
  ColorManager,
  FileListing,
  KeyValuePairStore,
  MouseHandler,
  ProgressUpdate,
  ProxyManager,
  SaveData,
  TimeHandler,
  ViewPort,
  ViewPortGeometryDelivery,
  ViewPortImageDelivery,
  VtkGeometryDelivery,
  VtkImageDelivery,
  // custom
  Lite,
};

vtkWSLinkClient.setSmartConnectClass(SmartConnect);

/* eslint-disable no-param-reassign */
function configDecorator(config) {
  if (userParams.dev) {
    config.sessionURL = `ws://${window.location.hostname}:1234/ws`; // Configured to work on seperate server
  }

  if (config.sessionURL) {
    config.sessionURL = config.sessionURL.replaceAll(
      'USE_HOSTNAME',
      window.location.hostname
    );
    config.sessionURL = config.sessionURL.replaceAll(
      'USE_HOST',
      window.location.host
    );
  }

  // If name is provided we use it as our application and
  // expand any other url params into our config.
  if (userParams.name) {
    config.application = userParams.name;
    return { ...config, ...userParams };
  }
  return config;
}
/* eslint-enable no-param-reassign */

export default {
  state: {
    client: null,
    config: null,
  },
  getters: {
    PVL_NETWORK_CLIENT(state) {
      return state.client;
    },
    PVL_NETWORK_CONFIG(state) {
      return state.config;
    },
  },
  mutations: {
    PVL_NETWORK_CLIENT_SET(state, client) {
      state.client = client;
    },
    PVL_NETWORK_CONFIG_SET(state, config) {
      state.config = config;
    },
  },
  actions: {
    PVL_NETWORK_CONNECT({ commit, dispatch, state }) {
      const { config, client } = state;
      if (client && client.isConnected()) {
        client.disconnect(-1);
      }
      const clientToConnect = vtkWSLinkClient.newInstance({
        protocols: REMOTE_API,
        configDecorator,
      });

      clientToConnect.onBusyChange((count) => {
        commit('PVL_BUSY_COUNT_SET', count);
      });

      clientToConnect.beginBusy();

      clientToConnect.onConnectionError((httpReq) => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          'Connection error';
        console.error(message);
        console.log(httpReq);
      });

      clientToConnect.onConnectionClose((httpReq) => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          'Connection close';
        console.error(message);
        console.log(httpReq);
      });

      clientToConnect
        .connect(config)
        .then((validClient) => {
          commit('PVL_NETWORK_CLIENT_SET', validClient);
          dispatch('PVL_TIME_FETCH_ACTIVE_INDEX');
          dispatch('PVL_PROXY_PIPELINE_FETCH');
          dispatch('PVL_APP_ROUTE_RUN');
          dispatch('PVL_COLOR_FETCH_PRESET_NAMES', 500);
          clientToConnect.endBusy();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
