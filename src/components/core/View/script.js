import vtkViewProxy from 'vtk.js/Sources/Proxy/Core/ViewProxy';

import { mapGetters, mapActions } from 'vuex';
import { Getters, Actions, Mutations } from 'paraview-lite/src/stores/types';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

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
    this.view.setOrientationAxesVisibility(false);
    this.viewStream.setCamera(this.view.getRenderer().getActiveCamera());

    // Bind user input
    this.view
      .getRenderWindow()
      .getInteractor()
      .onStartAnimation(this.viewStream.startInteraction);
    this.view
      .getRenderWindow()
      .getInteractor()
      .onEndAnimation(this.viewStream.endInteraction);

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
  data() {
    return {
      orientationLabels: ['+X', '+Y', '+Z'],
    };
  },
  computed: mapGetters({
    cameraMode: Getters.VIEW_CAMERA_MODE,
    client: Getters.NETWORK_CLIENT,
    showRenderingStats: Getters.VIEW_STATS,
    stillQuality: Getters.VIEW_QUALITY_STILL,
    interactiveQuality: Getters.VIEW_QUALITY_INTERACTIVE,
    stillRatio: Getters.VIEW_RATIO_STILL,
    interactiveRatio: Getters.VIEW_RATIO_INTERACTIVE,
    mouseThrottle: Getters.VIEW_MOUSE_THROTTLE,
    maxFPS: Getters.VIEW_FPS_MAX,
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
    mouseThrottle() {
      // this.mouseListener.setThrottleTime(this.mouseThrottle);
    },
    maxFPS() {
      this.client.imageStream.setServerAnimationFPS(this.maxFPS);
    },
    cameraMode() {
      this.orientationLabels = ['X', 'Y', 'Z'].map(
        (v) => `${this.cameraMode ? '+' : '-'}${v}`
      );
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
      toggleMode() {
        this.cameraMode = !this.cameraMode;
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
