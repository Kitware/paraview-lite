import SmartConnect from 'wslink/src/SmartConnect';

import vtkImageStream from 'vtk.js/Sources/IO/Core/ImageStream';

import ColorManager from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/ColorManager';
import FileListing from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/FileListing';
import KeyValuePairStore from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/KeyValuePairStore';
import MouseHandler from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/MouseHandler';
import ProgressUpdate from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/ProgressUpdate';
import ProxyManager from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/ProxyManager';
import SaveData from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/SaveData';
import TimeHandler from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/TimeHandler';
import ViewPort from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/ViewPort';
import ViewPortGeometryDelivery from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/ViewPortGeometryDelivery';
import ViewPortImageDelivery from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/ViewPortImageDelivery';
import VtkGeometryDelivery from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/VtkGeometryDelivery';
import VtkImageDelivery from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient/VtkImageDelivery';

import Lite from 'paraview-lite/src/io/protocols/Lite';

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

// ----------------------------------------------------------------------------
// Busy feedback handling
// ----------------------------------------------------------------------------

function busy(fn, update) {
  return (...args) =>
    new Promise((resolve, reject) => {
      update(1);
      fn(...args).then(
        (response) => {
          update(-1);
          resolve(response);
        },
        (error) => {
          update(-1);
          reject(error);
        }
      );
    });
}

// ----------------------------------------------------------------------------

function busyWrap(methodMap, update) {
  const busyContainer = {};
  Object.keys(methodMap).forEach((methodName) => {
    busyContainer[methodName] = busy(methodMap[methodName], update);
  });
  return busyContainer;
}

// ----------------------------------------------------------------------------
// Client
// ----------------------------------------------------------------------------

export default class Client {
  constructor() {
    this.config = null;
    this.connection = null;
    this.remote = {};
    this.busyCount = 0;
    this.notifyBusy = () => {
      if (this.busyCallback) {
        this.busyCallback(this.busyCount);
      }
    };
    this.timeoutId = 0;
    this.updateBusy = (delta = 0) => {
      this.busyCount += delta;
      if (this.busyCallback) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = 0;
        }
        if (!this.busyCount) {
          // Try to delay the notification of idle
          this.timeoutId = setTimeout(() => {
            this.notifyBusy();
          }, 50);
        } else {
          this.notifyBusy();
        }
      }
    };
  }

  isConnected() {
    return !!this.connection;
  }

  setBusyCallback(callback) {
    this.busyCallback = callback;
  }

  setConnectionErrorCallback(callback) {
    this.connectionCallback = callback;
  }

  getConfiguration() {
    return this.smartConnect.getConfig();
  }

  connect(config) {
    if (this.connection) {
      return Promise.reject(new Error('Need to disconnect before'));
    }
    return new Promise((resolve, reject) => {
      this.smartConnect = SmartConnect.newInstance({ config });
      this.smartConnect.onConnectionReady((connection) => {
        this.connection = connection;
        this.imageStream = vtkImageStream.newInstance();
        this.remote = {};
        const session = connection.getSession();

        // Link remote API
        Object.keys(REMOTE_API).forEach((name) => {
          this.remote[name] = busyWrap(
            REMOTE_API[name](session),
            this.updateBusy
          );
        });

        // Link imageStream
        this.imageStream.connect(session);

        resolve(this);
      });
      this.smartConnect.onConnectionError((error) => {
        if (this.connectionCallback) {
          this.connectionCallback('errored', error);
        }
        reject(error);
      });
      this.smartConnect.onConnectionClose((close) => {
        if (this.connectionCallback) {
          this.connectionCallback('closed', close);
        }
        reject(close);
      });
      this.smartConnect.connect();
    });
  }

  disconnect(timeout = 60) {
    if (this.connection) {
      this.connection.destroy(timeout);
      this.connection = null;
    }
  }
}
