import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

const ROTATION_STEP = 2;
const PVL_VIEW_UPS = [[0, 1, 0], [0, 0, 1], [0, 1, 0]];

const actor = vtkActor.newInstance();
const mapper = vtkMapper.newInstance();
const source = vtkPolyData.newInstance();

actor.setMapper(mapper);
mapper.setInputData(source);

function updateCamera(viewProxy, cameraInfo) {
  if (!viewProxy) {
    return;
  }
  const { position, focalPoint, viewUp, centerOfRotation } = cameraInfo;
  const camera = viewProxy.getCamera();
  if (position) {
    camera.setPosition(...position);
  }
  if (focalPoint) {
    camera.setFocalPoint(...focalPoint);
  }
  if (viewUp) {
    camera.setViewUp(...viewUp);
  }
  if (centerOfRotation) {
    viewProxy.getInteractorStyle3D().setCenterOfRotation(centerOfRotation);
  }

  // Update changes
  viewProxy
    .getOpenglRenderWindow()
    .getReferenceByName('viewStream')
    .pushCamera();
  viewProxy.renderLater();
}

export default {
  state: {
    view: '-1',
    stats: false,
    stillQuality: 100,
    interactiveQuality: 80,
    stillRatio: 1,
    interactiveRatio: 1,
    maxFPS: 30,
    mouseThrottle: 16.6,
    camera: null,
    viewProxy: null,
    inAnimation: false,
  },
  getters: {
    PVL_VIEW_STATS(state) {
      return state.stats;
    },
    PVL_VIEW_ID(state) {
      return state.view;
    },
    PVL_VIEW_PROXY(state) {
      return state.viewProxy;
    },
    PVL_VIEW_QUALITY_STILL(state) {
      return state.stillQuality;
    },
    PVL_VIEW_QUALITY_INTERACTIVE(state) {
      return state.interactiveQuality;
    },
    PVL_VIEW_RATIO_STILL(state) {
      return state.stillRatio;
    },
    PVL_VIEW_RATIO_INTERACTIVE(state) {
      return state.interactiveRatio;
    },
    PVL_VIEW_FPS_MAX(state) {
      return state.maxFPS;
    },
    PVL_VIEW_MOUSE_THROTTLE(state) {
      return state.mouseThrottle;
    },
  },
  mutations: {
    PVL_VIEW_PVL_PROXY_SET(state, viewProxy) {
      if (state.viewProxy !== viewProxy) {
        state.viewProxy = viewProxy;
        state.viewProxy.getRenderer().addActor(actor);
      }
    },
    PVL_VIEW_ID_SET(state, id) {
      state.view = id;
    },
    PVL_VIEW_STATS_SET(state, enable) {
      state.stats = enable;
    },
    PVL_VIEW_QUALITY_STILL_SET(state, value) {
      state.stillQuality = value;
    },
    PVL_VIEW_QUALITY_INTERACTIVE_SET(state, value) {
      state.interactiveQuality = value;
    },
    PVL_VIEW_RATIO_STILL_SET(state, value) {
      state.stillRatio = value;
    },
    PVL_VIEW_RATIO_INTERACTIVE_SET(state, value) {
      state.interactiveRatio = value;
    },
    PVL_VIEW_FPS_MAX_SET(state, value) {
      state.maxFPS = value;
    },
    PVL_VIEW_MOUSE_THROTTLE_SET(state, value) {
      state.mouseThrottle = value;
    },
  },
  actions: {
    PVL_VIEW_UPDATE_CAMERA({ getters, state }, id) {
      const client = getters.PVL_NETWORK_CLIENT;
      const viewId = id || state.view;
      if (client && state.viewProxy) {
        client.getRemote().Lite.getCamera(viewId)
          .then(
            ({ focalPoint, viewUp, position, centerOfRotation, bounds }) => {
              // Update bounds in local vtk.js renderer
              source
                .getPoints()
                .setData(
                  Float64Array.from([
                    bounds[0],
                    bounds[2],
                    bounds[4],
                    bounds[1],
                    bounds[3],
                    bounds[5],
                  ]),
                  3
                );

              updateCamera(state.viewProxy, {
                centerOfRotation,
                focalPoint,
                position,
                viewUp,
              });
            }
          )
          .catch(console.error);
      }
    },
    PVL_VIEW_RESET_CAMERA({ dispatch, getters, state }, id) {
      const client = getters.PVL_NETWORK_CLIENT;
      const viewId = id || state.view;
      if (client) {
        client.getRemote().ViewPort.resetCamera(viewId).catch(console.error);
        dispatch('PVL_VIEW_UPDATE_CAMERA', id);
      } else {
        console.error('no client', getters.PVL_NETWORK_CLIENT);
      }
    },
    PVL_VIEW_ROLL_LEFT({ state }) {
      if (state.viewProxy) {
        state.viewProxy.setAnimation(true, this);
        let count = 0;
        let intervalId = null;
        const stopAnimation = () => state.viewProxy.setAnimation(false, this);
        const rotate = () => {
          if (count < 90) {
            count += ROTATION_STEP;
            state.viewProxy.rotate(+ROTATION_STEP);
          } else {
            clearInterval(intervalId);
            setTimeout(stopAnimation, 100);
          }
        };
        intervalId = setInterval(rotate, 10);
      }
    },
    PVL_VIEW_ROLL_RIGHT({ state }) {
      if (state.viewProxy) {
        state.viewProxy.setAnimation(true, this);
        let count = 0;
        let intervalId = null;
        const stopAnimation = () => state.viewProxy.setAnimation(false, this);
        const rotate = () => {
          if (count < 90) {
            count += ROTATION_STEP;
            state.viewProxy.rotate(-ROTATION_STEP);
          } else {
            clearInterval(intervalId);
            setTimeout(stopAnimation, 100);
          }
        };
        intervalId = setInterval(rotate, 10);
      }
    },
    PVL_VIEW_UPDATE_ORIENTATION(
      { state, dispatch },
      { axis, orientation, viewUp }
    ) {
      if (state.viewProxy && !state.inAnimation) {
        state.inAnimation = true;
        state.viewProxy
          .updateOrientation(
            axis,
            orientation,
            viewUp || PVL_VIEW_UPS[axis],
            100
          )
          .then(() => {
            state.inAnimation = false;
            dispatch('PVL_VIEW_RESET_CAMERA');
          });
      }
    },
    PVL_VIEW_RENDER({ getters, state }, id) {
      const client = getters.PVL_NETWORK_CLIENT;
      const viewId = id || state.view;
      if (client) {
        client.getRemote().VtkImageDelivery.stillRender({ view: viewId }).catch(
          console.error
        );
      } else {
        console.error('no client', getters.PVL_NETWORK_CLIENT);
      }
    },
  },
};
