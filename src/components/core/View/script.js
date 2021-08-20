import { mapGetters } from 'vuex';

export default {
  name: 'VtkView',
  computed: {
    ...mapGetters({
      wsClient: 'PVL_NETWORK_CLIENT',
      viewId: 'PVL_VIEW_ID',
      quality: 'PVL_VIEW_QUALITY_INTERACTIVE',
      ratio: 'PVL_VIEW_RATIO_INTERACTIVE',
    }),
  },
  watch: {
    quality(q) {
      this.$refs.remoteView.setInteractiveQuality(q);
    },
  },
  methods: {
    resetCamera() {
      this.$refs.remoteView.resetCamera();
    },
  },
};
