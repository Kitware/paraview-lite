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
    this.view
      .getRenderWindow()
      .getInteractor()
      .onStartAnimation(this.viewStream.startInteraction);
    this.view
      .getRenderWindow()
      .getInteractor()
      .onEndAnimation(this.viewStream.endInteraction);

    // Add orientation widget
    const orientationWidget = this.view.getReferenceByName('orientationWidget');
    this.widgetManager = vtkWidgetManager.newInstance();
    this.widgetManager.setRenderer(orientationWidget.getRenderer());
    orientationWidget.setViewportCorner(
      vtkOrientationMarkerWidget.Corners.TOP_LEFT
    );

    const bounds = [-0.5, 0.5, -0.5, 0.5, -0.5, 0.5];
    this.widget = vtkInteractiveOrientationWidget.newInstance();
    this.widget.placeWidget(bounds);
    this.widget.setBounds(bounds);
    this.widget.setPlaceFactor(1);

    // Manage user interaction
    this.viewWidget = this.widgetManager.addWidget(this.widget);
    this.viewWidget.onOrientationChange(({ direction }) => {
      const originalViewUp = this.camera.getViewUp();
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
      this.updateOrientation({ axis, orientation, viewUp });
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
    activeSources() {
      this.onResize();
    },
  },
  methods: Object.assign(
    {
      onResize() {
        if (this.view) {
          this.view.resize();
          this.view.renderLater();
          this.viewStream.render();
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
  },
};
