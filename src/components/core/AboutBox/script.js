import SvgIcon from 'paraview-lite/src/components/widgets/SvgIcon';

// ----------------------------------------------------------------------------

export default {
  name: 'AboutBox',
  components: {
    SvgIcon,
  },
  data() {
    return {
      version: window.PARAPVL_VIEW_LITE_VERSION || 'not available',
    };
  },
  computed: {
    darkMode() {
      return this.$store.getters.PVL_APP_DARK_THEME;
    },
    client() {
      return this.$store.getters.PVL_NETWORK_CLIENT;
    },
    sessionURL() {
      if (this.client) {
        return this.client.getConfiguration().sessionURL;
      }
      return null;
    },
    token() {
      if (this.client) {
        return this.client.getConfiguration().secret;
      }
      return null;
    },
  },
};
