import macro from 'vtk.js/Sources/macro';
import vtkInteractorObserver from 'vtk.js/Sources/Rendering/Core/InteractorObserver';
import vtkViewProxy from 'vtk.js/Sources/Proxy/Core/ViewProxy';
import vtkInteractiveOrientationWidget from 'vtk.js/Sources/Widgets/Widgets3D/InteractiveOrientationWidget';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkOrientationMarkerWidget from 'vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget';

import { mapGetters, mapActions } from 'vuex';
import { Getters, Actions, Mutations } from 'paraview-lite/src/stores/types';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function majorAxis(vec3, idxA, idxB) {
  const axis = [0, 0, 0];
  const idx = Math.abs(vec3[idxA]) > Math.abs(vec3[idxB]) ? idxA : idxB;
  const value = vec3[idx] > 0 ? 1 : -1;
  axis[idx] = value;
  return axis;
}

// ----------------------------------------------------------------------------

function vectorToLabel(vec3) {
  if (vec3[0]) {
    return vec3[0] > 0 ? '+X' : '-X';
  }
  if (vec3[1]) {
    return vec3[1] > 0 ? '+Y' : '-Y';
  }
  if (vec3[2]) {
    return vec3[2] > 0 ? '+Z' : '-Z';
  }
  return '';
}

// ----------------------------------------------------------------------------

function toStyle({ x, y }, height) {
  return { top: `${height - y - 12}px`, left: `${x + 20}px` };
}

// ----------------------------------------------------------------------------

function computeOrientation(direction, originalViewUp) {
  let viewUp = [0, 0, 1];
  let axis = 0;
  let orientation = 1;

  if (direction[0]) {
    axis = 0;
    orientation = direction[0] > 0 ? 1 : -1;
    viewUp = majorAxis(originalViewUp, 1, 2);
  }
  if (direction[1]) {
    axis = 1;
    orientation = direction[1] > 0 ? 1 : -1;
    viewUp = majorAxis(originalViewUp, 0, 2);
  }
  if (direction[2]) {
    axis = 2;
    orientation = direction[2] > 0 ? 1 : -1;
    viewUp = majorAxis(originalViewUp, 0, 1);
  }
  return { axis, orientation, viewUp };
}

// ----------------------------------------------------------------------------

function vtkCacheMousePosition(publicAPI, model, initialValues) {
  Object.assign(model, { position: { x: 0, y: 0 } }, initialValues);
  vtkInteractorObserver.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['position']);

  publicAPI.handleMouseMove = (e) => {
    model.position = e.position;
  };
}

vtkCacheMousePosition.newInstance = macro.newInstance(
  vtkCacheMousePosition,
  'vtkCacheMousePosition'
);

// ----------------------------------------------------------------------------

export default {
  name: 'View3D',
  mounted() {
    const container = this.$el.querySelector('.js-renderer');

    this.view = vtkViewProxy.newInstance();
    this.view.setContainer(container);
    this.view.resize();

    // Create and link viewStream
    this.viewStream = this.client.imageStream.createViewStream('-1');
    this.view.getOpenglRenderWindow().setViewStream(this.viewStream);
    this.view.setBackground([0, 0, 0, 0]);
    this.camera = this.view.getCamera();
    this.viewStream.setCamera(this.camera);

    // Bind user input
    const interactor = this.view.getRenderWindow().getInteractor();
    interactor.onStartAnimation(this.viewStream.startInteraction);
    interactor.onEndAnimation(this.viewStream.endInteraction);
    this.mousePositionCache = vtkCacheMousePosition.newInstance();
    this.mousePositionCache.setInteractor(interactor);

    // Add orientation widget
    const orientationWidget = this.view.getReferenceByName('orientationWidget');
    this.widgetManager = vtkWidgetManager.newInstance();
    this.widgetManager.setRenderer(orientationWidget.getRenderer());
    orientationWidget.setViewportCorner(
      vtkOrientationMarkerWidget.Corners.TOP_LEFT
    );

    const bounds = [-0.51, 0.51, -0.51, 0.51, -0.51, 0.51];
    this.widget = vtkInteractiveOrientationWidget.newInstance();
    this.widget.placeWidget(bounds);
    this.widget.setBounds(bounds);
    this.widget.setPlaceFactor(1);
    this.widget.getWidgetState().onModified(() => {
      const state = this.widget.getWidgetState();
      if (!state.getActive()) {
        this.orientationTooltip = '';
        return;
      }
      const direction = state.getDirection();
      const { axis, orientation, viewUp } = computeOrientation(
        direction,
        this.camera.getViewUp()
      );
      this.orientationTooltip = `Reset camera ${orientation > 0 ? '+' : '-'}${
        'XYZ'[axis]
      }/${vectorToLabel(viewUp)}`;
      this.tooltipStyle = toStyle(
        this.mousePositionCache.getPosition(),
        this.view.getOpenglRenderWindow().getSize()[1]
      );
    });

    // Manage user interaction
    this.viewWidget = this.widgetManager.addWidget(this.widget);
    this.viewWidget.onOrientationChange(({ direction }) => {
      this.updateOrientation(
        computeOrientation(direction, this.camera.getViewUp())
      );
    });

    // Initial config
    this.updateQuality();
    this.updateRatio();
    this.client.imageStream.setServerAnimationFPS(this.maxFPS);

    // Expose viewProxy to store (for camera update...)
    this.$store.commit(Mutations.VIEW_PROXY_SET, this.view);

    // Link server side camera to local
    this.client.remote.Lite.getCamera('-1').then((cameraInfo) => {
      this.updateCamera(cameraInfo);
      this.viewStream.pushCamera();
    });
  },
  computed: mapGetters({
    client: Getters.NETWORK_CLIENT,
    showRenderingStats: Getters.VIEW_STATS,
    stillQuality: Getters.VIEW_QUALITY_STILL,
    interactiveQuality: Getters.VIEW_QUALITY_INTERACTIVE,
    stillRatio: Getters.VIEW_RATIO_STILL,
    interactiveRatio: Getters.VIEW_RATIO_INTERACTIVE,
    mouseThrottle: Getters.VIEW_MOUSE_THROTTLE,
    maxFPS: Getters.VIEW_FPS_MAX,
    activeSources: Getters.PROXY_SELECTED_IDS,
  }),
  data() {
    return {
      orientationTooltip: '',
      tooltipStyle: { top: 0, left: 0 },
    };
  },
  watch: {
    showRenderingStats() {
      // this.renderer.setDrawFPS(this.showRenderingStats);
    },
    stillQuality() {
      this.updateQuality();
    },
    interactiveQuality() {
      this.updateQuality();
    },
    stillRatio() {
      this.updateRatio();
    },
    interactiveRatio() {
      this.updateRatio();
    },
    maxFPS() {
      this.client.imageStream.setServerAnimationFPS(this.maxFPS);
    },
  },
  methods: Object.assign(
    {
      onResize() {
        if (this.view) {
          this.view.resize();
          this.view.renderLater();
          this.viewStream.render();
          this.$nextTick(this.widgetManager.enablePicking);
        }
      },
      updateQuality() {
        this.viewStream.setInteractiveQuality(this.interactiveQuality);
      },
      updateRatio() {
        this.viewStream.setInteractiveRatio(this.interactiveRatio);
      },
      updateCamera({ position, focalPoint, viewUp, centerOfRotation }) {
        const camera = this.view.getCamera();
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
          this.view
            .getInteractorStyle3D()
            .setCenterOfRotation(centerOfRotation);
        }
      },
    },
    mapActions({
      updateOrientation: Actions.VIEW_UPDATE_ORIENTATION,
      resetCamera: Actions.VIEW_RESET_CAMERA,
      rollLeft: Actions.VIEW_ROLL_LEFT,
      rollRight: Actions.VIEW_ROLL_RIGHT,
    })
  ),
  beforeDestroy() {
    this.viewStream.delete();
    this.view.delete();
    this.widgetManager.delete();
    this.viewWidget.delete();
    this.widget.delete();
  },
};
